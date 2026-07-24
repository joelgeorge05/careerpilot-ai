// Base URL of your FastAPI backend. Locally this falls back to your
// uvicorn dev server; in production, Vercel injects VITE_API_URL
// (set in your Vercel project settings) pointing at the deployed backend.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Endpoint paths — these match the router files from careerpilot-backend.
// If your route paths differ (check app/routers/*.py or /docs), update them here
// in ONE place rather than hunting through every component.
export const ENDPOINTS = {
  careerDiscovery: `${API_BASE}/api/career-discovery/analyze`,
  resumeAnalyzer: `${API_BASE}/api/resume/analyze`,
  jdAnalyzer: `${API_BASE}/api/jd/analyze`,
  interviewCoach: `${API_BASE}/api/interview/questions`,
}

/**
 * Calls a streaming FastAPI endpoint (JSON body) and feeds text chunks
 * to onChunk as they arrive, so the UI can render output live instead of
 * waiting for the full response.
 */
export async function streamJSON({ url, body, onChunk, onDone, onError }) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(`Server responded ${response.status}: ${text || response.statusText}`)
    }

    if (!response.body) {
      // Fallback: backend didn't stream, just read it all at once
      const text = await response.text()
      onChunk(text)
      onDone?.()
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      onChunk(decoder.decode(value, { stream: true }))
    }
    onDone?.()
  } catch (err) {
    onError?.(err)
  }
}

/**
 * Same as streamJSON but sends multipart/form-data — used for the
 * resume PDF upload endpoint.
 */
export async function streamFormData({ url, formData, onChunk, onDone, onError }) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(`Server responded ${response.status}: ${text || response.statusText}`)
    }

    if (!response.body) {
      const text = await response.text()
      onChunk(text)
      onDone?.()
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      onChunk(decoder.decode(value, { stream: true }))
    }
    onDone?.()
  } catch (err) {
    onError?.(err)
  }
}
