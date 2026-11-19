import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopBar } from '../components/ui';

const KINDS = [
  { label: 'Product reaction', sub: 'Stinging, rash, breakout', placeholder: 'e.g. burned a bit after applying',
    fields: [{ label: 'Which product?', opts: ['Foaming cleanser', 'Retinol', 'Other'] }, { label: 'What happened?', opts: ['Stinging', 'Redness', 'Rash', 'New spots'] }] },
  { label: 'Hormones', sub: 'Period, birth control', placeholder: 'e.g. started a new pill',
    fields: [{ label: 'What’s going on?', opts: ['Period', 'PMS', 'Birth control change'] }] },
  { label: 'Stressful event', sub: 'Exams, deadlines', placeholder: 'e.g. finals week',
    fields: [{ label: 'How big?', opts: ['A bit', 'A lot', 'Overwhelming'] }] },
  { label: 'Environment', sub: 'Weather, pollution', placeholder: 'e.g. heating turned on',
    fields: [{ label: 'What changed?', opts: ['Heating on', 'Heatwave', 'Smoke / smog', 'New detergent'] }] },
  { label: 'Doctor visit', sub: 'Derm, prescription', placeholder: 'e.g. prescribed a cream',
    fields: [{ label: 'Outcome', opts: ['New prescription', 'Check-up', 'Referral'] }] },
  { label: 'Something else', sub: 'Free text', placeholder: 'Write anything', fields: [] as { label: string; opts: string[] }[] },
];

export default function Notes() {
  const [kind, setKind] = useState(0);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const form = KINDS[kind];

  return (
    <main className="screen">
      <TopBar back="/entry" backLabel="Back to today’s entry" title="Add a note" />
      <div className="scroll">
        <p className="lead">Pick what kind of note it is. That way Clearday can spot patterns in your notes too.</p>

        <div role="radiogroup" aria-label="Kind of note" className="grid2" style={{ gap: 8 }}>
          {KINDS.map((x, i) => {
            const on = kind === i;
            return (
              <button key={x.label} type="button" role="radio" aria-checked={on} onClick={() => { setKind(i); setPicked({}); }}
                style={{ minHeight: 64, padding: '10px 12px', borderRadius: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', border: '1.5px solid #000', background: on ? '#000' : '#fff', color: on ? '#fff' : '#000' }}>
                <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 600 }}>{x.label}</span>
                <span style={{ fontSize: 12, lineHeight: '16px', color: on ? '#d6d6d6' : '#5c5c5c' }}>{x.sub}</span>
              </button>
            );
          })}
        </div>

        <div className="line-card col" style={{ gap: 10 }}>
          <span className="eyebrow">{form.label}</span>
          {form.fields.map((f) => (
            <div key={f.label} className="col" style={{ gap: 6 }}>
              <span style={{ fontSize: 14, lineHeight: '18px', fontWeight: 500 }}>{f.label}</span>
              <div className="wrap">
                {f.opts.map((o) => {
                  const id = `${f.label}:${o}`;
                  return (
                    <button key={o} type="button" aria-pressed={!!picked[id]} className={`chip static${picked[id] ? ' on' : ''}`}
                      onClick={() => setPicked((p) => ({ ...p, [id]: !p[id] }))}>{o}</button>
                  );
                })}
              </div>
            </div>
          ))}
          <label className="col" style={{ gap: 6, fontSize: 14, fontWeight: 500 }}>Anything else (optional)
            <textarea rows={2} placeholder={form.placeholder} style={{ borderRadius: 12, border: 0, background: '#f0f0f0', padding: '10px 12px', fontSize: 15, resize: 'none' }} />
          </label>
        </div>
      </div>

      <Link to="/entry" className="cta">Add note</Link>
    </main>
  );
}
