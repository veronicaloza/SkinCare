import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Barcode } from '../components/Icons';
import { ChipRadio, Switch, TopBar } from '../components/ui';

export default function Product() {
  const [name, setName] = useState('Gentle foaming cleanser');
  const [type, setType] = useState(0);
  const [rep, setRep] = useState(0);
  const [patch, setPatch] = useState(true);
  const dot = (s: number) => <span style={{ width: s, height: s, borderRadius: 999, background: '#ff5a3d', flexShrink: 0 }} />;

  return (
    <main className="screen">
      <TopBar back="/routine" title="New product" />
      <div className="scroll">
        <p className="lead">We’ll mark today as day 1 and watch your skin for 4 weeks, so you can see what this product actually did.</p>

        <div className="col" style={{ gap: 6 }}>
          <label htmlFor="pname" className="eyebrow">Product</label>
          <div className="row" style={{ gap: 8 }}>
            <input id="pname" type="text" className="text-input" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="button" aria-label="Scan the barcode" style={{ width: 52, height: 52, borderRadius: 14, border: '1.5px solid #000', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}>
              <Barcode />
            </button>
          </div>
        </div>

        <div className="col" style={{ gap: 6 }}>
          <span className="eyebrow">Type</span>
          <ChipRadio label="Product type" options={['Cleanser', 'Serum', 'Moisturiser', 'Sunscreen', 'Treatment', 'Makeup']} value={type} onChange={setType} />
        </div>

        <div className="col" style={{ gap: 6 }}>
          <span className="eyebrow">It replaces</span>
          <ChipRadio label="It replaces" options={['My old cleanser', 'Nothing, it’s an add-on', 'Not sure']} value={rep} onChange={setRep} />
        </div>

        <div className="row" style={{ gap: 12, border: '1.5px solid #000', borderRadius: 18, padding: '12px 14px' }}>
          <span className="col" style={{ flex: 1 }}>
            <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 600 }}>Patch test first</span>
            <span className="small muted">Remind me to check a small spot for 2 days</span>
          </span>
          <Switch on={patch} label="Patch test first" onToggle={() => setPatch((p) => !p)} />
        </div>

        <div className="col" style={{ gap: 8 }}>
          <span className="eyebrow">How it shows up</span>
          <div className="row" style={{ gap: 4 }} aria-hidden="true">
            {dot(12)}{dot(12)}
            <span style={{ width: 3, height: 26, borderRadius: 999, background: '#000', margin: '0 4px' }} />
            {dot(12)}{dot(9)}{dot(7)}{dot(5)}
            <span style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg, #000 0 4px, transparent 4px 8px)' }} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>4 weeks</span>
          </div>
          <p className="small muted" style={{ margin: 0 }}>A line marks day 1 on your calendar and photos, so “before” and “after” are one tap apart.</p>
        </div>
      </div>

      <Link to="/routine" className="cta">Start tracking from today</Link>
    </main>
  );
}
