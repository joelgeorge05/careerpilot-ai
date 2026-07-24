import { useState } from 'react'
import { streamJSON, ENDPOINTS } from '../lib/api'
import ReadoutPanel from './ReadoutPanel'

const inputClass =
  'w-full bg-hull border border-line rounded-md px-3 py-2 text-sm text-ink placeholder:text-mute focus:border-amber outline-none transition-colors'
const labelClass = 'font-mono text-[11px] text-mute uppercase tracking-wide mb-1 block'

export default function CareerDiscovery() {
  const [form, setForm] = useState({
    education: '',
    skills: '',
    interests: '',
    strengths: '',
    goals: '',
  })
  const [status, setStatus] = useState('idle')
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function run(e) {
    e.preventDefault()
    setStatus('loading')
    setText('')
    setError('')
    await streamJSON({
      url: ENDPOINTS.careerDiscovery,
      body: form,
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
          <label className={labelClass}>Education</label>
          <input
            className={inputClass}
            placeholder="e.g. B.Tech CSE, 3rd year"
            value={form.education}
            onChange={update('education')}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Current skills</label>
          <textarea
            className={inputClass}
            rows={2}
            placeholder="Python, SQL, HTML..."
            value={form.skills}
            onChange={update('skills')}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Interests</label>
          <textarea
            className={inputClass}
            rows={2}
            placeholder="AI, product design, data..."
            value={form.interests}
            onChange={update('interests')}
          />
        </div>
        <div>
          <label className={labelClass}>Strengths</label>
          <textarea
            className={inputClass}
            rows={2}
            placeholder="Communication, problem-solving..."
            value={form.strengths}
            onChange={update('strengths')}
          />
        </div>
        <div>
          <label className={labelClass}>Career goals</label>
          <textarea
            className={inputClass}
            rows={2}
            placeholder="What you're aiming for..."
            value={form.goals}
            onChange={update('goals')}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-amber text-hull font-display text-sm font-medium rounded-md py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === 'loading' ? 'Charting course…' : 'Chart my course'}
        </button>
      </form>

      <ReadoutPanel status={status} text={text} error={error} />
    </div>
  )
}
