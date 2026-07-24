from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pypdf import PdfReader
from io import BytesIO
from app.gemini_client import stream_response

router = APIRouter(prefix="/api/resume", tags=["resume-analyzer"])

SYSTEM_PROMPT = """You are an ATS (Applicant Tracking System) and resume expert.
Given resume text (and optionally a target role), respond in this exact structure:

## ATS Score
Give a score out of 100 with a one-line justification.

## Missing Keywords
List important keywords/skills missing for the target role (or general industry standards if no role given).

## Weak Bullet Points
Quote up to 3 weak bullets (paraphrase them, don't just copy) and explain why they're weak.

## Suggested Rewrites
Rewrite those bullets to be stronger (action verb + impact + metric where possible).

## Suggested Projects
1-2 project ideas that would strengthen this resume for the target role.

Be specific and reference actual content from the resume, not generic tips."""


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: str = Form(default=""),
):
    file_bytes = await file.read()
    resume_text = extract_text_from_pdf(file_bytes)

    user_prompt = f"""Target role: {target_role or 'Not specified — give general feedback'}

Resume text:
{resume_text}"""

    return StreamingResponse(
        stream_response(SYSTEM_PROMPT, user_prompt),
        media_type="text/plain",
    )
