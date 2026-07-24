import { useState } from 'react'
import { streamJSON, ENDPOINTS } from '../lib/api'
import ReadoutPanel from './ReadoutPanel'

const TYPES = ['HR', 'Technical', 'Behavioral']

export default function InterviewCoach() {
  const [interviewType, setInterviewType] = useState('HR')
  const [roleContext, setRoleContext] = useState('')
  const [status, setStatus] = useState('idle')
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  async function run(e) {
    e.preventDefault()
    setStatus('loading')
    setText('')
    setError('')
    await streamJSON({
      url: ENDPOINTS.interviewCoach,
      body: { interview_type: interviewType, role_context: roleContext },
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
            Interview type
          </label>
          <div className="flex gap-2">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setInterviewType(t)}
                className={`flex-1 rounded-md border py-2 text-sm font-display transition-colors ${
                  interviewType === t
                    ? 'border-amber text-amber bg-panel2'
                    : 'border-line text-mute hover:text-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="font-mono text-[11px] text-mute uppercase tracking-wide mb-1 block">
            Role context
          </label>
          <textarea
            className="w-full bg-hull border border-line rounded-md px-3 py-2 text-sm text-ink placeholder:text-mute focus:border-amber outline-none transition-colors"
            rows={6}
            placeholder="e.g. Consulting analyst role at EY"
            value={roleContext}
            onChange={(e) => setRoleContext(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-amber text-hull font-display text-sm font-medium rounded-md py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === 'loading' ? 'Rehearsing approach…' : 'Generate interview prep'}
        </button>
      </form>

      <ReadoutPanel status={status} text={text} error={error} />
    </div>
  )
}
