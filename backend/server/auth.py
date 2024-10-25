from datetime import datetime, timedelta, timezone
from typing import Optional

from decouple import config
from jose import JWTError, jwt
from passlib.context import CryptContext

# Retriving env variables
SECRET_KEY = config("SECRET_KEY")
ALGORITHM = config("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Hash the password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# Verify hashed password
def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Create a JWT token
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Decode and validate JWT token
def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
