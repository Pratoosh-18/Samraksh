from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from server.auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from server.resources.user import User, user_collection, user_helper

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class Token(BaseModel):
    access_token: str
    token_type: str


# Registration Route
@router.post("/register")
async def register(user: User):
    existing_user = await user_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered",
        )
    hashed_password = hash_password(user.password)
    user_data = {
        "email": user.email,
        "password": hashed_password,
        "role": "USER",
        "isAppliedForAdmin": False,
    }
    new_user = await user_collection.insert_one(user_data)
    return user_helper(await user_collection.find_one({"_id": new_user.inserted_id}))


# Login Route
@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"email": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}


# Protected Route
@router.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception
    email = payload.get("email")
    user = await user_collection.find_one({"email": email})
    if not user:
        raise credentials_exception
    return user_helper(user)
