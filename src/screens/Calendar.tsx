import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { CORES, FEELS, parseCode, summary } from '../glyph';
import { daysIn, isFuture, monthIndex, MONTHS, NOW, offsetOf, pastCode } from '../history';
import { codeOfEntry, useStore } from '../store';

const YEARS = [2024, 2025, 2026, 2027];
/** Every month shown, oldest first: Jan of the first year to Dec of the last. */
const ALL = YEARS.flatMap((y) => MONTHS.map((_, m) => ({ y, m })));
const key = (y: number, m: number) => `${y}-${m}`;
const dayKey = (y: number, m: number, d: number) => `${y}-${m}-${d}`;
/** Day number since the epoch, so a drag can span months. */
const ord = (y: number, m: number, d: number) => Math.round(Date.UTC(y, m, d) / 864e5);
const fromOrd = (o: number) => { const t = new Date(o * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth(), d: t.getUTCDate() }; };
const TODAY = ord(NOW.y, NOW.m, NOW.d);
const short = (o: number) => { const { y, m, d } = fromOrd(o); return new Date(y, m, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };

const MARKS: [string, string, string][] = [['spots', 'New spots', '#7a5cff'], ['itch', 'Itchy or dry', '#ff6fd8'], ['travel', 'Travelling', '#8cc20a']];

export default function Calendar() {
  const { loggedAt, entry, bulk, logDays, setEntry, saveToday } = useStore();
  const navigate = useNavigate();
  const scroller = useRef<HTMLDivElement>(null);
  const sections = useRef<Record<string, HTMLElement | null>>({});
  const [view, setView] = useState({ y: NOW.y, m: NOW.m });

  // Multi-day logging
  const [selecting, setSelecting] = useState(false);
  const [anchor, setAnchor] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const dragging = useRef(false);
  const [feel, setFeel] = useState(2);
  const [marks, setMarks] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState('');

  const lo = anchor != null && end != null ? Math.min(anchor, end) : null;
  const hi = anchor != null && end != null ? Math.min(TODAY, Math.max(anchor, end)) : null;
  const count = lo != null && hi != null ? hi - lo + 1 : 0;
  const isSel = (o: number) => lo != null && hi != null && o >= lo && o <= hi;

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
    const b = bulk[dayKey(y, m, d)];
    if (b) return b;
    if (isCur(y, m) && d === NOW.d) return loggedAt ? codeOfEntry(entry) : null;
    return pastCode(y, m, d);
  };

  /** The day cell under a screen point, as an ordinal (future days clamp to today). */
  const ordAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-ord]');
    if (!el) return null;
    const o = +el.dataset.ord!;
    return o > TODAY ? TODAY : o;
  };

  const onPointerDown = (e: RPointerEvent) => {
    if (!selecting) return;
    const o = ordAt(e.clientX, e.clientY);
    if (o == null) return;
    e.preventDefault();
    dragging.current = true;
    setAnchor(o);
    setEnd(o);
    setToast('');
  };

  // Follow the finger/mouse across days, scrolling when it nears the edges.
  useEffect(() => {
    if (!selecting) return;
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const o = ordAt(e.clientX, e.clientY);
      if (o != null) setEnd(o);
      const box = scroller.current;
      if (box) {
        const r = box.getBoundingClientRect();
        if (e.clientY < r.top + 40) box.scrollBy(0, -14);
        else if (e.clientY > r.bottom - 40) box.scrollBy(0, 14);
      }
    };
    const up = () => { dragging.current = false; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [selecting]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const openDay = (y: number, m: number, d: number) => {
    if (selecting) return;
    const today = isCur(y, m) && d === NOW.d;
    if (codeOf(y, m, d) || today) navigate(today && !codeOf(y, m, d) ? '/camera' : '/day');
  };

  const startSelecting = () => { setSelecting(true); setAnchor(null); setEnd(null); setFeel(2); setMarks({}); setToast(''); };
  const stopSelecting = () => { setSelecting(false); setAnchor(null); setEnd(null); };

  const draftCode = `${feel}${marks.spots ? 1 : 0}${marks.itch ? 2 : 0}${marks.travel ? 1 : 0}`;
  const apply = () => {
    if (lo == null || hi == null) return;
    const codes: Record<string, string> = {};
    for (let o = lo; o <= hi; o++) { const { y, m, d } = fromOrd(o); codes[dayKey(y, m, d)] = draftCode; }
    logDays(codes);
    if (hi === TODAY) {
      setEntry({ feel, marks: { spots: !!marks.spots, itch: !!marks.itch } });
      if (!loggedAt) saveToday();
    }
    setToast(`Logged ${count} ${count === 1 ? 'day' : 'days'} ✓`);
    stopSelecting();
  };

  const awayFromNow = monthIndex(view.y, view.m) !== monthIndex(NOW.y, NOW.m);
  const draft = parseCode(draftCode);

  return (
    <main className="screen tabbed" style={{ padding: '56px 24px 20px', gap: 10 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
        <h1 className="h-title" aria-live="polite" style={{ whiteSpace: 'nowrap' }}>
          {MONTHS[view.m]} <span className="muted" style={{ fontWeight: 400 }}>{view.y}</span>
        </h1>
        {selecting ? (
          <button type="button" className="chip bold on" style={{ flexShrink: 0 }} onClick={stopSelecting}>Cancel</button>
        ) : awayFromNow ? (
          <button type="button" className="chip bold" style={{ flexShrink: 0 }} onClick={() => scrollTo(NOW.y, NOW.m)}>Today</button>
        ) : (
          <button type="button" className="chip bold" style={{ flexShrink: 0 }} onClick={startSelecting}>Log several days</button>
        )}
      </div>

      {selecting ? (
        <p className="small" style={{ margin: 0, minHeight: 40, display: 'flex', alignItems: 'center', fontWeight: 500 }}>
          Drag across the days that felt the same, then pick what you had.
        </p>
      ) : (
        <div role="radiogroup" aria-label="Jump to year" className="row" style={{ gap: 6 }}>
          {YEARS.map((y) => (
            <button key={y} type="button" role="radio" aria-checked={view.y === y} className={`chip sm${view.y === y ? ' on' : ''}`}
              style={{ flex: 1, justifyContent: 'center', padding: 0 }} onClick={() => scrollTo(y, y === NOW.y ? NOW.m : 0)}>{y}</button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 2, fontSize: 11, lineHeight: '14px', color: '#5c5c5c', textAlign: 'center', borderBottom: '1px solid #e6e6e6', paddingBottom: 6 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}
      </div>

      <div ref={scroller} onScroll={onScroll} onPointerDown={onPointerDown} className="no-bar"
        style={{ flex: 1, minHeight: 0, overflowY: 'auto', position: 'relative', margin: '-10px 0 0', touchAction: selecting ? 'none' : 'auto', userSelect: 'none' }}>
        {ALL.map(({ y, m }) => {
          const n = daysIn(y, m);
          const off = offsetOf(y, m);
          const logged = Array.from({ length: n }, (_, k) => codeOf(y, m, k + 1)).filter(Boolean).length;
          return (
            <section key={key(y, m)} ref={(el) => { sections.current[key(y, m)] = el; }} aria-label={`${MONTHS[m]} ${y}`} style={{ paddingTop: 12 }}>
              <h2 className="eyebrow" style={{ margin: '0 0 6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{MONTHS[m]} {y}</span>
                {!isFuture(y, m, 1) && <span className="muted" style={{ fontWeight: 500, letterSpacing: 0 }}>{logged}/{isCur(y, m) ? NOW.d : n} logged</span>}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', rowGap: 2 }}>
                {Array.from({ length: off }, (_, k) => <span key={`b${k}`} />)}
                {Array.from({ length: n }, (_, k) => {
                  const d = k + 1;
                  const o = ord(y, m, d);
                  const code = codeOf(y, m, d);
                  const sel = isSel(o);
                  // While selecting, show the symptoms being picked on the selected days.
                  const log = sel ? draft : code ? parseCode(code) : null;
                  const future = isFuture(y, m, d);
                  const col = (off + k) % 7;
                  const band = sel ? {
                    background: '#f0f0f0', borderTop: '2px solid #000', borderBottom: '2px solid #000',
                    ...(col === 0 || !isSel(o - 1) ? { borderLeft: '2px solid #000', borderTopLeftRadius: 14, borderBottomLeftRadius: 14 } : null),
                    ...(col === 6 || !isSel(o + 1) || d === n ? { borderRight: '2px solid #000', borderTopRightRadius: 14, borderBottomRightRadius: 14 } : null),
                  } : null;
                  return (
                    <button key={d} type="button" data-ord={o} onClick={() => openDay(y, m, d)}
                      aria-label={`${MONTHS[m]} ${d}, ${y}${sel ? ', selected' : ''}${log ? `: ${summary(log)}` : future ? ', upcoming' : ', not logged'}`}
                      style={{ borderTop: 0, borderBottom: 0, borderLeft: 0, borderRight: 0, padding: '2px 0', minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, color: '#000', background: 'transparent', opacity: selecting && future ? 0.4 : 1, ...band }}>
                      {log ? (
                        <Glyph size={34} r={CORES[log.f]} breakouts={log.b} itch={log.i > 0} travel={log.t} />
                      ) : (
                        <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
                          <circle cx="20" cy="20" r="11" fill="none" stroke={future ? '#d0d0d0' : '#000'} strokeWidth="0.8" strokeDasharray={future ? undefined : '1.6 1.6'} />
                        </svg>
                      )}
                      <span style={{ fontSize: 11, lineHeight: '13px', ...(o === TODAY ? { fontWeight: 700, textDecoration: 'underline' } : null) }}>{d}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        <div style={{ height: count ? 300 : 12 }} />
      </div>

      {selecting && count > 0 && (
        <div role="dialog" aria-label="Log the selected days" className="col"
          style={{ position: 'absolute', left: 16, right: 16, bottom: 16, zIndex: 5, border: '1.5px solid #000', borderRadius: 24, padding: 14, gap: 12, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
          <div className="row" style={{ gap: 12 }}>
            <Glyph size={44} r={CORES[draft.f]} breakouts={draft.b} itch={draft.i > 0} travel={draft.t} />
            <span className="col">
              <b style={{ fontSize: 16, lineHeight: '21px', fontWeight: 600 }}>{count === 1 ? short(lo!) : `${short(lo!)} – ${short(hi!)}`}</b>
              <span className="small muted">{count} {count === 1 ? 'day' : 'days'} · how did your skin feel?</span>
            </span>
          </div>
          <div role="radiogroup" aria-label="How your skin felt" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 6 }}>
            {FEELS.map((l, k) => (
              <button key={l} type="button" role="radio" aria-checked={feel === k} onClick={() => setFeel(k)}
                style={{ height: 56, padding: 0, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 12, fontWeight: 500, border: '1.5px solid #000', background: feel === k ? '#000' : '#fff', color: feel === k ? '#fff' : '#000' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r={CORES[k] * 0.9} fill={feel === k ? '#fff' : '#ff5a3d'} /></svg>
                {l}
              </button>
            ))}
          </div>
          <div className="wrap">
            {MARKS.map(([id, l, c]) => (
              <button key={id} type="button" aria-pressed={!!marks[id]} className={`chip${marks[id] ? ' on' : ''}`} style={{ height: 40, padding: '0 12px', fontSize: 13 }}
                onClick={() => setMarks((s) => ({ ...s, [id]: !s[id] }))}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: c }} />{l}
              </button>
            ))}
          </div>
          <button type="button" className="cta" style={{ height: 50, fontWeight: 600 }} onClick={apply}>
            Log {count} {count === 1 ? 'day' : 'days'}
          </button>
        </div>
      )}
      {toast && (
        <p className="fill-card" role="status" style={{ position: 'absolute', left: 24, right: 24, bottom: 108, zIndex: 5, margin: 0, textAlign: 'center', fontSize: 15, fontWeight: 500 }}>{toast}</p>
      )}

      <Nav active="calendar" />
    </main>
  );
}
