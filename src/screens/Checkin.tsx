import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Glyph from '../components/Glyph';
import { IconBack, IconClose } from '../components/Icons';
import { COLORS, CORES, FEELS, describe, itchWidth, summary, type SkinLog } from '../glyph';
import { useStore } from '../store';

const HINTS = [
  'The centre is how your skin feels. Bigger and heavier means a rougher day.',
  'A solid ring means breakouts showed up today.',
  'A dashed ring means itch or dryness. The thicker it is, the itchier.',
  'A dotted outer ring means you were travelling.',
  'This is today’s glyph. It lands in your journal next to every other day.',
];

function YesNo({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div role="radiogroup" aria-label={label} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
      {([['No', false], ['Yes', true]] as const).map(([l, v]) => (
        <button key={l} type="button" role="radio" aria-checked={value === v} className="choice" style={{ height: 64, fontSize: 16 }} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  );
}

/** B2 · Check-in builds the glyph, layer by layer */
export default function Checkin() {
  const { save } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<SkinLog>({ f: 2, b: false, i: 0, t: false });
  const set = (patch: Partial<SkinLog>) => setLog((l) => ({ ...l, ...patch }));

  // Layers only appear once their question has been reached.
  const layers = {
    coreR: CORES[log.f],
    b: step >= 1 && log.b ? COLORS.break : 'none',
    i: step >= 2 && log.i > 0 ? COLORS.itch : 'none',
    iW: itchWidth(log.i),
    t: step >= 3 && log.t ? COLORS.travel : 'none',
  };
  const shown: SkinLog = { f: log.f, b: step >= 1 && log.b, i: step >= 2 ? log.i : 0, t: step >= 3 && log.t };

  const next = () => {
    if (step === 3) save(log);
    setStep((s) => Math.min(4, s + 1));
  };

  return (
    <main className="screen" style={{ padding: '60px 24px 40px', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" className="circle-btn" aria-label="Close"><IconClose /></Link>
        <div className="ticks" aria-hidden="true">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className={k < step ? 'on' : k === step && step < 4 ? 'current' : step === 4 ? 'on' : ''} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 8 }}>
        <Glyph size={220} hairline layers={layers} label={`Today’s glyph: ${describe(shown)}`} />
        <p className="small muted" style={{ textAlign: 'center', maxWidth: 280 }}>{HINTS[step]}</p>
      </div>

      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 className="h-question">How does your skin feel?</h1>
          <div role="radiogroup" aria-label="Skin feeling" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 6 }}>
            {FEELS.map((label, k) => (
              <button key={label} type="button" role="radio" aria-checked={log.f === k} className="choice feel" style={{ height: 84 }} onClick={() => set({ f: k })}>
                <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r={CORES[k] * 0.9} fill={log.f === k ? '#fff' : COLORS.core} /></svg>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 className="h-question">Any new breakouts?</h1>
          <YesNo label="Breakouts" value={log.b} onChange={(b) => set({ b })} />
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 className="h-question">How itchy or dry is it?</h1>
          <div role="radiogroup" aria-label="Itch level" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={log.i === n} className="choice round" style={{ height: 56, fontSize: 16 }} onClick={() => set({ i: n })}>{n}</button>
            ))}
          </div>
          <div className="muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, lineHeight: '16px' }}>
            <span>Not at all</span><span>Can’t stop scratching</span>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 className="h-question">Travelling, or flew in the last day?</h1>
          <YesNo label="Travel" value={log.t} onChange={(t) => set({ t })} />
        </div>
      )}

      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
          <h1 className="h-question">Logged. That’s today.</h1>
          <p className="body muted">{summary(log)}</p>
        </div>
      )}

      <div className="spacer" />

      {step < 4 ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="circle-btn lg" aria-label="Previous question" onClick={() => (step === 0 ? navigate('/') : setStep(step - 1))}>
            <IconBack />
          </button>
          <button type="button" className="pill" style={{ flex: 1 }} onClick={next}>{step === 3 ? 'Log today' : 'Next'}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link to="/journal" className="pill">See it in your journal</Link>
          <button type="button" className="link-btn">Add a photo</button>
        </div>
      )}
    </main>
  );
}
