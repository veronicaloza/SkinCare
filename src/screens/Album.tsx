import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { PHOTO } from '../components/ui';
import { CORES, parseCode, summary } from '../glyph';
import { daysIn, MONTHS, NOW, pastCode } from '../history';
import { codeOfEntry, useStore } from '../store';

const FILTERS = ['saturate(0.95) brightness(1.03)', 'saturate(1.1) contrast(1.04)', 'brightness(0.96) saturate(1.05)', 'saturate(1.2) contrast(1.06) brightness(0.97)', 'brightness(1.06) saturate(0.9)'];
const POS = ['center 30%', 'center 40%', '40% 35%', '60% 35%', 'center 45%'];
/** How many months of photos to show, newest first. */
const MONTHS_BACK = 12;

interface Shot { y: number; m: number; d: number; code: string }

const imgStyle = (d: number) => ({ objectPosition: POS[d % 5], filter: FILTERS[d % 5] });
const fullDate = (s: Shot) => new Date(s.y, s.m, s.d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export default function Album() {
  const { loggedAt, entry } = useStore();
  const [peek, setPeek] = useState<Shot | null>(null);
  const timer = useRef<number>();
  const held = useRef(false);

  /** Months newest first, each with its logged days newest first. */
  const months = useMemo(() => {
    const out: { y: number; m: number; shots: Shot[] }[] = [];
    for (let k = 0; k < MONTHS_BACK; k++) {
      const y = NOW.y + Math.floor((NOW.m - k) / 12);
      const m = (((NOW.m - k) % 12) + 12) % 12;
      const last = k === 0 ? NOW.d : daysIn(y, m);
      const shots: Shot[] = [];
      for (let d = last; d >= 1; d--) {
        const code = k === 0 && d === NOW.d ? (loggedAt ? codeOfEntry(entry) : null) : pastCode(y, m, d);
        if (code) shots.push({ y, m, d, code });
      }
      out.push({ y, m, shots });
    }
    return out;
  }, [loggedAt, entry]);

  const startHold = (s: Shot) => {
    held.current = false;
    timer.current = window.setTimeout(() => { held.current = true; setPeek(s); }, 350);
  };
  const endHold = () => window.clearTimeout(timer.current);
  const p = peek ? parseCode(peek.code) : null;

  return (
    <main className="screen tabbed" style={{ padding: '60px 0 24px', gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between', padding: '0 24px' }}>
        <h1 className="h-title">Photos</h1>
        <Link to="/compare" className="pill-link">Compare days</Link>
      </div>
      <p className="small muted" style={{ margin: '0 24px' }}>Press and hold a photo to peek at that day.</p>

      <div className="col no-bar" style={{ flex: 1, minHeight: 0, overflowY: 'auto', gap: 0 }}>
        {months.map(({ y, m, shots }) => (
          <section key={`${y}-${m}`} aria-label={`${MONTHS[m]} ${y}`}>
            <h2 className="eyebrow" style={{ position: 'sticky', top: 0, zIndex: 1, background: '#fff', padding: '10px 24px 8px' }}>
              {MONTHS[m]} {y} <span className="muted" style={{ fontWeight: 500 }}>· {shots.length} photos</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2 }}>
              {shots.map((s) => {
                const f = +s.code[0];
                const size = 6 + f * 2.5;
                return (
                  <button key={s.d} type="button" aria-label={`${MONTHS[m]} ${s.d}: ${summary(parseCode(s.code))}. Press to peek.`}
                    onPointerDown={() => startHold(s)} onPointerUp={endHold} onPointerLeave={endHold}
                    onClick={() => { if (!held.current) setPeek(s); }}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ position: 'relative', aspectRatio: '1 / 1', padding: 0, border: 0, overflow: 'hidden', background: '#e6e6e6', display: 'block', touchAction: 'manipulation', userSelect: 'none' }}>
                    <img src={PHOTO} alt="" loading="lazy" className="photo" draggable={false} style={imgStyle(s.d)} />
                    <span style={{ position: 'absolute', left: 6, top: 6, height: 20, minWidth: 20, padding: '0 6px', borderRadius: 999, background: '#fff', color: '#000', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{s.d}</span>
                    <span style={{ position: 'absolute', right: 6, bottom: 6, width: size, height: size, borderRadius: 999, background: '#ff5a3d', boxShadow: '0 0 0 2px #fff' }} />
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div style={{ padding: '0 24px' }}><Nav active="album" /></div>

      {p && peek && (
        <div className="overlay" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px', gap: 10 }}
          onClick={(e) => { if (e.target === e.currentTarget) setPeek(null); }}>
          <div role="dialog" aria-label={`Peek at ${fullDate(peek)}`} style={{ background: '#fff', borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
            <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
              <img src={PHOTO} alt={`Photo from ${fullDate(peek)}`} className="photo" style={{ position: 'absolute', inset: 0, ...imgStyle(peek.d) }} />
              <Glyph size={64} disc r={CORES[p.f]} breakouts={p.b} itch={p.i > 0} travel={p.t} style={{ position: 'absolute', right: 12, bottom: 12 }} />
            </div>
            <div className="col" style={{ padding: '14px 16px', gap: 2 }}>
              <span style={{ fontSize: 17, lineHeight: '22px', fontWeight: 600 }}>{fullDate(peek)}</span>
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
