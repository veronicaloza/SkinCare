import { Link } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { Back, Pencil } from '../components/Icons';
import { PHOTO } from '../components/ui';
import { FEELS } from '../glyph';
import { itchOf, ROUTINES, useStore } from '../store';

export default function Day() {
  const { entry, food, routine } = useStore();
  const itch = itchOf(entry);

  const skin = `${FEELS[entry.feel]}${itch ? ` · itchy ${itch}/5` : ''}${entry.marks.spots ? ' · new spots' : ''}`;
  const foods = Object.keys(food.foods).filter((f) => food.foods[f]);
  const foodLine = [food.coffee ? `Coffee ×${food.coffee}` : null, foods[0]?.toLowerCase()].filter(Boolean).join(' · ') || 'Nothing logged';
  const amDone = ROUTINES[0].every((_, k) => routine.done[0][k]);
  const pmDone = ROUTINES[1].every((_, k) => routine.done[1][k]);
  const skincare = routine.skipped ? 'Skipped today'
    : amDone && pmDone ? 'AM + PM routine done'
    : amDone ? 'AM routine done'
    : pmDone ? 'PM routine done'
    : `${Object.values(routine.done[0]).filter(Boolean).length} of ${ROUTINES[0].length} AM steps`;
  const vits = Object.keys(food.vits).filter((v) => food.vits[v]).map((v) => v.replace('Vitamin ', ''));
  const vitLine = food.vit ? `Taken${vits.length ? ` · ${vits.join(', ').toLowerCase().replace(/\bd\b/, 'D')}` : ''}` : 'Not today';

  const cells: [string, string, boolean?][] = [
    ['Skin', skin], ['Food & drink', foodLine], ['Skincare', skincare], ['Vitamins', vitLine],
    ['New product · day 22', 'Gentle foaming cleanser', true],
  ];

  return (
    <main className="screen" style={{ padding: '56px 24px 24px', gap: 14 }}>
      <div className="topbar">
        <Link to="/" className="iconbtn" aria-label="Back"><Back /></Link>
        <span style={{ fontSize: 17, fontWeight: 500, textAlign: 'center' }}>Thursday, 19 Nov</span>
        <Link to="/entry" className="iconbtn solid" aria-label="Edit this entry"><Pencil /></Link>
      </div>

      <div style={{ position: 'relative', height: 230, borderRadius: 24, overflow: 'hidden', flexShrink: 0 }}>
        <img src={PHOTO} alt="Morning photo, 19 November" className="photo" style={{ objectPosition: 'center 35%' }} />
        <span className="row" style={{ position: 'absolute', left: 12, top: 12, gap: 4 }}>
          <span className="badge">Morning</span>
          <span className="badge frost">Night · not yet</span>
        </span>
        <Glyph size={64} disc feel={entry.feel} breakouts={entry.marks.spots} itch={entry.marks.itch} style={{ position: 'absolute', right: 12, bottom: 12 }} />
      </div>

      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6 }}>
        {cells.map(([dt, dd, span]) => (
          <div key={dt} style={{ background: '#f0f0f0', borderRadius: 14, padding: '10px 12px', gridColumn: span ? 'span 2' : undefined }}>
            <dt style={{ fontSize: 12, color: '#5c5c5c' }}>{dt}</dt>
            <dd style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{dd}</dd>
          </div>
        ))}
      </dl>

      <div className="spacer" />
      <Nav active="none" />
    </main>
  );
}
