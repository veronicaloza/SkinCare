import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Plus } from '../components/Icons';
import { Segmented, TopBar } from '../components/ui';
import { ROUTINES, useStore } from '../store';

export default function Routine() {
  const { routine, setRoutine } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const list = ROUTINES[tab];
  const d = routine.done[tab];
  const allOn = list.every((_, k) => d[k]);

  const setTabDone = (n: Record<number, boolean>) => {
    const done = [...routine.done] as typeof routine.done;
    done[tab] = n;
    setRoutine({ done, skipped: false });
  };

  return (
    <main className="screen">
      <TopBar back="/entry" backLabel="Back to today’s entry" title="Did my skincare" />

      <Segmented label="Routine" options={['Morning', 'Night']} value={tab} onChange={setTab} />

      <button type="button" onClick={() => setTabDone(Object.fromEntries(list.map((_, k) => [k, !allOn])))}
        style={{ height: 56, borderRadius: 18, border: '1.5px solid #000', background: allOn ? '#000' : '#fff', color: allOn ? '#fff' : '#000', fontSize: 16, fontWeight: 600, flexShrink: 0 }}>
        {allOn ? '✓ Whole routine done' : 'Did my whole routine'}
      </button>

      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', borderTop: '1px solid #e6e6e6' }}>
        {list.map(([name, product, isNew], k) => (
          <li key={name} style={{ borderBottom: '1px solid #e6e6e6' }}>
            <button type="button" aria-pressed={!!d[k]} onClick={() => setTabDone({ ...d, [k]: !d[k] })}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, minHeight: 64, border: 0, background: '#fff', padding: 0, textAlign: 'left' }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', ...(d[k] ? { background: '#000' } : { border: '2px solid #000' }) }}>
                {d[k] && <Check />}
              </span>
              <span className="col" style={{ flex: 1 }}>
                <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 500 }}>{name}</span>
                <span className="small muted">{product}</span>
              </span>
              {isNew && <span className="badge" style={{ height: 24, padding: '0 8px', fontSize: 11 }}>NEW · DAY 22</span>}
            </button>
          </li>
        ))}
      </ol>

      <Link to="/product" className="row" style={{ gap: 10, minHeight: 48, color: '#000', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
        <span style={{ width: 32, height: 32, borderRadius: 999, border: '1.5px dashed #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus /></span>
        Started a new product?
      </Link>

      <div className="spacer" />
      <div className="row" style={{ gap: 8 }}>
        <button type="button" className="cta ghost" style={{ flex: 1 }} onClick={() => { setRoutine({ skipped: true }); navigate('/entry'); }}>Skipped today</button>
        <Link to="/entry" className="cta" style={{ flex: 1.4 }}>Save</Link>
      </div>
    </main>
  );
}
