import { useState } from 'react'
import Sidebar from './components/Sidebar'
import CareerDiscovery from './components/CareerDiscovery'
import ResumeAnalyzer from './components/ResumeAnalyzer'
import JDAnalyzer from './components/JDAnalyzer'
import InterviewCoach from './components/InterviewCoach'

const TITLES = {
  discovery: { title: 'Career Discovery', subtitle: 'Best-fit paths, growth outlook, and the skills each one asks for' },
  resume: { title: 'Resume Analyzer', subtitle: 'ATS score, gaps, and rewrite suggestions from your PDF' },
  jd: { title: 'JD Analyzer', subtitle: 'Extract requirements, keywords, and experience level from a posting' },
  interview: { title: 'Interview Coach', subtitle: 'Likely questions, model answers, and follow-ups for your next round' },
}

export default function App() {
  const [active, setActive] = useState('discovery')
  const copy = TITLES[active]

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-hull">
      <Sidebar active={active} onSelect={setActive} />

      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <p className="font-mono text-[11px] text-amber tracking-widest uppercase mb-1">Module</p>
          <h1 className="font-display text-2xl text-ink">{copy.title}</h1>
          <p className="text-sm text-mute mt-1">{copy.subtitle}</p>
        </header>

        <div className={active === 'discovery' ? 'block' : 'hidden'}>
          <CareerDiscovery />
        </div>
        <div className={active === 'resume' ? 'block' : 'hidden'}>
          <ResumeAnalyzer />
        </div>
        <div className={active === 'jd' ? 'block' : 'hidden'}>
          <JDAnalyzer />
        </div>
        <div className={active === 'interview' ? 'block' : 'hidden'}>
          <InterviewCoach />
        </div>
      </main>
    </div>
  )
}