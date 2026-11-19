import { useState } from 'react';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { PATTERN_WEEK } from '../data';
import { COLORS, CORES, FEELS, itchWidth, parseCode } from '../glyph';

type Layer = 'travel' | 'itch' | 'break' | 'core';

const LAYERS: { id: Layer; short: string; name: string; desc: string }[] = [
  { id: 'travel', short: 'Travel', name: 'Dotted outer ring · travel', desc: 'You were travelling or flew in the last day. No dots means you stayed put.' },
  { id: 'itch', short: 'Itch', name: 'Dashed ring · itch', desc: 'Itch or dryness. The thicker the dashes, the itchier it was, from 1 to 5. No ring means no itch.' },
  { id: 'break', short: 'Breakouts', name: 'Solid ring · breakouts', desc: 'New breakouts showed up that day. No ring means no new spots.' },
  { id: 'core', short: 'Feel', name: 'Centre · how it felt', desc: 'How your skin felt overall. A tiny dot is a great day; the bigger and heavier, the rougher.' },
];

/** Large example glyph: hover, tap or focus a layer to decode it. */
function DecodeGlyph() {
  const [active, setActive] = useState<Layer | null>(null);
  const op = (id: Layer) => (active && active !== id ? 0.12 : 1);
  const info = LAYERS.find((l) => l.id === active);
  const hit = (id: Layer) => ({
    onMouseEnter: () => setActive(id),
    onClick: () => setActive((a) => (a === id ? null : id)),
    style: { cursor: 'pointer' },
  });
  const fade = (id: Layer) => ({ opacity: op(id), transition: 'opacity .18s' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }} onMouseLeave={() => setActive(null)}>
      <svg width="240" height="240" viewBox="0 0 40 40" role="img" aria-label="Example glyph with all four layers">
        <circle cx="20" cy="20" r="18.6" fill="none" stroke={COLORS.travel} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.01 2.9" style={fade('travel')} />
        <circle cx="20" cy="20" r="16" fill="none" stroke={COLORS.itch} strokeWidth={itchWidth(3)} strokeDasharray="2.2 1.6" style={fade('itch')} />
        <circle cx="20" cy="20" r="13.4" fill="none" stroke={COLORS.break} strokeWidth="1.4" style={fade('break')} />
        <circle cx="20" cy="20" r="8.4" fill={COLORS.core} style={fade('core')} />
        {/* Invisible hover targets, one band per layer */}
        <circle cx="20" cy="20" r="18.6" fill="none" stroke="transparent" strokeWidth="2.6" pointerEvents="stroke" {...hit('travel')} />
        <circle cx="20" cy="20" r="16" fill="none" stroke="transparent" strokeWidth="2.6" pointerEvents="stroke" {...hit('itch')} />
        <circle cx="20" cy="20" r="13.4" fill="none" stroke="transparent" strokeWidth="2.6" pointerEvents="stroke" {...hit('break')} />
        <circle cx="20" cy="20" r="12.1" fill="transparent" pointerEvents="fill" {...hit('core')} />
      </svg>

      <div aria-live="polite" style={{ minHeight: 64, maxWidth: 320, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {info ? (
          <>
            <p style={{ margin: 0, fontSize: 15, lineHeight: '20px', fontWeight: 600 }}>{info.name}</p>
            <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>{info.desc}</p>
          </>
        ) : (
          <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: '20px', paddingTop: 10 }}>Hover over or tap a ring to decode it.</p>
        )}
      </div>

      <div role="group" aria-label="Glyph layers" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {LAYERS.map((l) => (
          <button
            key={l.id} type="button" aria-pressed={active === l.id}
            onMouseEnter={() => setActive(l.id)} onFocus={() => setActive(l.id)}
            onClick={() => setActive((a) => (a === l.id ? null : l.id))}
            style={{ height: 34, padding: '0 14px', borderRadius: 999, border: '1.5px solid #000', fontSize: 13, fontWeight: 500, background: active === l.id ? '#000' : '#fff', color: active === l.id ? '#fff' : '#000' }}
          >{l.short}</button>
        ))}
      </div>
    </div>
  );
}

function Swatch({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">{children}</svg>
      <span style={{ fontSize: 12, lineHeight: '16px' }}>{label}</span>
    </div>
  );
}

/** B5 · Insights & legend */
export default function Insights() {
  return (
    <main className="screen" style={{ padding: '60px 0 32px' }}>
      <div className="scroll" style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 className="h-title">Your skin key</h1>

      <DecodeGlyph />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p className="eyebrow">Centre · how it felt</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4 }}>
          {FEELS.map((l, k) => (
            <Swatch key={l} label={l}><circle cx="20" cy="20" r={CORES[k]} fill={COLORS.core} /></Swatch>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="eyebrow">Itch level</p>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 3, 5].map((n) => (
              <Swatch key={n} label={`${n} of 5`}><circle cx="20" cy="20" r="16" fill="none" stroke={COLORS.itch} strokeWidth={itchWidth(n)} strokeDasharray="2.2 1.6" /></Swatch>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="eyebrow">No data</p>
          <div style={{ display: 'flex', gap: 2 }}>
            <Swatch label="Missed"><circle cx="20" cy="20" r="11" fill="none" stroke="#000" strokeWidth="0.8" /></Swatch>
            <Swatch label="Today"><circle cx="20" cy="20" r="11" fill="none" stroke="#000" strokeWidth="0.8" strokeDasharray="1.2 1.2" /></Swatch>
            <Swatch label="Later"><circle cx="20" cy="20" r="11" fill="none" stroke="#c4c4c4" strokeWidth="0.8" /></Swatch>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #000', paddingTop: 16 }}>
        <p className="eyebrow">Pattern · 8–14 Oct</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 2 }}>
          {PATTERN_WEEK.map((c, k) => <Glyph key={k} size={40} log={parseCode(c)} />)}
        </div>
        <p className="body">Dotted rings are followed by thick dashed rings within 2 days, on both of your trips. Flying dries your skin out, so pack a heavier cream.</p>
      </div>

      </div>
      <div style={{ paddingTop: 12, borderTop: '1px solid var(--line)', display: 'flex' }}>
        <Nav active="insights" />
      </div>
    </main>
  );
}
