import { Link, useNavigate } from 'react-router-dom';
import Glyph from '../components/Glyph';
import { Back, Bottle, Cup, Note, Plane } from '../components/Icons';
import { PHOTO } from '../components/ui';
import { CORES, FEELS } from '../glyph';
import { useStore } from '../store';

const MARKS: [string, string, string][] = [
  ['spots', 'New spots', '#7a5cff'], ['itch', 'Itchy or dry', '#ff6fd8'], ['red', 'Red', '#000'], ['oily', 'Oily', '#000'], ['none', 'Nothing new', '#d0d0d0'],
];

const MORE = [
  { to: '/food', label: 'Food', Icon: Cup },
  { to: '/routine', label: 'Skincare', Icon: Bottle },
  { to: '/travel', label: 'Travel', Icon: Plane },
  { to: '/notes', label: 'Note', Icon: Note },
];

export default function Entry() {
  const { entry, setEntry, saveToday } = useStore();
  const navigate = useNavigate();
  const { feel, marks } = entry;

  const toggle = (id: string) => {
    let n = { ...marks };
    if (id === 'none') n = n.none ? {} : { none: true };
    else { n[id] = !n[id]; delete n.none; }
    setEntry({ marks: n });
  };

  const label = `Today’s glyph: ${FEELS[feel].toLowerCase()}${marks.spots ? ', new spots' : ''}${marks.itch ? ', itchy' : ''}`;

  return (
    <main className="screen">
      <div className="topbar">
        <Link to="/camera" className="iconbtn" aria-label="Back to camera"><Back /></Link>
        <span className="small muted" style={{ textAlign: 'center' }}>Thu 19 Nov · Morning</span>
        <span style={{ width: 44 }} />
      </div>

      <div className="row" style={{ gap: 14, alignItems: 'stretch' }}>
        <div style={{ position: 'relative', width: 150, height: 150, borderRadius: 22, overflow: 'hidden', flexShrink: 0 }}>
          <img src={PHOTO} alt="Today’s morning photo" className="photo" />
          <Link to="/camera" className="badge light" style={{ position: 'absolute', left: 8, bottom: 8, textDecoration: 'none' }}>Retake</Link>
        </div>
        <div className="col" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f0f0f0', borderRadius: 22 }}>
          <Glyph size={96} feel={feel} breakouts={marks.spots} itch={marks.itch} label={label} />
          <span style={{ fontSize: 12, lineHeight: '16px', color: '#5c5c5c' }}>Builds as you answer</span>
        </div>
      </div>

      <div className="col" style={{ gap: 10 }}>
        <h1 className="h-q">How does your skin feel today?</h1>
        <div role="radiogroup" aria-label="How your skin feels" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 6 }}>
          {FEELS.map((l, k) => {
            const on = feel === k;
            return (
              <button key={l} type="button" role="radio" aria-checked={on} onClick={() => setEntry({ feel: k })}
                style={{ height: 68, padding: 0, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 12, fontWeight: 500, border: '1.5px solid #000', background: on ? '#000' : '#fff', color: on ? '#fff' : '#000' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r={CORES[k] * 0.9} fill={on ? '#fff' : '#ff5a3d'} /></svg>
                <span>{l}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="col" style={{ gap: 10 }}>
        <h2 className="h-q">Anything new on your skin?</h2>
        <div className="wrap">
          {MARKS.map(([id, l, c]) => (
            <button key={id} type="button" aria-pressed={!!marks[id]} className={`chip${marks[id] ? ' on' : ''}`} onClick={() => toggle(id)}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: c, boxShadow: marks[id] && c === '#000' ? '0 0 0 1.5px #fff' : undefined }} />{l}
            </button>
          ))}
        </div>
      </div>

      <div className="col" style={{ gap: 8 }}>
        <span className="eyebrow">Add more (optional)</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
          {MORE.map(({ to, label: l, Icon }) => (
            <Link key={to} to={to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, height: 76, borderRadius: 16, border: '1.5px solid #000', textDecoration: 'none', color: '#000', fontSize: 12, fontWeight: 600 }}>
              <Icon />{l}
            </Link>
          ))}
        </div>
      </div>

      <div className="spacer" />
      <button type="button" className="cta" onClick={() => { saveToday(); navigate('/day'); }}>Save today</button>
    </main>
  );
}
