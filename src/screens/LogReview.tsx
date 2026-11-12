import { Link, useNavigate } from 'react-router-dom';
import Glyph, { LayerIcon } from '../components/Glyph';
import { IconBack } from '../components/Icons';
import { DayInsights } from '../components/PatternCards';
import { TODAY_SHORT } from '../data';
import { FEELS, describe } from '../glyph';
import { useStore } from '../store';

/** L5 · Review & edit log */
export default function LogReview() {
  const { draft, note, setNote, save } = useStore();
  const navigate = useNavigate();

  const rows = [
    { step: 1, kind: 'core' as const, label: 'Skin sensation', value: FEELS[draft.f], on: true, v: draft.f },
    { step: 2, kind: 'break' as const, label: 'Breakouts', value: draft.b ? 'Yes' : 'No', on: draft.b, v: 0 },
    { step: 3, kind: 'itch' as const, label: 'Itch', value: draft.i ? `${draft.i} of 5` : 'None', on: draft.i > 0, v: draft.i },
    { step: 4, kind: 'travel' as const, label: 'Travel', value: draft.t ? 'Yes, flew yesterday' : 'No', on: draft.t, v: 0 },
  ];

  const onSave = () => {
    save(draft);
    navigate('/log/done');
  };

  return (
    <main className="screen" style={{ padding: '60px 0 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 18px' }}>
        <Link to="/log/4" className="circle-btn" aria-label="Back to the last question"><IconBack /></Link>
        <span className="small muted">{TODAY_SHORT}</span>
        <span style={{ width: 44 }} />
      </div>

      <div className="scroll" style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Glyph size={120} log={draft} label={`Today’s glyph: ${describe(draft)}`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1 style={{ margin: 0, fontSize: 26, lineHeight: '30px', fontWeight: 500, letterSpacing: '-0.02em' }}>Check today’s log</h1>
          <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>Tap any answer to change it. The glyph updates when you do.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #000' }}>
        {rows.map((r) => (
          <Link
            key={r.step} to={`/log/${r.step}?from=review`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 64, borderBottom: '1px solid var(--line)', textDecoration: 'none', color: '#000' }}
          >
            <LayerIcon kind={r.kind} on={r.on} value={r.v} />
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span className="muted" style={{ fontSize: 13, lineHeight: '18px' }}>{r.label}</span>
              <span style={{ fontSize: 17, lineHeight: '22px', fontWeight: 500 }}>{r.value}</span>
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, textDecoration: 'underline' }}>Change</span>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="note" className="eyebrow">Note (optional)</label>
        <textarea
          id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Anything else? New cleanser, long day…"
          style={{ font: 'inherit', borderRadius: 14, border: 0, background: 'var(--fill)', padding: '12px 14px', fontSize: 15, lineHeight: '20px', color: '#000', resize: 'none' }}
        />
      </div>

      <DayInsights log={draft} />
      </div>

      <div style={{ padding: '12px 24px 0', borderTop: '1px solid var(--line)' }}>
        <button type="button" className="pill" onClick={onSave}>Save log</button>
      </div>
    </main>
  );
}
