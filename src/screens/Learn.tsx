import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Close } from '../components/Icons';

const TOPICS = [
  {
    label: 'Dairy', kind: 'RESEARCH', title: 'Dairy and breakouts',
    body: 'A review of 14 studies covering about 78,000 young people found that drinking milk was linked with higher odds of acne. It’s a link, not proof, which is why we track it per person.',
    src: 'Juhl et al. (2018). Dairy intake and acne vulgaris: a systematic review and meta-analysis. Nutrients, 10(8), 1049.',
    asked: 'Food & drink → “Glasses of dairy milk”',
  },
  {
    label: 'Stress', kind: 'RESEARCH', title: 'Stress and acne',
    body: 'Students’ acne got worse during exam periods, and the change tracked with how stressed they reported feeling, more than with sleep or diet changes.',
    src: 'Chiu, Chon & Kimball (2003). The response of skin disease to stress. Archives of Dermatology, 139(7), 897–900.',
    asked: 'Skin check-in → “How stressed do you feel?”',
  },
  {
    label: 'Photos', kind: 'FROM INTERVIEWS', title: 'Why photos come first',
    body: '[Add a quote from your interviews here, e.g. what a participant said about checking their skin in the mirror.]',
    src: '[Interview round, number of participants, dates]',
    asked: 'Every log starts with a mirror photo',
  },
];

export default function Learn() {
  const [tab, setTab] = useState(0);
  const a = TOPICS[tab];
  return (
    <main className="screen" style={{ paddingTop: 60 }}>
      <div className="topbar">
        <Link to="/" className="iconbtn" aria-label="Close"><Close /></Link>
        <span className="small muted" style={{ textAlign: 'center' }}>Learn</span>
        <span style={{ width: 44 }} />
      </div>
      <div className="col" style={{ gap: 6 }}>
        <h1 className="h-title">Why we ask</h1>
        <p className="lead">Every question in your log is backed by research or by what people told us in interviews.</p>
      </div>

      <div role="tablist" aria-label="Topics" className="row" style={{ gap: 6 }}>
        {TOPICS.map((t, k) => (
          <button key={t.label} type="button" role="tab" aria-selected={tab === k} className={`chip bold${tab === k ? ' on' : ''}`} onClick={() => setTab(k)}>{t.label}</button>
        ))}
      </div>

      <article style={{ border: '1.5px solid #000', borderRadius: 24, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span className="badge" style={{ alignSelf: 'flex-start', height: 26, fontSize: 11, letterSpacing: '0.06em' }}>{a.kind}</span>
        <h2 style={{ margin: 0, fontSize: 21, lineHeight: '26px', fontWeight: 500 }}>{a.title}</h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: '22px' }}>{a.body}</p>
        <div className="col" style={{ borderTop: '1px solid #e6e6e6', paddingTop: 10, gap: 4 }}>
          <span className="eyebrow">Source</span>
          <span className="small muted">{a.src}</span>
        </div>
      </article>

      <div className="col" style={{ gap: 6 }}>
        <span className="eyebrow">It shows up in your log as</span>
        <div className="fill-card row" style={{ gap: 12 }}>
          <span style={{ width: 36, height: 36, borderRadius: 999, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, flexShrink: 0 }}>?</span>
          <span style={{ fontSize: 15, lineHeight: '20px' }}>{a.asked}</span>
        </div>
      </div>

      <div className="spacer" />
      <p className="foot" style={{ fontSize: 12, lineHeight: '16px' }}>Clearday spots patterns. It doesn’t diagnose. See a dermatologist for anything that worries you.</p>
    </main>
  );
}
