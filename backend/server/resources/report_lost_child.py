from typing import Optional

from bson.objectid import ObjectId
from pydantic import BaseModel
from server.db import database

report_lost_child = database.get_collection("reportLostChild")


class ReportLostChild(BaseModel):
    fullname: str
    age: float
    gender: str
    describe_appearance: str
    last_seen_location: str
    follow_up_name: str
    follow_up_phone: str
    detected_near: str
    is_detected: bool
    status: str


class UpdateReportLostChild(BaseModel):
    fullname: Optional[str] = None
    age: Optional[float] = None
    gender: Optional[str] = None
    describe_appearance: Optional[str] = None
    last_seen_location: Optional[str] = None
    follow_up_name: Optional[str] = None
    follow_up_phone: Optional[str] = None
    detected_near: Optional[str] = None
    is_detected: Optional[bool] = None
    status: Optional[str] = None


# helper
def report_lost_child_helper(report):
    return {
        "id": str(report["_id"]),
        "fullname": report["fullname"],
        "age": report["age"],
        "gender": report["gender"],
        "describe_appearance": report["describe_appearance"],
        "last_seen_location": report["last_seen_location"],
        "follow_up_name": report["follow_up_name"],
        "follow_up_phone": report["follow_up_phone"],
        "child_img": report["child_img"],
        "detected_near": report["detected_near"],
        "is_detected": report["is_detected"],
        "status": report["status"],
    }


async def retrieve_lost_child_reports():
    reports = []
    async for report in report_lost_child.find():
        reports.append(report_lost_child_helper(report))
    return reports


async def update_lost_child_report(id: str, data: dict):
    if len(data) < 1:
        return False
    student = await report_lost_child.find_one({"_id": ObjectId(id)})
    if student:
        updated_student = await report_lost_child.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if updated_student:
            return True
        return False
    else:
        return False