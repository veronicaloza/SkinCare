import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Close, Up } from '../components/Icons';
import { Segmented, TopBar } from '../components/ui';
import { useStore } from '../store';

export default function Options() {
  const { foodOptions: opts, setFoodOptions: setOpts } = useStore();
  const [type, setType] = useState(1);
  const [question, setQuestion] = useState('What did you eat today?');
  const [draft, setDraft] = useState('');

  const up = (k: number) => {
    if (k === 0) return;
    const a = opts.slice();
    [a[k - 1], a[k]] = [a[k], a[k - 1]];
    setOpts(a);
  };
  const add = () => {
    const d = draft.trim();
    if (!d || opts.includes(d)) return;
    setOpts([...opts, d]);
    setDraft('');
  };

  return (
    <main className="screen">
      <TopBar back="/food" title="Edit question" wide right={<Link to="/food" className="pill-link">Done</Link>} />

      <div className="col" style={{ gap: 6 }}>
        <label htmlFor="qtext" className="eyebrow">Question</label>
        <input id="qtext" type="text" className="text-input" value={question} onChange={(e) => setQuestion(e.target.value)} />
      </div>

      <div className="col" style={{ gap: 6 }}>
        <span className="eyebrow">Answer type</span>
        <Segmented label="Answer type" options={['Yes / no', 'Pick many', 'Count']} value={type} onChange={setType} />
      </div>

      <div className="col" style={{ gap: 6, minHeight: 0, flex: 1 }}>
        <span className="eyebrow">Options · {opts.length}</span>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', borderTop: '1px solid #e6e6e6', overflowY: 'auto', minHeight: 0 }}>
          {opts.map((o, k) => (
            <li key={o} className="row" style={{ gap: 10, minHeight: 56, borderBottom: '1px solid #e6e6e6', flexShrink: 0 }}>
              <button type="button" aria-label={`Remove ${o}`} onClick={() => setOpts(opts.filter((x) => x !== o))}
                style={{ width: 32, height: 32, borderRadius: 999, border: 0, background: '#000', color: '#fff', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Close size={14} />
              </button>
              <span style={{ flex: 1, fontSize: 16 }}>{o}</span>
              <button type="button" className="iconbtn" aria-label={`Move ${o} up`} disabled={k === 0} style={{ opacity: k === 0 ? 0.3 : 1 }} onClick={() => up(k)}><Up /></button>
            </li>
          ))}
        </ul>
        <form className="row" style={{ gap: 8, paddingTop: 6 }} onSubmit={(e) => { e.preventDefault(); add(); }}>
          <label htmlFor="newopt" className="sr-only">New option</label>
          <input id="newopt" type="text" placeholder="Add an option, e.g. Matcha" className="text-input soft" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" style={{ height: 52, padding: '0 18px', borderRadius: 14, border: 0, background: '#000', color: '#fff', fontSize: 15, fontWeight: 600 }}>Add</button>
        </form>
      </div>

      <p className="foot">Changes apply from today. Past logs keep their old answers.</p>
    </main>
  );
}
