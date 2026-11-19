import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sliders } from '../components/Icons';
import { ChipToggles, Switch, toggleKey, TopBar } from '../components/ui';
import { useStore } from '../store';

const VITS = ['Zinc', 'Vitamin D', 'Omega-3', 'Probiotic'];
const SUGGEST = ['Matcha', 'Chocolate', 'Whey protein', 'Energy drink'];

export default function Food() {
  const { food, setFood, foodOptions, setFoodOptions } = useStore();
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');

  const add = (name: string) => {
    const n = name.trim();
    if (!n) return;
    if (!foodOptions.includes(n)) setFoodOptions([...foodOptions, n]);
    setFood({ foods: { ...food.foods, [n]: true } });
    setAdding(false);
    setQuery('');
  };
  const suggestions = SUGGEST.filter((s) => !foodOptions.includes(s) && s.toLowerCase().includes(query.trim().toLowerCase()));

  const counter = (key: 'coffee' | 'water', label: string, unit: string) => (
    <div key={key} className="col" style={{ border: '1.5px solid #000', borderRadius: 20, padding: 12, gap: 8 }}>
      <span style={{ fontSize: 14, lineHeight: '18px', fontWeight: 600 }}>{label}</span>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button type="button" className="iconbtn" aria-label={`Less ${label.toLowerCase()}`} style={{ fontSize: 22 }} onClick={() => setFood({ [key]: Math.max(0, food[key] - 1) })}>−</button>
        <span style={{ fontSize: 28, lineHeight: '32px', fontWeight: 500 }} aria-live="polite">{food[key]}</span>
        <button type="button" className="iconbtn solid" aria-label={`More ${label.toLowerCase()}`} style={{ fontSize: 22 }} onClick={() => setFood({ [key]: food[key] + 1 })}>+</button>
      </div>
      <span style={{ fontSize: 12, lineHeight: '16px', color: '#5c5c5c' }}>{unit}</span>
    </div>
  );

  return (
    <main className="screen">
      <TopBar back="/entry" backLabel="Back to today’s entry" title="What I ate & drank"
        right={<Link to="/options" className="iconbtn" aria-label="Customize these options"><Sliders /></Link>} />

      <div className="scroll">
        <div className="grid2" style={{ gap: 8 }}>
          {counter('coffee', 'Coffee', 'cups today')}
          {counter('water', 'Water', 'glasses today')}
        </div>

        <div className="col" style={{ gap: 8 }}>
          <span className="eyebrow">Food today</span>
          <div className="wrap">
            <ChipToggles options={foodOptions} on={food.foods} onToggle={(f) => setFood({ foods: toggleKey(food.foods, f) })} />
            <button type="button" className="chip dashed" aria-label="Add a food" onClick={() => setAdding(true)}><Plus />Add food</button>
          </div>
        </div>

        <div className="col" style={{ gap: 8 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="eyebrow">Vitamins &amp; supplements</span>
            <Switch on={food.vit} label="Took my vitamins" onToggle={() => setFood({ vit: !food.vit })} />
          </div>
          <ChipToggles options={VITS} on={food.vits} dim={!food.vit} onToggle={(v) => setFood({ vits: toggleKey(food.vits, v) })} />
        </div>
      </div>

      <Link to="/entry" className="cta">Done</Link>

      {adding && (
        <div className="overlay sheet-bg" onClick={(e) => { if (e.target === e.currentTarget) setAdding(false); }}>
          <div role="dialog" aria-label="Add a food" className="sheet">
            <span className="grabber" />
            <label htmlFor="foodsearch" style={{ fontSize: 20, lineHeight: '26px', fontWeight: 500 }}>Add a food</label>
            <form className="row" style={{ gap: 8 }} onSubmit={(e) => { e.preventDefault(); add(query); }}>
              <input id="foodsearch" type="search" autoFocus placeholder="Search or type a food" className="text-input" style={{ height: 48 }} value={query} onChange={(e) => setQuery(e.target.value)} />
              {query.trim() && <button type="submit" className="pill-link" style={{ height: 48 }}>Add</button>}
            </form>
            <div className="col">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => add(s)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, border: 0, borderBottom: '1px solid #e6e6e6', background: '#fff', fontSize: 15, textAlign: 'left', padding: 0 }}>
                  {s}<span style={{ width: 32, height: 32, borderRadius: 999, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>+</span>
                </button>
              ))}
            </div>
            <button type="button" className="cta ghost" style={{ height: 48 }} onClick={() => setAdding(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
