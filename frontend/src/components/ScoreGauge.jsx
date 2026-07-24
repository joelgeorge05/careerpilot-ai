const SIZE = 180
const STROKE = 12
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function colorForScore(score) {
  if (score >= 80) return '#5FD68A' // good
  if (score >= 50) return '#F2A93B' // amber
  return '#F26B5B' // bad
}

function labelForScore(score) {
  if (score >= 80) return 'Strong — ready to send'
  if (score >= 50) return 'Workable — needs tightening'
  return 'Needs work before you send it'
}

export default function ScoreGauge({ score }) {
  const clamped = Math.max(0, Math.min(100, score))
  const offset = CIRCUMFERENCE * (1 - clamped / 100)
  const color = colorForScore(clamped)

  return (
    <div className="rounded-lg border border-line bg-hull shadow-instrument px-6 py-6 flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#2A3240"
            strokeWidth={STROKE}
            fill="none"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl text-ink">{clamped}</span>
          <span className="font-mono text-[10px] text-mute tracking-widest uppercase mt-1">
            ATS Score
          </span>
        </div>
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wide" style={{ color }}>
          {labelForScore(clamped)}
        </p>
        <p className="text-sm text-mute mt-1">
          Full breakdown — missing keywords, weak bullets, and rewrites — is below.
        </p>
      </div>
    </div>
  )
}