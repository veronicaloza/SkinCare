import { useState } from 'react';
import { Link } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { IconCheck, IconDown } from '../components/Icons';
import PatternCards, { HERO_GLYPHS, PATTERNS_BY_RANGE, RANGES, type Range } from '../components/PatternCards';
import { parseCode } from '../glyph';

/** Time-range picker: a pill that opens a small menu. */
function RangePicker({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  const [open, setOpen] = useState(false);
  const current = RANGES.find((r) => r.id === value)!;

  return (
    <div style={{ position: 'relative' }} onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}>
      <button
        type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        style={{ height: 32, padding: '0 10px 0 14px', borderRadius: 999, border: '1.5px solid #000', background: open ? '#000' : '#fff', color: open ? '#fff' : '#000', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
      >
        {current.label}
        <span style={{ display: 'flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><IconDown size={12} /></span>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="menu" aria-label="Time range"
            style={{ position: 'absolute', right: 0, top: 40, zIndex: 10, minWidth: 170, background: '#fff', border: '1.5px solid #000', borderRadius: 18, padding: 6, display: 'flex', flexDirection: 'column', boxShadow: '0 12px 30px rgba(0,0,0,.12)' }}
          >
            {RANGES.map((r) => {
              const on = r.id === value;
              return (
                <button
                  key={r.id} type="button" role="menuitemradio" aria-checked={on}
                  onClick={() => { onChange(r.id); setOpen(false); }}
                  style={{ height: 40, padding: '0 12px', border: 0, borderRadius: 12, background: on ? 'var(--fill)' : 'transparent', fontSize: 14, fontWeight: on ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
                >
                  {r.label}
                  {on && <IconCheck size={14} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/** Insights · patterns noticed over a chosen time range */
export default function Patterns() {
  const [range, setRange] = useState<Range>('month');
  const patterns = PATTERNS_BY_RANGE[range];

  return (
    <main className="screen" style={{ padding: '56px 0 32px' }}>
      <div className="scroll" style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: '38px', fontWeight: 400, letterSpacing: '-0.02em' }}>Insights</h1>
          <RangePicker value={range} onChange={setRange} />
        </header>

        <section style={{ background: '#000', color: '#fff', borderRadius: 24, padding: '26px 22px', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }} aria-hidden="true">
            {HERO_GLYPHS[range].map((c, k) => <Glyph key={k} size={34} log={parseCode(c)} ink="#fff" />)}
          </div>
          <h2 style={{ margin: 0, fontSize: 30, lineHeight: '34px', fontWeight: 400, letterSpacing: '-0.01em' }}>
            {patterns.length === 1 ? 'We’ve noticed a pattern' : 'We’ve noticed a few patterns'}
          </h2>
        </section>

        <PatternCards patterns={patterns} />

        <Link to="/key" className="small" style={{ alignSelf: 'center' }}>How to read your glyphs</Link>
      </div>

      <div style={{ paddingTop: 12, borderTop: '1px solid var(--line)', display: 'flex' }}>
        <Nav active="insights" />
      </div>
    </main>
  );
}
