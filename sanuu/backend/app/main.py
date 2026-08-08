from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers.user_router import router as user_router
from app.routers.issue_router import router as issue_router
from app.routers.category_router import router as category_router
from app.routers.feedback_router import router as feedback_router


app = FastAPI(
    title="Residency Issue Tracker API",
    description="Python Full Stack Internship Project",
    version="1.0.0"
)


# ===============================
# Create Database Tables
# ===============================
Base.metadata.create_all(bind=engine)



# ===============================
# CORS Configuration
# ===============================
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "*"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)



# ===============================
# Home Route
# ===============================



# ===============================
# Include Routers
# ===============================

app.include_router(user_router)

app.include_router(issue_router)

app.include_router(category_router)

app.include_router(feedback_router)
from fastapi.staticfiles import StaticFiles
import os

FRONTEND_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../frontend"
    )
)

app.mount(
    "/",
    StaticFiles(directory=FRONTEND_DIR, html=True),
    name="frontend"
)

app.mount(
    "/",
    StaticFiles(directory=FRONTEND_DIR, html=True),
    name="frontend"
)
