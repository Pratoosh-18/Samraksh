import cv2
from server.data.app_data import app_data
from ultralytics import YOLO

model = YOLO("./server/assets/models/weapon.pt")


def detect_weapon(frame):
    results = model(frame, stream=True)
    active_guns = 0

    for result in results:
        classes = result.names
        cls = result.boxes.cls
        conf = result.boxes.conf
        detections = result.boxes.xyxy

        for pos, detection in enumerate(detections):
            if conf[pos] >= 0.4:
                xmin, ymin, xmax, ymax = detection

                label = f"{classes[int(cls[pos])]} {conf[pos]:.2f}"
                color = (0, int(cls[pos]), 255)
                cv2.rectangle(
                    frame, (int(xmin), int(ymin)), (int(xmax), int(ymax)), color, 2
                )
                cv2.putText(
                    frame,
                    label,
                    (int(xmin), int(ymin) - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    color,
                    1,
                    cv2.LINE_AA,
                )

        app_data["active_guns"] = active_guns
