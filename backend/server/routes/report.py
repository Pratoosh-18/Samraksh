import os
import shutil
import time

from dotenv import load_dotenv
from fastapi import APIRouter, Body, File, Form, UploadFile
from fastapi.responses import JSONResponse
from server.data.app_data import app_data
from server.detectors.face import is_valid_face
from server.libs.upload_img import upload_image
from server.resources.report_lost_child import (
    UpdateReportLostChild,
    report_lost_child,
    retrieve_lost_child_reports,
    update_lost_child_report,
)

load_dotenv()
router = APIRouter()

IMAGES_PATH = os.getenv("IMAGES_PATH")

valid_image_types = ["image/jpeg", "image/png", "image/gif"]


@router.get("/retrieve-lost-child-reports")
async def retrieve_lost_child_reports_api():
    return await retrieve_lost_child_reports()


@router.post("/report-lost-child")
async def report_lost_child_api(
    fullname: str = Form(...),
    gender: str = Form(...),
    age: float = Form(...),
    describe_appearance: str = Form(...),
    last_seen_location: str = Form(...),
    follow_up_name: str = Form(...),
    follow_up_phone: int = Form(...),
    file: UploadFile = File(...),
):
    if file.content_type not in valid_image_types:
        return JSONResponse(
            content={"message": "Uploaded Image is not of correct type"},
            status_code=400,
        )

    try:
        filename = time.time() * 1000
        save_file_path = f"{IMAGES_PATH}/face/{filename}.jpg"
        with open(save_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        is_valid_img = is_valid_face(save_file_path)
        child_img = await upload_image(save_file_path)

        if not is_valid_img:
            return JSONResponse(
                content={"message": "Invalid Image, unable to extract facial features"},
                status_code=400,
            )

        lost_child_data = {
            "fullname": fullname,
            "age": age,
            "gender": gender,
            "describe_appearance": describe_appearance,
            "last_seen_location": last_seen_location,
            "follow_up_name": follow_up_name,
            "follow_up_phone": follow_up_phone,
            "child_img": child_img,
            "detected_near": "",
            "is_detected": False,
            "status": "lost",
        }

        report = await report_lost_child.insert_one(lost_child_data)
        report_id = str(report.inserted_id)
        os.rename(save_file_path, f"{IMAGES_PATH}/face/{report_id}.jpg")
        app_data["face_ids_map"][report_id] = fullname

        return JSONResponse(
            content={"message": "Form submitted Successfully."}, status_code=200
        )

    except Exception as e:
        return JSONResponse(
            content={"message": f"An error occurred: {str(e)}"}, status_code=500
        )


@router.post("/update-report-lost-child/{id}")
async def update_report(id: str, req: UpdateReportLostChild = Body(...)):
    req = {k: v for k, v in req.dict().items() if v is not None}
    is_updated = await update_lost_child_report(id, req)

    if is_updated:
        return JSONResponse(
            content={"message": "Updated Successfully."}, status_code=200
        )
    else:
        return JSONResponse(content={"message": "Update Failed!"}, status_code=500)