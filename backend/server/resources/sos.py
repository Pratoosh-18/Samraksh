from typing import Optional

from bson.objectid import ObjectId
from pydantic import BaseModel
from server.db import database

sos_collection = database.get_collection("SOS")


class SOS(BaseModel):
    ip_address: str
    description: str
    phoneno: int
    is_resolved: Optional[bool] = False


class UpdateSOS(BaseModel):
    ip_address: Optional[str] = None
    description: Optional[str] = None
    phoneno: Optional[int] = None
    is_resolved: Optional[bool] = False


# helper
def sos_helper(sos):
    return {
        "id": str(sos["_id"]),
        "ip_address": sos["ip_address"],
        "description": sos["description"],
        "phoneno": sos["phoneno"],
        "is_resolved": sos["is_resolved"]
    }


async def retrieve_soss():
    soss = []
    async for sos in sos_collection.find():
        soss.append(sos_helper(sos))
    return soss


async def update_sos(id: str, data: dict):
    if len(data) < 1:
        return False
    sos = await sos_collection.find_one({"_id": ObjectId(id)})
    if sos:
        updated_sos = await sos_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if updated_sos:
            return True
        return False
    else:
        return False