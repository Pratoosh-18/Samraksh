import motor.motor_asyncio
from decouple import config

# Retriving env variables
MONGODB_CONN_URL = config("MONGODB_CONN_URL")
MONGODB_DB_NAME = config("MONGODB_DB_NAME")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_CONN_URL)
database = client[MONGODB_DB_NAME]
