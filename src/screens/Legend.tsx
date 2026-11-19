import { useState } from 'react';
import Nav from '../components/Nav';
import Glyph from '../components/Glyph';
import { Chevron } from '../components/Icons';
import { COLORS, CORES, FEELS } from '../glyph';

type Id = 'core' | 'break' | 'itch' | 'travel';
interface Mark { r: number; fill: string; stroke: string; w: number; dash: string }
interface Scale extends Mark { label: string }

const core = (r: number): Mark => ({ r, fill: COLORS.core, stroke: 'none', w: 0, dash: 'none' });
const ring = (r: number, stroke: string, w: number, dash = 'none'): Mark => ({ r, fill: 'none', stroke, w, dash });

const CORE_SCALE: Scale[] = FEELS.map((label, k) => ({ label, ...core(CORES[k]) }));

const LAYERS: { id: Id; name: string; means: string; eyebrow: string; title: string; body: string; scaleTitle: string; scale: Scale[]; icon: Mark }[] = [
  { id: 'core', name: 'Centre dot', means: 'How your skin feels overall', eyebrow: 'CENTRE DOT', title: 'How your skin feels',
    body: 'Bigger dot, rougher day. A tiny dot means your skin feels great.', scaleTitle: 'SIZE = HOW IT FEELS', scale: CORE_SCALE, icon: core(8) },
  { id: 'break', name: 'Solid ring', means: 'New breakouts showed up', eyebrow: 'SOLID RING', title: 'New breakouts',
    body: 'Appears only on days you log new spots. No ring, no new breakouts.', scaleTitle: 'ON OR OFF',
    scale: [{ label: 'None', ...ring(13.4, '#d0d0d0', 1.6, '3 3') }, { label: 'Breakouts', ...ring(13.4, COLORS.break, 1.6) }], icon: ring(14, COLORS.break, 2.4) },
  { id: 'itch', name: 'Dashed ring', means: 'Itch or dryness, thicker is itchier', eyebrow: 'DASHED RING', title: 'Itch or dryness',
    body: 'The dashes get thicker as the itch gets worse, from 1 to 5.', scaleTitle: 'THICKNESS = HOW ITCHY',
    scale: [1, 2, 3, 4, 5].map((n) => ({ label: `${n} of 5`, ...ring(15, COLORS.itch, (0.6 + 0.35 * n) * 1.4, '2.6 1.8') })), icon: ring(14, COLORS.itch, 2.6, '3.4 2.4') },
  { id: 'travel', name: 'Dotted ring', means: 'Travelling or flew in the last day', eyebrow: 'DOTTED OUTER RING', title: 'Travel',
    body: 'New air, water and sun change your skin. The outer dots mark days away from home.', scaleTitle: 'ON OR OFF',
    scale: [{ label: 'Home', ...ring(17, '#d0d0d0', 2.2, '0.01 3.2') }, { label: 'Away', ...ring(17, COLORS.travel, 2.2, '0.01 3.2') }], icon: ring(14, COLORS.travel, 3, '0.01 4') },
];

const Dot = ({ m, size, box }: { m: Mark; size: number; box: number }) => (
  <svg width={size} height={size} viewBox={`0 0 ${box} ${box}`} aria-hidden="true" style={{ flexShrink: 0 }}>
    <circle cx={box / 2} cy={box / 2} r={m.r} fill={m.fill} stroke={m.stroke} strokeWidth={m.w} strokeDasharray={m.dash} strokeLinecap="round" />
  </svg>
);

export default function Legend() {
  const [sel, setSel] = useState<Id | null>(null);
  const cur = LAYERS.find((l) => l.id === sel);
  const detail = cur ?? { eyebrow: 'HOW TO READ IT', title: 'One glyph per day', body: 'Each layer answers one question. Tap a layer below to see what it means.', scaleTitle: 'CENTRE SIZE = HOW IT FEELS', scale: CORE_SCALE };
  const dim = (id: Id) => (!sel || sel === id ? COLORS[id] : '#e6e6e6');

  return (
    <main className="screen tabbed" style={{ gap: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1 className="h-title">Your skin key</h1>
        <button type="button" className="chip bold" onClick={() => setSel(null)}>Show all</button>
      </div>

      <div className="row" style={{ gap: 16 }}>
        <Glyph size={132} feel={3} breakouts itch travel
          colors={{ core: dim('core'), break: dim('break'), itch: dim('itch'), travel: dim('travel') }}
          label={`Example glyph${cur ? `, showing the ${cur.name.toLowerCase()}` : ' with all four layers'}`} />
        <div className="col" style={{ gap: 6 }}>
          <span className="eyebrow">{detail.eyebrow}</span>
          <span style={{ fontSize: 20, lineHeight: '24px', fontWeight: 500 }}>{detail.title}</span>
          <span style={{ fontSize: 14, lineHeight: '20px', color: '#5c5c5c' }}>{detail.body}</span>
        </div>
      </div>

      <div className="col" style={{ background: '#f0f0f0', borderRadius: 20, padding: '12px 14px', gap: 8 }}>
        <span className="eyebrow">{detail.scaleTitle}</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4 }}>
          {detail.scale.map((s) => (
            <div key={s.label} className="col" style={{ alignItems: 'center', gap: 2 }}>
              <Dot m={s} size={44} box={40} />
              <span style={{ fontSize: 12, lineHeight: '16px' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div role="radiogroup" aria-label="Glyph layers" className="col" style={{ gap: 8 }}>
        {LAYERS.map((l) => {
          const on = sel === l.id;
          return (
            <button key={l.id} type="button" role="radio" aria-checked={on} onClick={() => setSel(on ? null : l.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 64, padding: '10px 14px', borderRadius: 18, color: '#000', background: on ? '#f0f0f0' : '#fff', border: on ? '2px solid #000' : '1.5px solid #e0e0e0' }}>
              <Dot m={l.icon} size={36} box={36} />
              <span className="col" style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ fontSize: 16, lineHeight: '20px', fontWeight: 600 }}>{l.name}</span>
                <span className="small muted">{l.means}</span>
              </span>
              <Chevron />
            </button>
          );
        })}
      </div>

      <div className="spacer" />
      <Nav active="insights" />
    </main>
  );
}
