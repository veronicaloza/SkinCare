import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { CORES, FEELS, parseCode, summary } from '../glyph';
import { daysIn, isFuture, monthIndex, MONTHS, NOV, NOW, offsetOf, pastCode } from '../history';
import { codeOfEntry, useStore } from '../store';

const YEARS = [2024, 2025, 2026, 2027];
const SOURCE = 11;
/** Every month shown, oldest first: Jan of the first year to Dec of the last. */
const ALL = YEARS.flatMap((y) => MONTHS.map((_, m) => ({ y, m })));
const key = (y: number, m: number) => `${y}-${m}`;

export default function Calendar() {
  const { loggedAt, entry } = useStore();
  const navigate = useNavigate();
  const scroller = useRef<HTMLDivElement>(null);
  const sections = useRef<Record<string, HTMLElement | null>>({});
  const [view, setView] = useState({ y: NOW.y, m: NOW.m });
  const [drag, setDrag] = useState(false);
  const [from, setFrom] = useState(12);
  const [to, setTo] = useState(15);
  const [filled, setFilled] = useState<number[]>([]);
  const [justApplied, setJustApplied] = useState(0);

  const scrollTo = (y: number, m: number, smooth = true) => {
    const box = scroller.current, el = sections.current[key(y, m)];
    if (box && el) box.scrollTo({ top: el.offsetTop, behavior: smooth ? 'smooth' : 'auto' });
  };

  // Open on the current month, with earlier months above and later months below.
  useLayoutEffect(() => { scrollTo(NOW.y, NOW.m, false); }, []);

  /** Keep the title and year chips in sync with the month at the top. */
  const onScroll = () => {
    const box = scroller.current;
    if (!box) return;
    let cur = ALL[0];
    for (const mo of ALL) {
      const el = sections.current[key(mo.y, mo.m)];
      if (el && el.offsetTop <= box.scrollTop + 40) cur = mo; else break;
    }
    if (cur.y !== view.y || cur.m !== view.m) setView(cur);
  };

  const isCur = (y: number, m: number) => y === NOW.y && m === NOW.m;
  const codeOf = (y: number, m: number, d: number): string | null => {
    if (isCur(y, m)) {
      if (d === NOW.d) return loggedAt ? codeOfEntry(entry) : null;
      if (filled.includes(d)) return NOV[SOURCE];
    }
    return pastCode(y, m, d);
  };
  const isOpen = (y: number, m: number, d: number) => isCur(y, m) && d < NOW.d && !codeOf(y, m, d);

  const pick = (y: number, m: number, d: number) => {
    const code = codeOf(y, m, d);
    const today = isCur(y, m) && d === NOW.d;
    if (!drag) {
      if (code || today) navigate(today && !code ? '/camera' : '/day');
      return;
    }
    if (!isOpen(y, m, d)) return;
    setJustApplied(0);
    if (d < from) setFrom(d);
    else if (d > to) setTo(d);
    else if (d - from < to - d) setFrom(d);
    else setTo(d);
  };

  const range = Array.from({ length: to - from + 1 }, (_, k) => from + k).filter((d) => isOpen(NOW.y, NOW.m, d));
  const apply = () => { setFilled((f) => [...f, ...range]); setJustApplied(range.length); setDrag(false); };
  const startDrag = () => { setDrag(true); setJustApplied(0); scrollTo(NOW.y, NOW.m); };
  const srcLog = parseCode(NOV[SOURCE]);
  const awayFromNow = monthIndex(view.y, view.m) !== monthIndex(NOW.y, NOW.m);

  return (
    <main className="screen tabbed" style={{ padding: '56px 24px 20px', gap: 10 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
        <h1 className="h-title" aria-live="polite" style={{ whiteSpace: 'nowrap' }}>
          {MONTHS[view.m]} <span className="muted" style={{ fontWeight: 400 }}>{view.y}</span>
        </h1>
        {awayFromNow && !drag ? (
          <button type="button" className="chip bold" style={{ flexShrink: 0 }} onClick={() => scrollTo(NOW.y, NOW.m)}>Today</button>
        ) : (
          <button type="button" aria-pressed={drag} className={`chip bold${drag ? ' on' : ''}`} style={{ flexShrink: 0 }}
            onClick={() => (drag ? setDrag(false) : startDrag())}>{drag ? 'Done' : 'Log the same'}</button>
        )}
      </div>

      <div role="radiogroup" aria-label="Jump to year" className="row" style={{ gap: 6 }}>
        {YEARS.map((y) => (
          <button key={y} type="button" role="radio" aria-checked={view.y === y} className={`chip sm${view.y === y ? ' on' : ''}`}
            style={{ flex: 1, justifyContent: 'center', padding: 0 }} onClick={() => scrollTo(y, y === NOW.y ? NOW.m : 0)}>{y}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 2, fontSize: 11, lineHeight: '14px', color: '#5c5c5c', textAlign: 'center', borderBottom: '1px solid #e6e6e6', paddingBottom: 6 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}
      </div>

      <div ref={scroller} onScroll={onScroll} className="no-bar" style={{ flex: 1, minHeight: 0, overflowY: 'auto', position: 'relative', margin: '-10px 0 0' }}>
        {ALL.map(({ y, m }) => {
          const n = daysIn(y, m);
          const logged = Array.from({ length: n }, (_, k) => codeOf(y, m, k + 1)).filter(Boolean).length;
          return (
            <section key={key(y, m)} ref={(el) => { sections.current[key(y, m)] = el; }} aria-label={`${MONTHS[m]} ${y}`} style={{ paddingTop: 12 }}>
              <h2 className="eyebrow" style={{ margin: '0 0 6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{MONTHS[m]} {y}</span>
                {!isFuture(y, m, 1) && <span className="muted" style={{ fontWeight: 500, letterSpacing: 0 }}>{logged}/{isCur(y, m) ? NOW.d : n} logged</span>}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', rowGap: 2 }}>
                {Array.from({ length: offsetOf(y, m) }, (_, k) => <span key={`b${k}`} />)}
                {Array.from({ length: n }, (_, k) => {
                  const d = k + 1;
                  const code = codeOf(y, m, d);
                  const log = code ? parseCode(code) : null;
                  const future = isFuture(y, m, d);
                  const today = isCur(y, m) && d === NOW.d;
                  const sel = drag && d >= from && d <= to && isOpen(y, m, d);
                  const selStyle = sel ? {
                    background: '#f0f0f0', borderTop: '2px solid #000', borderBottom: '2px solid #000',
                    ...(d === from || !isOpen(y, m, d - 1) ? { borderLeft: '2px solid #000', borderTopLeftRadius: 14, borderBottomLeftRadius: 14 } : null),
                    ...(d === to || !isOpen(y, m, d + 1) ? { borderRight: '2px solid #000', borderTopRightRadius: 14, borderBottomRightRadius: 14 } : null),
                  } : drag && isCur(y, m) && d === SOURCE ? { background: '#000', color: '#fff', borderRadius: 14 } : null;
                  return (
                    <button key={d} type="button" onClick={() => pick(y, m, d)}
                      aria-label={`${MONTHS[m]} ${d}, ${y}${log ? `: ${summary(log)}` : future ? ', upcoming' : ', not logged'}`}
                      style={{ borderTop: 0, borderBottom: 0, borderLeft: 0, borderRight: 0, padding: '2px 0', minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, color: '#000', background: 'transparent', ...selStyle }}>
                      {log ? (
                        <Glyph size={34} r={CORES[log.f]} breakouts={log.b} itch={log.i > 0} travel={log.t} />
                      ) : (
                        <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
                          <circle cx="20" cy="20" r="11" fill="none" stroke={future ? '#d0d0d0' : '#000'} strokeWidth="0.8" strokeDasharray={future ? undefined : '1.6 1.6'} />
                        </svg>
                      )}
                      <span style={{ fontSize: 11, lineHeight: '13px', ...(today ? { fontWeight: 700, textDecoration: 'underline' } : null) }}>{d}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        <div style={{ height: drag ? 170 : 12 }} />
      </div>

      {drag && (
        <div role="dialog" aria-label="Log the same" className="col"
          style={{ position: 'absolute', left: 24, right: 24, bottom: 108, zIndex: 5, border: '1.5px solid #000', borderRadius: 22, padding: 14, gap: 10, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
          <div className="row" style={{ gap: 12 }}>
            <Glyph size={44} r={CORES[srcLog.f]} breakouts={srcLog.b} itch={srcLog.i > 0} travel={srcLog.t} />
            <span style={{ fontSize: 15, lineHeight: '21px' }}>
              <b style={{ fontWeight: 600 }}>Log Nov {from}–{to} the same as Wed 11?</b><br />
              <span style={{ color: '#5c5c5c' }}>{FEELS[srcLog.f]} skin, nothing new. Tap days to adjust.</span>
            </span>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button type="button" className="cta ghost" style={{ flex: 1, height: 48 }} onClick={() => setDrag(false)}>Cancel</button>
            <button type="button" className="cta" style={{ flex: 1.4, height: 48, fontWeight: 600 }} disabled={!range.length} onClick={apply}>
              Log {range.length} {range.length === 1 ? 'day' : 'days'}
            </button>
          </div>
        </div>
      )}
      {justApplied > 0 && (
        <p className="fill-card" style={{ position: 'absolute', left: 24, right: 24, bottom: 108, zIndex: 5, margin: 0, textAlign: 'center', fontSize: 15, fontWeight: 500 }}>Logged {justApplied} days ✓</p>
      )}

      <Nav active="calendar" />
    </main>
  );
}
