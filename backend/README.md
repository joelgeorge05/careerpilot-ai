# CareerPilot AI — Backend

FastAPI backend for CareerPilot AI: Career Discovery + Skill Gap, Resume Analyzer, JD Analyzer, Interview Coach.

## Local setup

```bash
cd careerpilot-backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # then paste your Gemini API key into .env
uvicorn app.main:app --reload
```

API docs (auto-generated): http://localhost:8000/docs

## Endpoints

- `POST /api/career-discovery/analyze` — JSON body: education, skills, interests, strengths, goals
- `POST /api/resume/analyze` — multipart form: `file` (PDF), `target_role` (optional text)
- `POST /api/jd/analyze` — JSON body: job_description
- `POST /api/interview/questions` — JSON body: interview_type (HR/Technical/Behavioral), role_context

All endpoints return a **streaming plain-text response** — read it as a stream on the frontend to render progressively.

## Docker

```bash
docker build -t careerpilot-backend .
docker run -p 8000:8000 --env-file .env careerpilot-backend
```

## Getting a Gemini API key

1. Go to https://aistudio.google.com/app/apikey
2. Create a free API key
3. Paste it into `.env` as `GEMINI_API_KEY`

## Deployment

The application is containerized and can be deployed to AWS App Runner, Elastic Beanstalk, or any other container hosting service. Ensure that `GEMINI_API_KEY` and `FRONTEND_ORIGIN` are set as environment variables on the platform.
