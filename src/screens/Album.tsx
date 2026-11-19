import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { PHOTO } from '../components/ui';
import { CORES, parseCode, summary } from '../glyph';

/** Newest first: index k = 19 − k November. */
const CODES = ['2110', '1000', '1000', '0000', '1100', '2100', '3131', '2120', '1000', '1000', '2010', '1001', '3021', '2020', '2010'];
const FILTERS = ['saturate(0.95) brightness(1.03)', 'saturate(1.1) contrast(1.04)', 'brightness(0.96) saturate(1.05)', 'saturate(1.2) contrast(1.06) brightness(0.97)', 'brightness(1.06) saturate(0.9)'];
const POS = ['center 30%', 'center 40%', '40% 35%', '60% 35%', 'center 45%'];
const LABELS = ['All', 'Morning', 'Night'];

const dayName = (d: number) => new Date(2026, 10, d).toLocaleDateString('en-GB', { weekday: 'long' });

export default function Album() {
  const [filter, setFilter] = useState(0);
  const [peek, setPeek] = useState<number | null>(null);
  const timer = useRef<number>();
  const held = useRef(false);

  const imgStyle = (k: number) => ({
    objectPosition: POS[k % 5],
    filter: FILTERS[k % 5] + (filter === 2 ? ' brightness(0.8) sepia(0.25)' : ''),
  });

  const startHold = (k: number) => {
    held.current = false;
    timer.current = window.setTimeout(() => { held.current = true; setPeek(k); }, 350);
  };
  const endHold = () => window.clearTimeout(timer.current);

  const p = peek != null ? parseCode(CODES[peek]) : null;
  const pDay = peek != null ? 19 - peek : 0;

  return (
    <main className="screen tabbed" style={{ padding: '60px 0 24px', gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between', padding: '0 24px' }}>
        <h1 className="h-title">Photos</h1>
        <Link to="/compare" className="pill-link">Review November</Link>
      </div>
      <div role="radiogroup" aria-label="Time of day" className="row" style={{ gap: 6, padding: '0 24px' }}>
        {LABELS.map((l, k) => (
          <button key={l} type="button" role="radio" aria-checked={filter === k} className={`chip bold${filter === k ? ' on' : ''}`} style={{ height: 40 }} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      <p className="small muted" style={{ margin: '0 24px' }}>Press and hold a photo to peek at that day.</p>

      <div className="col" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 24px', gap: 8 }}>
        <span className="eyebrow">November 2026</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 3 }}>
          {CODES.map((c, k) => {
            const f = +c[0];
            const s = 6 + f * 2.5;
            return (
              <button key={k} type="button" aria-label={`November ${19 - k}: ${summary(parseCode(c))}. Press to peek.`}
                onPointerDown={() => startHold(k)} onPointerUp={endHold} onPointerLeave={endHold}
                onClick={() => { if (!held.current) setPeek(k); }}
                onContextMenu={(e) => e.preventDefault()}
                style={{ position: 'relative', aspectRatio: '1 / 1', padding: 0, border: 0, overflow: 'hidden', background: '#e6e6e6', display: 'block', touchAction: 'manipulation', userSelect: 'none' }}>
                <img src={PHOTO} alt="" className="photo" draggable={false} style={imgStyle(k)} />
                <span style={{ position: 'absolute', left: 6, top: 6, height: 20, minWidth: 20, padding: '0 6px', borderRadius: 999, background: '#fff', color: '#000', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{19 - k}</span>
                <span style={{ position: 'absolute', right: 6, bottom: 6, width: s, height: s, borderRadius: 999, background: '#ff5a3d', boxShadow: '0 0 0 2px #fff' }} />
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 24px' }}><Nav active="album" /></div>

      {p && peek != null && (
        <div className="overlay" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px', gap: 10 }}
          onClick={(e) => { if (e.target === e.currentTarget) setPeek(null); }}>
          <div role="dialog" aria-label={`Peek at November ${pDay}`} style={{ background: '#fff', borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
            <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
              <img src={PHOTO} alt={`Photo from November ${pDay}`} className="photo" style={{ position: 'absolute', inset: 0, ...imgStyle(peek) }} />
              <Glyph size={64} disc r={CORES[p.f]} breakouts={p.b} itch={p.i > 0} travel={p.t} style={{ position: 'absolute', right: 12, bottom: 12 }} />
            </div>
            <div className="col" style={{ padding: '14px 16px', gap: 2 }}>
              <span style={{ fontSize: 17, lineHeight: '22px', fontWeight: 600 }}>{dayName(pDay)}, {pDay} November</span>
              <span style={{ fontSize: 14, lineHeight: '20px', color: '#5c5c5c' }}>{summary(p)}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            {[['/compare', 'Compare'], ['/day', 'Open day']].map(([to, l]) => (
              <Link key={to} to={to} style={{ height: 52, borderRadius: 16, background: '#fff', color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>{l}</Link>
            ))}
            <button type="button" onClick={() => setPeek(null)} style={{ height: 52, borderRadius: 16, border: '1.5px solid #fff', background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 600 }}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
