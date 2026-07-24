const MODULES = [
  { id: 'discovery', label: 'Career Discovery', heading: '360°', hint: 'Find your route' },
  { id: 'resume', label: 'Resume Analyzer', heading: '045°', hint: 'Check the fuselage' },
  { id: 'jd', label: 'JD Analyzer', heading: '090°', hint: 'Read the destination' },
  { id: 'interview', label: 'Interview Coach', heading: '135°', hint: 'Rehearse the approach' },
]

const HEADING_ANGLES = {
  discovery: 0,
  resume: 45,
  jd: 90,
  interview: 135,
}

export default function Sidebar({ active, onSelect }) {
  const angle = HEADING_ANGLES[active] ?? 0

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-line bg-panel flex md:flex-col">
      <div className="p-5 border-b border-line hidden md:block">
        <div className="flex items-center gap-3">
          {/* compass signature element */}
          <div className="relative w-10 h-10 rounded-full border border-line bg-hull shadow-instrument">
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="w-[2px] h-4 bg-amber -translate-y-1 rounded-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-mute" />
            </div>
          </div>
          <div>
            <p className="font-display text-sm tracking-wide text-ink">CareerPilot AI</p>
            <p className="font-mono text-[10px] text-mute">HDG {HEADING_ANGLES[active].toString().padStart(3, '0')}°</p>
          </div>
        </div>
      </div>

      <nav className="flex md:flex-col w-full overflow-x-auto md:overflow-visible">
        {MODULES.map((m) => {
          const isActive = m.id === active
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`group flex items-center gap-3 px-5 py-4 text-left border-b border-line md:border-b border-line whitespace-nowrap md:whitespace-normal transition-colors ${
                isActive ? 'bg-panel2' : 'hover:bg-panel2/60'
              }`}
            >
              <span
                className={`font-mono text-[11px] w-10 shrink-0 ${
                  isActive ? 'text-amber' : 'text-mute'
                }`}
              >
                {m.heading}
              </span>
              <span className="flex flex-col">
                <span className={`font-display text-sm ${isActive ? 'text-ink' : 'text-mute group-hover:text-ink'}`}>
                  {m.label}
                </span>
                <span className="hidden md:block text-xs text-mute">{m.hint}</span>
              </span>
              {isActive && <span className="ml-auto hidden md:block w-1.5 h-1.5 rounded-full bg-amber pulse-dot" />}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
