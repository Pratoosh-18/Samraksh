import math
from datetime import datetime

import cv2
import cvzone
import numpy as np
from server.data.app_data import app_data
from server.data.yolo_classnames import classNames
from server.sort import Sort
from ultralytics import YOLO

model = YOLO("./server/assets/models/yolov8n.pt")
tracker = Sort(max_age=75, min_hits=3, iou_threshold=0.3)


def detect_blockade(frame):
    results = model(frame, stream=True)

    detected_persons_ids_map = app_data["detected_persons_ids_map"]
    detected_persons_ids = app_data["detected_persons_ids_map"].keys()
    detected_person_counts = len(detected_persons_ids)

    detections = np.empty((0, 5))

    for r in results:
        boxes = r.boxes
        for box in boxes:
            # Bounding Box
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

            # Confidence
            conf = math.ceil((box.conf[0] * 100)) / 100

            # ClassName
            cls = int(box.cls[0])
            current_class = classNames[cls]
            required_classes = ["person"]

            if current_class in required_classes and conf > 0.3:
                current_array = np.array([x1, y1, x2, y2, conf])
                detections = np.vstack((detections, current_array))

    results_tracker = tracker.update(detections)

    for result in results_tracker:
        x1, y1, x2, y2, p_id = result

        x1, y1, x2, y2, p_id = int(x1), int(y1), int(x2), int(y2), int(p_id)
        w, h = x2 - x1, y2 - y1

        if p_id not in detected_persons_ids:
            detected_person_counts += 1
            detected_persons_ids_map[p_id] = {
                "p_no": detected_person_counts + 1,
                "first_detacted": datetime.utcnow().isoformat() + "Z",
                "last_detacted": datetime.utcnow().isoformat() + "Z",
            }

        else:
            detected_persons_ids_map[p_id]["last_detacted"] = (
                datetime.utcnow().isoformat() + "Z"
            )

        cvzone.cornerRect(
            frame,
            bbox=(x1, y1, w, h),
            l=9,
            rt=3,
            colorR=(255, 0, 255),
        )

        cvzone.putTextRect(
            frame,
            text=f"Person {detected_persons_ids_map[p_id]["p_no"]}",
            pos=(max(0, x1), max(30, y1)),
            font=cv2.FONT_HERSHEY_DUPLEX,
            scale=1,
            thickness=1,
            offset=3,
        )