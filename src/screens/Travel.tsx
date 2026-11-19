import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane } from '../components/Icons';
import { ChipRadio, ChipToggles, toggleKey, TopBar } from '../components/ui';

const DIFFS = ['Drier air', 'More humid', 'Colder', 'Hotter', 'Stronger sun', 'Hard water', 'Time zone change', 'Hotel products'];

export default function Travel() {
  const [dest, setDest] = useState('Denver, Colorado');
  const [from, setFrom] = useState('2026-11-17');
  const [to, setTo] = useState('2026-11-22');
  const [mode, setMode] = useState(0);
  const [hours, setHours] = useState(4);
  const [diffs, setDiffs] = useState<Record<string, boolean>>({ 'Drier air': true, Colder: true, 'Stronger sun': true });

  const dateBox = (label: string, value: string, set: (v: string) => void) => (
    <label style={{ border: '1.5px solid #000', borderRadius: 14, padding: '8px 12px', display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 12, color: '#5c5c5c' }}>{label}</span>
      <input type="date" value={value} onChange={(e) => set(e.target.value)} style={{ border: 0, padding: 0, fontSize: 16, fontWeight: 500, background: 'transparent', minWidth: 0 }} />
    </label>
  );

  return (
    <main className="screen" style={{ gap: 14 }}>
      <TopBar back="/entry" backLabel="Back to today’s entry" title="Travel"
        right={<span style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8cc20a' }}><Plane /></span>} />

      <div className="scroll" style={{ gap: 14 }}>
        <div className="col" style={{ gap: 6 }}>
          <label htmlFor="dest" className="eyebrow">Where</label>
          <input id="dest" type="text" className="text-input" value={dest} onChange={(e) => setDest(e.target.value)} />
        </div>
        <div className="grid2" style={{ gap: 8 }}>
          {dateBox('From', from, setFrom)}
          {dateBox('To', to, setTo)}
        </div>

        <div className="col" style={{ gap: 6 }}>
          <span className="eyebrow">Getting there</span>
          <ChipRadio label="How you travelled" options={['Flight', 'Car', 'Train', 'Bus']} value={mode} onChange={setMode} />
          {mode === 0 && (
            <div className="row" style={{ justifyContent: 'space-between', background: '#f0f0f0', borderRadius: 14, padding: '6px 6px 6px 14px' }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>Hours in the air</span>
              <span className="row" style={{ gap: 10 }}>
                <button type="button" className="iconbtn" aria-label="Fewer hours" style={{ fontSize: 20 }} onClick={() => setHours((h) => Math.max(0, h - 1))}>−</button>
                <span style={{ minWidth: 28, textAlign: 'center', fontSize: 18, fontWeight: 600 }} aria-live="polite">{hours}</span>
                <button type="button" className="iconbtn solid" aria-label="More hours" style={{ fontSize: 20 }} onClick={() => setHours((h) => h + 1)}>+</button>
              </span>
            </div>
          )}
        </div>

        <div className="col" style={{ gap: 6 }}>
          <span className="eyebrow">What’s different there</span>
          <ChipToggles options={DIFFS} on={diffs} onToggle={(d) => setDiffs((s) => toggleKey(s, d))} />
        </div>

        <div className="col" style={{ background: '#000', color: '#fff', borderRadius: 20, padding: 14, gap: 4 }}>
          <span className="eyebrow">From your past trips</span>
          <span style={{ fontSize: 15, lineHeight: '21px' }}>Dry places and flights over 3 hours made you itchy within 2 days. Pack the barrier cream.</span>
        </div>
      </div>

      <Link to="/entry" className="cta">Save trip</Link>
    </main>
  );
}
