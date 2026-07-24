from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.gemini_client import stream_response

router = APIRouter(prefix="/api/jd", tags=["jd-analyzer"])

SYSTEM_PROMPT = """You are a job description analysis expert.
Given a pasted job description, extract and respond in this exact structure:

## Required Skills
List technical and soft skills required, split into "Must-have" and "Nice-to-have".

## Key Responsibilities
Bullet list, plain language.

## Experience Level
State the seniority level and years of experience expected.

## Key Technologies
List specific tools/technologies/frameworks mentioned.

## Important Keywords
List 8-10 keywords a candidate should mirror in their resume/cover letter for ATS matching.

Be precise and only extract what's actually in the text — don't invent requirements."""


class JDRequest(BaseModel):
    job_description: str


@router.post("/analyze")
async def analyze_jd(payload: JDRequest):
    return StreamingResponse(
        stream_response(SYSTEM_PROMPT, payload.job_description),
        media_type="text/plain",
    )
