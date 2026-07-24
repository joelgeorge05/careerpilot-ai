import MarkdownOutput from './MarkdownOutput'

export default function ReadoutPanel({ status, text, error }) {
  return (
    <div className="rounded-lg border border-line bg-hull shadow-instrument">
      <div className="flex items-center justify-between px-4 py-2 border-b border-line">
        <span className="font-mono text-[11px] text-mute">READOUT</span>
        <StatusBadge status={status} />
      </div>
      <div className="readout px-4 py-4 h-80 overflow-y-auto font-body text-sm text-ink">
        {error ? (
          <span className="text-bad">{error}</span>
        ) : text ? (
          <>
            <MarkdownOutput text={text} />
            {status === 'loading' && <span className="text-amber pulse-dot">▌</span>}
          </>
        ) : (
          <span className="text-mute">Awaiting input — fill the form and run the analysis.</span>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    idle: { label: 'STANDBY', color: 'text-mute' },
    loading: { label: 'STREAMING', color: 'text-amber' },
    done: { label: 'COMPLETE', color: 'text-good' },
    error: { label: 'FAULT', color: 'text-bad' },
  }
  const s = map[status] ?? map.idle
  return <span className={`font-mono text-[11px] ${s.color}`}>{s.label}</span>
}