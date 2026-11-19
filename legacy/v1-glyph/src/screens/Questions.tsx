import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { IconCheck, IconClose, IconDown, IconGrip, IconMinus, IconPlus, IconUp } from '../components/Icons';
import { TODAY_SHORT } from '../data';

type QType = 'yn' | 'slider' | 'step' | 'chips';
type Section = 'skin' | 'food' | 'rest';
type Answer = string | number;

interface Question { text: string; type: QType; home: Section; options?: string[] }

const QUESTIONS: Record<string, Question> = {
  improve: { text: 'Do you see improvements?', type: 'yn', home: 'skin' },
  acne: { text: 'Any new acne?', type: 'yn', home: 'skin' },
  redness: { text: 'How much redness do you have?', type: 'slider', home: 'skin' },
  irritation: { text: 'Any irritation or unusual reactions?', type: 'yn', home: 'skin' },
  newproduct: { text: 'Did you try a new product?', type: 'yn', home: 'skin' },
  sugar: { text: 'Did you have any sugar?', type: 'yn', home: 'food' },
  dairy: { text: 'Glasses of dairy milk?', type: 'step', home: 'food' },
  milk: { text: 'What kind of milk?', type: 'chips', options: ['Oat', 'Almond', 'Coconut', 'Regular', 'Goat'], home: 'food' },
  gluten: { text: 'Did you eat gluten?', type: 'yn', home: 'food' },
  caffeine: { text: 'Cups of caffeine?', type: 'step', home: 'food' },
  water: { text: 'Glasses of water?', type: 'step', home: 'food' },
  supplements: { text: 'Did you take supplements today?', type: 'yn', home: 'food' },
  sleep: { text: 'Hours of sleep?', type: 'step', home: 'rest' },
  stress: { text: 'How stressed do you feel?', type: 'slider', home: 'rest' },
  meditate: { text: 'Did you meditate today?', type: 'yn', home: 'rest' },
  exercise: { text: 'Did you exercise or sweat heavily?', type: 'yn', home: 'rest' },
  makeup: { text: 'Did you sleep in makeup?', type: 'yn', home: 'rest' },
  pillow: { text: 'Did you change your pillowcase?', type: 'yn', home: 'rest' },
  sun: { text: 'How much time in the sun?', type: 'slider', home: 'rest' },
};

const SECTIONS: Record<Section, { moment: string; title: string }> = {
  skin: { moment: 'Morning', title: 'Skin check-in' },
  food: { moment: 'Midday', title: 'Food & hydration' },
  rest: { moment: 'Evening', title: 'Recovery & lifestyle' },
};
const SECTION_KEYS: Section[] = ['skin', 'food', 'rest'];
const SLIDER = ['Minimal', 'Low', 'Medium', 'High', 'A lot'];

const circle = (on: boolean): React.CSSProperties => ({
  width: 44, height: 44, borderRadius: 999, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1.5px solid #000', background: on ? '#000' : '#fff', color: on ? '#fff' : '#000',
});
const smallRound: React.CSSProperties = { width: 36, height: 36, borderRadius: 999, border: '1.5px solid #000', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 };

/** B6 · Daily questions (long-press to edit) and B7 · edit mode */
export default function Questions({ startEdit = false }: { startEdit?: boolean }) {
  const [editing, setEditing] = useState(startEdit);
  const [adding, setAdding] = useState(false);
  const [order, setOrder] = useState<Record<Section, string[]>>({
    skin: ['improve', 'acne', 'redness', 'irritation'],
    food: ['sugar', 'dairy', 'milk', 'gluten', 'caffeine', 'water'],
    rest: ['sleep', 'stress', 'meditate', 'exercise'],
  });
  const [answers, setAnswers] = useState<Record<string, Answer>>({
    improve: 'y', acne: 'n', redness: 1, sugar: 'y', dairy: 1, milk: 'Oat', caffeine: 2, water: 5, sleep: 7, stress: 3,
  });
  const timer = useRef<number | null>(null);

  useEffect(() => setEditing(startEdit), [startEdit]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const setAns = (id: string, v: Answer) => setAnswers((a) => ({ ...a, [id]: v }));
  const move = (sec: Section, idx: number, dir: number) => setOrder((o) => {
    const list = o[sec].slice();
    const j = idx + dir;
    if (j < 0 || j >= list.length) return o;
    [list[idx], list[j]] = [list[j], list[idx]];
    return { ...o, [sec]: list };
  });
  const remove = (sec: Section, id: string) => setOrder((o) => ({ ...o, [sec]: o[sec].filter((x) => x !== id) }));
  const add = (id: string) => {
    const sec = QUESTIONS[id].home;
    setOrder((o) => ({ ...o, [sec]: [...o[sec], id] }));
    setAdding(false);
  };

  const pressStart = () => {
    if (editing) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { timer.current = null; setEditing(true); }, 500);
  };
  const pressEnd = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };

  const all = SECTION_KEYS.flatMap((s) => order[s]);
  const answered = all.filter((id) => answers[id] !== undefined).length;
  const used = new Set(all);
  const library = Object.keys(QUESTIONS).filter((id) => !used.has(id));

  const renderControl = (id: string, q: Question) => {
    const v = answers[id];
    switch (q.type) {
      case 'yn':
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" aria-pressed={v === 'y'} aria-label="Yes" style={circle(v === 'y')} onClick={() => setAns(id, 'y')}><IconCheck /></button>
            <button type="button" aria-pressed={v === 'n'} aria-label="No" style={circle(v === 'n')} onClick={() => setAns(id, 'n')}><IconClose size={16} strokeWidth={2.2} /></button>
          </div>
        );
      case 'step': {
        const n = typeof v === 'number' ? v : 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button type="button" aria-label="Less" onClick={() => setAns(id, Math.max(0, n - 1))} style={{ ...smallRound, width: 40, height: 40, color: '#000' }}><IconMinus /></button>
            <span aria-live="polite" style={{ minWidth: 28, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>{n}</span>
            <button type="button" aria-label="More" onClick={() => setAns(id, n + 1)} style={{ ...smallRound, width: 40, height: 40, border: 0, background: '#000', color: '#fff' }}><IconPlus size={14} strokeWidth={2.4} /></button>
          </div>
        );
      }
      case 'slider':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div role="radiogroup" aria-label={q.text} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4 }}>
              {SLIDER.map((label, k) => (
                <button
                  key={label} type="button" role="radio" aria-checked={v === k} aria-label={label} onClick={() => setAns(id, k)}
                  style={{ height: 28, border: 0, padding: 0, borderRadius: k === 0 ? '999px 4px 4px 999px' : k === 4 ? '4px 999px 999px 4px' : 4, background: typeof v === 'number' && k <= v ? '#000' : '#e6e6e6' }}
                />
              ))}
            </div>
            <div className="muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, lineHeight: '16px' }}><span>Minimal</span><span>A lot</span></div>
          </div>
        );
      case 'chips':
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {q.options!.map((o) => (
              <button
                key={o} type="button" aria-pressed={v === o} onClick={() => setAns(id, o)}
                style={{ height: 40, padding: '0 14px', borderRadius: 999, fontSize: 14, fontWeight: 500, border: '1.5px solid #000', background: v === o ? '#000' : '#fff', color: v === o ? '#fff' : '#000' }}
              >{o}</button>
            ))}
          </div>
        );
    }
  };

  return (
    <main className="screen" style={{ padding: '56px 0 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', minHeight: 44 }}>
        {editing ? (
          <button type="button" aria-label="Add a question" onClick={() => setAdding(true)} className="circle-btn solid" style={{ border: 0 }}>
            <IconPlus size={22} strokeWidth={2.2} />
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="h-title">Daily questions</h1>
            <p className="small muted">{TODAY_SHORT} · {answered} of {all.length} answered</p>
          </div>
        )}
        <button
          type="button" onClick={() => { setEditing((e) => !e); setAdding(false); }}
          style={{ height: 40, padding: '0 16px', borderRadius: 999, border: '1.5px solid #000', background: editing ? '#000' : '#fff', color: editing ? '#fff' : '#000', fontSize: 14, fontWeight: 600 }}
        >{editing ? 'Done' : 'Edit'}</button>
      </div>

      {editing ? (
        <p className="small muted" style={{ margin: '8px 24px 0' }}>Use the arrows to reorder, − to remove, + to add a question.</p>
      ) : (
        <div style={{ display: 'flex', gap: 8, padding: '12px 24px 0' }}>
          {SECTION_KEYS.map((s) => (
            <a
              key={s} href={`#sec-${s}`}
              onClick={(e) => { e.preventDefault(); document.getElementById(`sec-${s}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              style={{ height: 36, padding: '0 14px', borderRadius: 999, background: 'var(--fill)', color: '#000', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}
            >
              {SECTIONS[s].moment}<span className="muted">{order[s].length}</span>
            </a>
          ))}
        </div>
      )}

      <div className="scroll" style={{ padding: '8px 24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SECTION_KEYS.map((sec) => (
          <section key={sec} id={`sec-${sec}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <span className="eyebrow">{SECTIONS[sec].moment}</span>
              <span className="muted" style={{ fontSize: 12, lineHeight: '16px' }}>{SECTIONS[sec].title}</span>
              <span style={{ flex: 1, height: 1, background: '#000' }} />
            </div>
            {order[sec].map((id, idx) => {
              const q = QUESTIONS[id];
              const wide = q.type === 'slider' || q.type === 'chips';
              return (
                <div
                  key={id}
                  className={editing ? (idx % 2 ? 'jig2' : 'jig') : undefined}
                  onPointerDown={pressStart} onPointerUp={pressEnd} onPointerLeave={pressEnd} onPointerCancel={pressEnd}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ padding: '6px 0', borderBottom: '1px solid #ececec', userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'pan-y', background: '#fff' }}
                >
                  {editing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 48 }}>
                      <button type="button" aria-label={`Remove: ${q.text}`} onClick={() => remove(sec, id)} style={{ width: 26, height: 26, borderRadius: 999, border: 0, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>
                        <IconMinus size={12} strokeWidth={3} />
                      </button>
                      <span style={{ flex: 1, fontSize: 15, lineHeight: '20px' }}>{q.text}</span>
                      <button type="button" aria-label={`Move up: ${q.text}`} onClick={() => move(sec, idx, -1)} style={smallRound}><IconUp /></button>
                      <button type="button" aria-label={`Move down: ${q.text}`} onClick={() => move(sec, idx, 1)} style={smallRound}><IconDown /></button>
                      <span className="muted" style={{ display: 'flex' }}><IconGrip /></span>
                    </div>
                  ) : (
                    <div style={wide ? { display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 0' } : { display: 'flex', alignItems: 'center', gap: 12, minHeight: 52 }}>
                      <span style={{ flex: 1, fontSize: 15, lineHeight: '20px' }}>{q.text}</span>
                      {renderControl(id, q)}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}
        {!editing && <p className="small muted" style={{ textAlign: 'center' }}>Press and hold any question to rearrange or swap it.</p>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 24px' }}>
        {!editing && <Link to="/log/1" className="pill md">Log today</Link>}
        <Nav active="questions" />
      </div>

      {adding && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={() => setAdding(false)}>
          <div role="dialog" aria-label="Add a question" onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '28px 28px 0 0', padding: '12px 24px 40px', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 560 }}>
            <span style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 999, background: '#d0d0d0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              <h2 style={{ margin: 0, fontSize: 20, lineHeight: '26px', fontWeight: 500 }}>Add a question</h2>
              <button type="button" aria-label="Close" onClick={() => setAdding(false)} style={{ ...smallRound, width: 40, height: 40 }}><IconClose size={14} strokeWidth={2.4} /></button>
            </div>
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {library.length === 0 && <p className="small muted" style={{ padding: '16px 0' }}>Every question is already in your list.</p>}
              {library.map((id) => (
                <button key={id} type="button" onClick={() => add(id)} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, border: 0, borderBottom: '1px solid var(--line)', background: '#fff', textAlign: 'left', padding: 0 }}>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 15, lineHeight: '20px' }}>{QUESTIONS[id].text}</span>
                    <span className="muted" style={{ fontSize: 12, lineHeight: '16px' }}>Adds to {SECTIONS[QUESTIONS[id].home].moment} · {SECTIONS[QUESTIONS[id].home].title}</span>
                  </span>
                  <span style={{ width: 32, height: 32, borderRadius: 999, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconPlus size={14} strokeWidth={2.6} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
