import { useState } from 'react';
import { PHOTO, TopBar } from '../components/ui';

const PICKS = [
  { label: 'Before new cleanser · 30 Oct', short: '30 Oct', filter: 'saturate(1.3) contrast(1.07) brightness(0.96)', d: [['Skin', 'Rough → Okay'], ['Breakout days', '7 → 2'], ['Itch', '3 → 2']], note: 'Since you started the new cleanser on 28 Oct, breakout days dropped from 7 to 2 in three weeks.' },
  { label: 'Start of trip · 10 Nov', short: '10 Nov', filter: 'saturate(1.1) brightness(1.02)', d: [['Skin', 'Good → Okay'], ['Breakout days', '1 → 2'], ['Itch', '0 → 2']], note: 'Itch came back after the trip. That matches your flight pattern.' },
  { label: 'Best day · 4 Nov', short: '4 Nov', filter: 'saturate(0.9) brightness(1.06)', d: [['Skin', 'Great → Okay'], ['Breakout days', '0 → 2'], ['Itch', '0 → 2']], note: 'Your best day this month. You slept 8 hours and skipped dairy the day before.' },
  { label: 'Pick a date…', short: 'Pick', filter: 'grayscale(1)', d: [['Skin', '—'], ['Breakout days', '—'], ['Itch', '—']], note: 'Choose any day from your calendar.' },
];

export default function Compare() {
  const [pick, setPick] = useState(0);
  const [split, setSplit] = useState(50);
  const [saved, setSaved] = useState(false);
  const cur = PICKS[pick];

  return (
    <main className="screen" style={{ gap: 14 }}>
      <TopBar backLabel="Back" title="Am I making progress?" />

      <div className="col" style={{ gap: 6 }}>
        <span className="eyebrow">Compare today with</span>
        <div role="radiogroup" aria-label="Day to compare with" className="wrap">
          {PICKS.map((p, i) => (
            <button key={p.label} type="button" role="radio" aria-checked={pick === i} className={`chip sm${pick === i ? ' on' : ''}`} onClick={() => { setPick(i); setSaved(false); }}>{p.label}</button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', flex: 1, minHeight: 200, maxHeight: 300, borderRadius: 24, overflow: 'hidden', background: '#e6e6e6' }}>
        <img src={PHOTO} alt="Today" className="photo" style={{ position: 'absolute', inset: 0, objectPosition: 'center 35%' }} />
        {/* "Before" photo revealed from the left, kept full-size so the two line up */}
        <img src={PHOTO} alt={cur.label} className="photo"
          style={{ position: 'absolute', inset: 0, objectPosition: 'center 35%', filter: cur.filter, clipPath: `inset(0 ${100 - split}% 0 0)` }} />
        <span style={{ position: 'absolute', top: 0, bottom: 0, left: `calc(${split}% - 1.5px)`, width: 3, background: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.2)' }} />
        <span className="badge" style={{ position: 'absolute', left: 12, top: 12 }}>{cur.short}</span>
        <span className="badge light" style={{ position: 'absolute', right: 12, top: 12 }}>Today</span>
      </div>
      <label className="col small muted" style={{ gap: 4 }}>Slide to compare
        <input type="range" min={0} max={100} value={split} onChange={(e) => setSplit(+e.target.value)} style={{ width: '100%', height: 28 }} />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6 }}>
        {cur.d.map(([label, value]) => (
          <div key={label} className="col" style={{ background: '#f0f0f0', borderRadius: 16, padding: '10px 12px', gap: 2 }}>
            <span style={{ fontSize: 12, lineHeight: '16px', color: '#5c5c5c' }}>{label}</span>
            <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>{cur.note}</p>

      <button type="button" className="cta ghost" style={{ height: 52, flexShrink: 0, marginTop: 'auto' }} onClick={() => setSaved(true)}>
        {saved ? 'Saved to your album ✓' : 'Save this comparison to your album'}
      </button>
    </main>
  );
}
