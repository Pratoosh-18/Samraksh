from typing import Optional

from pydantic import BaseModel, EmailStr
from server.db import database

user_collection = database.get_collection("user")


class User(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = "USER"  # USER | ADMIN | MODERATOR
    isAppliedForAdmin: Optional[bool] = False


# helper
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "isAppliedForAdmin": user["isAppliedForAdmin"],
    }
