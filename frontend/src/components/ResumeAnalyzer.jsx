import { useState, useRef, useMemo } from 'react'
import { streamFormData, ENDPOINTS } from '../lib/api'
import ReadoutPanel from './ReadoutPanel'
import ScoreGauge from './ScoreGauge'

// Pulls the ATS score number out of the streamed markdown response.
// Backend prompt asks for "a score out of 100", so we look for the
// most common phrasings a model tends to use for that.
function extractScore(text) {
  if (!text) return null
  const patterns = [
    /(\d{1,3})\s*\/\s*100/,
    /score[^\d]{0,20}(\d{1,3})\s*%/i,
    /score[^\d]{0,20}(\d{1,3})/i,
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const value = parseInt(match[1], 10)
      if (!Number.isNaN(value) && value >= 0 && value <= 100) return value
    }
  }
  return null
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null)
  const [targetRole, setTargetRole] = useState('')
  const [status, setStatus] = useState('idle')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const score = useMemo(
    () => (status === 'done' ? extractScore(text) : null),
    [status, text]
  )

  async function run(e) {
    e.preventDefault()
    if (!file) {
      setError('Attach a PDF resume first.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setText('')
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    if (targetRole) formData.append('target_role', targetRole)

    await streamFormData({
      url: ENDPOINTS.resumeAnalyzer,
      formData,
      onChunk: (chunk) => setText((t) => t + chunk),
      onDone: () => setStatus('done'),
      onError: (err) => {
        setError(err.message)
        setStatus('error')
      },
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={run} className="space-y-4">
        <div>
          <label className="font-mono text-[11px] text-mute uppercase tracking-wide mb-1 block">
            Resume (PDF)
          </label>
          <div
            onClick={() => inputRef.current?.click()}
            className="border border-dashed border-line rounded-md px-4 py-8 text-center cursor-pointer hover:border-amber transition-colors bg-hull"
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-sm text-ink">{file ? file.name : 'Click to upload your resume PDF'}</p>
            <p className="text-xs text-mute mt-1">PDF only</p>
          </div>
        </div>
        <div>
          <label className="font-mono text-[11px] text-mute uppercase tracking-wide mb-1 block">
            Target role (optional)
          </label>
          <input
            className="w-full bg-hull border border-line rounded-md px-3 py-2 text-sm text-ink placeholder:text-mute focus:border-amber outline-none transition-colors"
            placeholder="e.g. Consulting Analyst at EY"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-amber text-hull font-display text-sm font-medium rounded-md py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === 'loading' ? 'Scanning fuselage…' : 'Analyze resume'}
        </button>
      </form>

      <div className="space-y-4">
        {score !== null && <ScoreGauge score={score} />}
        <ReadoutPanel status={status} text={text} error={error} />
      </div>
    </div>
  )
}