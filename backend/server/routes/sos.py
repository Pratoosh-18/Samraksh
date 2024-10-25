import os
import shutil
import time

from dotenv import load_dotenv
from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from server.data.app_data import app_data
from server.detectors.face import is_valid_face
from server.libs.upload_img import upload_image
from server.resources.sos import (
    sos_collection,
    retrieve_soss,
    update_sos,
    SOS,
    UpdateSOS
)

router = APIRouter()


@router.get("/retrieve-soss")
async def retrieve_s0ss_api():
    return await retrieve_soss()


@router.post("/add-sos")
async def add_sos(req: SOS = Body(...)):
    sos = jsonable_encoder(req)
    sos = await sos_collection.insert_one(sos)
    sos_id = str(sos.inserted_id)

    if sos_id:
        return JSONResponse(
            content={"message": "Form submitted Successfully."}, status_code=200
        )
    else:
        return JSONResponse(
            content={"message": "Something went wrong while adding SOS."}, status_code=500
        )


@router.post("/update-sos/{id}")
async def update_report(id: str, req: UpdateSOS = Body(...)):
    req = {k: v for k, v in req.dict().items() if v is not None}
    is_updated = await update_sos(id, req)

    if is_updated:
        return JSONResponse(
            content={"message": "Updated Successfully."}, status_code=200
        )
    else:
        return JSONResponse(content={"message": "Update Failed!"}, status_code=500)