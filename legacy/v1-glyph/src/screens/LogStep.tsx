import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import Glyph from '../components/Glyph';
import { IconBack, IconClose } from '../components/Icons';
import { COLORS, CORES, FEELS, describe, itchWidth, type SkinLog } from '../glyph';
import { useStore } from '../store';

const GHOST = '#e6e6e6';

const STEPS: Record<number, { question: string }> = {
  1: { question: 'How does your skin feel?' },
  2: { question: 'Any new breakouts?' },
  3: { question: 'How itchy or dry is it?' },
  4: { question: 'Travelling, or flew in the last day?' },
};

/** L1–L4 · Log my skin: one slide per question.
 *  Layers not yet asked about are drawn as light-grey ghosts. */
export default function LogStep() {
  const { step } = useParams();
  const [params] = useSearchParams();
  const { draft, setDraft } = useStore();
  const s = Number(step);
  if (!(s >= 1 && s <= 4)) return <Navigate to="/log/1" replace />;

  const fromReview = params.get('from') === 'review';
  const meta = STEPS[s];

  const layer = (k: number, on: boolean, color: string) => (k <= s ? (on ? color : 'none') : GHOST);
  const layers = {
    coreR: CORES[draft.f],
    b: layer(2, draft.b, COLORS.break),
    i: layer(3, draft.i > 0, COLORS.itch),
    iW: itchWidth(s >= 3 ? draft.i : 3),
    t: layer(4, draft.t, COLORS.travel),
  };
  const soFar: SkinLog = { f: draft.f, b: s >= 2 && draft.b, i: s >= 3 ? draft.i : 0, t: s >= 4 && draft.t };

  const prevHref = fromReview ? '/log/review' : s === 1 ? '/' : `/log/${s - 1}`;
  const nextHref = fromReview || s === 4 ? '/log/review' : `/log/${s + 1}`;
  const nextLabel = fromReview ? 'Back to review' : s === 4 ? 'Review my log' : 'Next';

  const yesNo = (key: 'b' | 't') => (
    <div role="radiogroup" aria-label={meta.question} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
      {([['No', false], ['Yes', true]] as const).map(([l, v]) => (
        <button key={l} type="button" role="radio" aria-checked={draft[key] === v} className="choice" style={{ height: 72, fontSize: 17 }} onClick={() => setDraft({ [key]: v })}>{l}</button>
      ))}
    </div>
  );

  return (
    <main className="screen" style={{ padding: '60px 24px 40px', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/" className="circle-btn" aria-label="Close"><IconClose /></Link>
        <div className="ticks" aria-hidden="true">
          {[1, 2, 3, 4].map((k) => <span key={k} className={k < s ? 'on' : k === s ? 'current' : ''} />)}
        </div>
        <Link
          to="/log/review"
          style={{ height: 44, padding: '0 14px', borderRadius: 999, border: '1.5px solid #000', display: 'flex', alignItems: 'center', textDecoration: 'none', fontSize: 13, fontWeight: 600, flexShrink: 0 }}
        >Review</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 8 }}>
        <Glyph size={220} hairline layers={layers} label={`Today’s glyph so far: ${describe(soFar)}`} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 className="h-question">{meta.question}</h1>

        {s === 1 && (
          <div role="radiogroup" aria-label={meta.question} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 6 }}>
            {FEELS.map((l, k) => (
              <button key={l} type="button" role="radio" aria-checked={draft.f === k} className="choice feel" style={{ height: 88 }} onClick={() => setDraft({ f: k })}>
                <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r={CORES[k] * 0.95} fill={draft.f === k ? '#fff' : COLORS.core} /></svg>
                <span>{l}</span>
              </button>
            ))}
          </div>
        )}
        {s === 2 && yesNo('b')}
        {s === 3 && (
          <>
            <div role="radiogroup" aria-label={meta.question} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={draft.i === n} className="choice round" style={{ height: 56, fontSize: 17 }} onClick={() => setDraft({ i: n })}>{n}</button>
              ))}
            </div>
            <div className="muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, lineHeight: '16px' }}>
              <span>Not at all</span><span>Can’t stop scratching</span>
            </div>
          </>
        )}
        {s === 4 && yesNo('t')}
      </div>

      <div className="spacer" />
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to={prevHref} className="circle-btn lg" aria-label="Previous question"><IconBack /></Link>
        <Link to={nextHref} className="pill" style={{ flex: 1 }}>{nextLabel}</Link>
      </div>
    </main>
  );
}
