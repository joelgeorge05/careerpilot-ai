import { useState } from 'react'
import { streamJSON, ENDPOINTS } from '../lib/api'
import ReadoutPanel from './ReadoutPanel'

export default function JDAnalyzer() {
  const [jd, setJd] = useState('')
  const [status, setStatus] = useState('idle')
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  async function run(e) {
    e.preventDefault()
    setStatus('loading')
    setText('')
    setError('')
    await streamJSON({
      url: ENDPOINTS.jdAnalyzer,
      body: { job_description: jd },
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
            Job description
          </label>
          <textarea
            className="w-full bg-hull border border-line rounded-md px-3 py-2 text-sm text-ink placeholder:text-mute focus:border-amber outline-none transition-colors"
            rows={14}
            placeholder="Paste the full job description here…"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-amber text-hull font-display text-sm font-medium rounded-md py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === 'loading' ? 'Reading destination…' : 'Analyze job description'}
        </button>
      </form>

      <ReadoutPanel status={status} text={text} error={error} />
    </div>
  )
}
