import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Close, Ghost } from '../components/Icons';
import { PHOTO } from '../components/ui';

const TIMES = ['Morning', 'Midday', 'Night'];
const TIPS = ['Face the window · same spot as yesterday', 'Midday light is harsh, step into shade', 'Use the bathroom light you used last night'];

export default function Camera() {
  const [time, setTime] = useState(0);
  const [ghost, setGhost] = useState(true);

  return (
    <main className="screen dark" style={{ padding: '56px 0 36px', gap: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between', padding: '0 20px' }}>
        <Link to="/" className="iconbtn glass" aria-label="Close camera"><Close /></Link>
        <div role="radiogroup" aria-label="Time of day" className="row" style={{ gap: 2, background: 'rgba(255,255,255,0.14)', borderRadius: 999, padding: 3 }}>
          {TIMES.map((l, k) => (
            <button key={l} type="button" role="radio" aria-checked={time === k} onClick={() => setTime(k)}
              style={{ height: 38, padding: '0 12px', borderRadius: 999, border: 0, fontSize: 13, fontWeight: 600, background: time === k ? '#fff' : 'transparent', color: time === k ? '#000' : '#fff' }}>{l}</button>
          ))}
        </div>
        <button type="button" className={`iconbtn glass${ghost ? ' on' : ''}`} aria-pressed={ghost} aria-label="Show yesterday’s photo as a guide" onClick={() => setGhost((g) => !g)}>
          <Ghost />
        </button>
      </div>

      <div style={{ position: 'relative', flex: 1, minHeight: 0, maxHeight: 560, overflow: 'hidden', margin: '0 12px', borderRadius: 28, background: '#222' }}>
        <img src={PHOTO} alt="Live mirror view" className="photo" style={{ transform: 'scaleX(-1)' }} />
        <img src={PHOTO} alt="" aria-hidden="true" className="photo"
          style={{ position: 'absolute', inset: 0, transform: 'scaleX(-1) translate(10px, 6px)', mixBlendMode: 'screen', opacity: ghost ? 0.28 : 0, transition: 'opacity .2s' }} />
        <svg viewBox="0 0 366 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <ellipse cx="183" cy="250" rx="118" ry="160" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M183 410v40" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, display: 'flex', justifyContent: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', height: 32, padding: '0 14px', borderRadius: 999, background: 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: 500 }}>
            {ghost ? 'Line up with yesterday’s outline' : TIPS[time]}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 28px' }}>
        <Link to="/album" aria-label="Open your photos" style={{ width: 52, height: 52, borderRadius: 14, overflow: 'hidden', border: '2px solid #fff', display: 'block' }}>
          <img src={PHOTO} alt="" className="photo" style={{ filter: 'saturate(0.95) brightness(1.03)' }} />
        </Link>
        <Link to="/entry" aria-label="Take photo" style={{ width: 80, height: 80, borderRadius: 999, border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 62, height: 62, borderRadius: 999, background: '#fff', display: 'block' }} />
        </Link>
        <Link to="/entry" style={{ justifySelf: 'end', color: '#fff', fontSize: 14, fontWeight: 500 }}>Skip photo</Link>
      </div>
    </main>
  );
}
