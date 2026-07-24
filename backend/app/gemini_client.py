import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set. Copy .env.example to .env and add your key.")

genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash"  # fast + free-tier friendly; swap to gemini-1.5-pro if you need more quality


def get_model(system_instruction: str):
    """Create a Gemini model instance with a fixed system prompt for a given module."""
    return genai.GenerativeModel(
        model_name=MODEL_NAME,
        system_instruction=system_instruction,
    )


def stream_response(system_instruction: str, user_prompt: str):
    """Generator that yields text chunks as they arrive from Gemini.
    Used by FastAPI's StreamingResponse so the frontend can render progressively.
    """
    model = get_model(system_instruction)
    response = model.generate_content(user_prompt, stream=True)
    for chunk in response:
        if chunk.text:
            yield chunk.text
