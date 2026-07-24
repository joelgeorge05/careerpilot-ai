from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Literal
from app.gemini_client import stream_response

router = APIRouter(prefix="/api/interview", tags=["interview-coach"])

SYSTEM_PROMPT = """You are an experienced interview coach.
Given an interview type and optional role/JD context, respond in this exact structure:

## Likely Questions
List 6 questions typical for this interview type and role.

## Model Answers
For each question, give a brief model-answer outline (structure, not a full script) — e.g. for behavioral, use STAR format pointers.

## Follow-up Questions
List 2-3 follow-ups an interviewer might ask to probe deeper.

## Tips
3 concise, non-generic tips specific to this interview type.

Tailor everything to the role/context given. Keep it practical, not textbook-generic."""


class InterviewRequest(BaseModel):
    interview_type: Literal["HR", "Technical", "Behavioral"]
    role_context: str = ""


@router.post("/questions")
async def get_interview_questions(payload: InterviewRequest):
    user_prompt = f"""Interview type: {payload.interview_type}
Role/context: {payload.role_context or 'General — no specific role given'}"""

    return StreamingResponse(
        stream_response(SYSTEM_PROMPT, user_prompt),
        media_type="text/plain",
    )
