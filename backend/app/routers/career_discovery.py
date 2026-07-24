from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.gemini_client import stream_response

router = APIRouter(prefix="/api/career-discovery", tags=["career-discovery"])

SYSTEM_PROMPT = """You are a career guidance expert for students and early-career professionals.
Given a user's education, skills, interests, and goals, respond in this exact structure:

## Recommended Careers
List 3 best-fit careers. For each: one-line reason it fits, general salary range (state it's an estimate), growth outlook.

## Skill Gap
Compare their current skills to what these careers typically require.
List missing skills in priority order (most important first).

Be concise, practical, and specific to their input. Do not pad with generic advice."""


class CareerDiscoveryRequest(BaseModel):
    education: str
    skills: str
    interests: str
    strengths: str
    goals: str


@router.post("/analyze")
async def analyze_career(payload: CareerDiscoveryRequest):
    user_prompt = f"""Education: {payload.education}
Current skills: {payload.skills}
Interests: {payload.interests}
Strengths: {payload.strengths}
Career goals: {payload.goals}"""

    return StreamingResponse(
        stream_response(SYSTEM_PROMPT, user_prompt),
        media_type="text/plain",
    )
