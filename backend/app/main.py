import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import career_discovery, resume_analyzer, jd_analyzer, interview_coach

load_dotenv()

app = FastAPI(title="CareerPilot AI API")

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(career_discovery.router)
app.include_router(resume_analyzer.router)
app.include_router(jd_analyzer.router)
app.include_router(interview_coach.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
