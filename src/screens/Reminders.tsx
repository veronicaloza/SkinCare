import { useState } from 'react';
import { Bell } from '../components/Icons';
import { Segmented, Switch, TopBar } from '../components/ui';

const R = [
  { moment: 'MORNING', what: 'Photo + how my skin feels', when: 'Weekdays 8:00 · weekends 10:00', time: '8:00', title: 'Morning photo?', body: 'Same window as yesterday. It takes 40 seconds.' },
  { moment: 'MIDDAY', what: 'What I ate & drank', when: 'Every day 13:30', time: '13:30', title: 'Lunch check', body: 'Coffee count and food so far?' },
  { moment: 'NIGHT', what: 'Night photo + skincare routine', when: 'Every day 22:00', time: '22:00', title: 'Night routine done?', body: 'Tick it off and snap a quick photo.' },
];

export default function Reminders() {
  const [on, setOn] = useState([true, false, true]);
  const [pv, setPv] = useState(0);
  const [skip, setSkip] = useState(0);
  const preview = R[pv];

  return (
    <main className="screen">
      <TopBar back="/" title="Reminders" />

      <div className="col" style={{ gap: 6 }}>
        <span className="eyebrow">Preview on your lock screen</span>
        <div style={{ background: '#1a1a1a', borderRadius: 24, padding: 14 }}>
          <div className="row" style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 18, padding: 12, gap: 10, alignItems: 'flex-start' }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bell /></span>
            <span className="col" style={{ flex: 1, gap: 2 }}>
              <span className="row" style={{ justifyContent: 'space-between', fontSize: 12, color: '#5c5c5c' }}>
                <span style={{ fontWeight: 600, color: '#000' }}>CLEARDAY</span><span>{preview.time}</span>
              </span>
              <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 600 }}>{preview.title}</span>
              <span style={{ fontSize: 14, lineHeight: '19px' }}>{preview.body}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="col" style={{ borderTop: '1px solid #e6e6e6' }}>
        {R.map((r, k) => (
          <div key={r.moment} className="row" style={{ gap: 12, minHeight: 76, borderBottom: '1px solid #e6e6e6' }}>
            <button type="button" onClick={() => setPv(k)} aria-pressed={pv === k}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left', border: 0, background: 'transparent', padding: 0, color: '#000' }}>
              <span className="eyebrow">{r.moment}</span>
              <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 500 }}>{r.what}</span>
              <span className="small muted">{r.when}</span>
            </button>
            <Switch on={on[k]} label={`${r.moment.toLowerCase()} reminder`} onToggle={() => setOn((a) => a.map((v, i) => (i === k ? !v : v)))} />
          </div>
        ))}
      </div>

      <div className="col" style={{ gap: 6 }}>
        <span className="eyebrow">If I’ve already logged</span>
        <Segmented label="If already logged" options={['Skip the reminder', 'Remind me anyway']} value={skip} onChange={setSkip} />
      </div>

      <div className="spacer" />
      <p className="foot">Tap a reminder to preview it. Clearday never sends more than 3 a day.</p>
    </main>
  );
}
