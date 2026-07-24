# CareerPilot AI — Frontend

React + Vite + Tailwind frontend for CareerPilot AI's core modules: Career Discovery, Resume Analyzer, JD Analyzer, and Interview Coach. This connects to the FastAPI backend running locally on port 8000.

## Setup

```
npm install
npm run dev
```

Opens at `http://localhost:5173`. Ensure the backend (`uvicorn app.main:app --reload`) is running simultaneously, as this frontend calls its API endpoints directly.

## API Integration

The frontend routes are configured to map to the backend endpoints as follows:

| Module            | Endpoint                  |
|--------------------|------------------------------------|
| Career Discovery   | `POST /api/career/discover`        |
| Resume Analyzer    | `POST /api/resume/analyze` (multipart, field name `file`) |
| JD Analyzer        | `POST /api/jd/analyze`             |
| Interview Coach    | `POST /api/interview/questions` |

If there are CORS errors in the browser console, ensure that the backend's `FRONTEND_ORIGIN` in `.env` is set to `http://localhost:5173`.

## Notes

- **Streaming:** Each module processes the response body as a stream and renders chunks progressively for optimal user experience.
