import asyncio
import os
import shutil

from dotenv import load_dotenv
from fastapi import APIRouter, File, UploadFile, WebSocket
from fastapi.responses import JSONResponse
from server.data.app_data import app_data
from server.resources.report_lost_child import retrieve_lost_child_reports
from starlette.websockets import WebSocketDisconnect

load_dotenv()
router = APIRouter()

VIDEOS_PATH = os.getenv("VIDEOS_PATH")


# Upload Videos
@router.post("/upload-custom-video")
async def upload_video(file: UploadFile = File(...)):
    try:
        with open(f"{VIDEOS_PATH}/custom/{file.filename}", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        app_data["uploaded_videos_list"] = sorted(os.listdir(f"{VIDEOS_PATH}/custom"))

        return JSONResponse(
            content={"message": "Upload successful", "filename": file.filename}
        )
    except Exception as e:
        return JSONResponse(
            content={"message": f"An error occurred: {str(e)}"}, status_code=500
        )


# Function to stream app data via WebSocket
async def stream_detection_data(websocket: WebSocket):
    await websocket.accept()
    lost_child_reports = await retrieve_lost_child_reports()
    app_data["uploaded_videos_list"] = sorted(os.listdir(f"{VIDEOS_PATH}/custom"))

    for report in lost_child_reports:
        app_data["face_ids_map"][report["id"]] = report["fullname"]

    try:
        while True:
            await websocket.send_json(app_data)
            await asyncio.sleep(0.15)  # Adjust this delay as needed
    except WebSocketDisconnect:
        print("WebSocket disconnected")


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await stream_detection_data(websocket)
