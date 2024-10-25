from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes.app_data import router as DataRouter
from server.routes.auth import router as AuthRouter
from server.routes.live_stream import router as VideoStreamRouter
from server.routes.report import router as ReportRouter
from server.routes.sos import router as SOSRouter

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(AuthRouter, tags=["Authentication"], prefix="/auth")
app.include_router(DataRouter, tags=["Data Operations"], prefix="")
app.include_router(ReportRouter, tags=["Report Child"], prefix="")
app.include_router(VideoStreamRouter, tags=["Video Stream"], prefix="")
app.include_router(SOSRouter, tags=["SOS"], prefix="")


@app.get("/ping", tags=["ping"])
def ping():
    return {"isActive": True}


@app.get("/", tags=["ping"])
def helloworld():
    return {"hey": "its kk"}