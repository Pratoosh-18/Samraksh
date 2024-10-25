from fastapi import FastAPI, HTTPException
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

app = FastAPI()

async def upload_image(file_path: str):
    try:
        upload_result = cloudinary.uploader.upload(file_path)
        return upload_result["url"]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
