import os
import time

import cv2
import numpy as np
from dotenv import load_dotenv
from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from server.data.app_data import app_data
from server.detectors.blockade import detect_blockade
from server.detectors.face import detect_face
from server.detectors.person_body import detect_person_body
from server.detectors.weapon import detect_weapon

load_dotenv()
router = APIRouter()

VIDEOS_PATH = os.getenv("VIDEOS_PATH")

default_video_map = {
    "crowd_detection": "person/crowsC2.mp4",
    "blockade_detection": "person/crowsC2.mp4",
    "weapon_detection": "weapon/test4.mp4",
    "face_detection": "face/modig.mp4",
}


# Function to generate video frames
def generate_frames(cap, active_model, face_detection_id):
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0:
        fps = 30
    frame_delay = 1 / fps

    while True:
        start_time = time.time()
        success, frame = cap.read()

        if not success:
            print("Unable to capture video")
            app_data["active_persons"] = 0
            app_data["active_guns"] = 0
            app_data["detected_persons_ids_map"] = {}
            break

        # Process frame
        if active_model == "crowd_detection":
            detect_person_body(frame)

        if active_model == "blockade_detection":
            detect_blockade(frame)

        if active_model == "weapon_detection":
            detect_weapon(frame)

        if active_model == "face_detection":
            detect_face(frame, face_detection_id)

        # Encode frame in JPEG format
        _, buffer = cv2.imencode(".jpg", frame)
        frame = buffer.tobytes()

        # Yield the frame with a specific format for streaming
        yield (b"--frame\r\n" + b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")

        processing_time = time.time() - start_time
        if processing_time < frame_delay:
            time.sleep(frame_delay - processing_time)

    cap.release()


@router.get("/stream-video")
def stream_video(
    active_model: str = Query(
        "crowd_detection",
        description="[crowd_detection / weapon_detection / face_detection / blockade_detection]",
    ),
    upload_file_idx: int = Query(-1, description="[index of custom video path]"),
    face_detection_id: str = Query(
        "all", description=["all / id of the lost child report"]
    ),
):
    all_upload_files = app_data["uploaded_videos_list"]

    if upload_file_idx != -1 and upload_file_idx < len(all_upload_files):
        file_name = all_upload_files[upload_file_idx]
        cap = cv2.VideoCapture(f"{VIDEOS_PATH}/custom/{file_name}")
    elif active_model in [
        "crowd_detection",
        "blockade_detection",
        "weapon_detection",
        "face_detection",
    ]:
        cap = cv2.VideoCapture(f"{VIDEOS_PATH}/{default_video_map[active_model]}")
    else:
        cap = cv2.VideoCapture(f"{VIDEOS_PATH}/{default_video_map["crowd_detection"]}")

    return StreamingResponse(
        generate_frames(cap, active_model, face_detection_id),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@router.websocket("/stream-cam")
async def stream_cam(websocket: WebSocket):
    # Extract query parameters from WebSocket scope
    query_params = websocket.scope["query_string"].decode("utf-8")
    params = dict(param.split("=") for param in query_params.split("&"))

    # Example usage: Get specific parameters from query
    active_model = params.get(
        "active_model",
        "crowd_detection",  # default value
    )

    face_detection_id = params.get("face_detection_id", "all")

    await websocket.accept()
    try:
        while True:
            # Receive the JPEG-encoded frame from frontend
            data = await websocket.receive_bytes()

            # Decode the JPEG image to a numpy array
            np_arr = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                print("Failed to decode frame")
                continue

            # Process frame
            if active_model == "crowd_detection":
                detect_person_body(frame)

            if active_model == "blockade_detection":
                detect_blockade(frame)

            if active_model == "weapon_detection":
                detect_weapon(frame)

            if active_model == "face_detection":
                detect_face(frame, face_detection_id)

            _, encoded_frame = cv2.imencode(".jpg", frame)

            # Send the processed frame back to frontend
            await websocket.send_bytes(encoded_frame.tobytes())

    except WebSocketDisconnect:
        print("Client disconnected")
        app_data["active_persons"] = 0
        app_data["active_guns"] = 0
        app_data["detected_persons_ids_map"] = {}
