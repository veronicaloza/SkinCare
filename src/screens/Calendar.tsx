import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { Back, Chevron } from '../components/Icons';
import { CORES, FEELS, parseCode, summary } from '../glyph';
import { useStore } from '../store';

/** Hand-written demo month (Nov 2026, the current month). */
const NOV: Record<number, string> = {
  1: '2110', 2: '1000', 3: '1000', 4: '0000', 5: '1100', 6: '2100', 7: '3131', 8: '2120', 9: '1000', 10: '1001', 11: '2000',
  16: '3021', 17: '2020', 18: '3030',
};
const YEARS = [2024, 2025, 2026];
const NOW = { y: 2026, m: 10, d: 19 };
const SOURCE = 11;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Deterministic demo history for every other past month. */
function demoCode(y: number, m: number, d: number): string | null {
  let h = (y * 372 + m * 31 + d) * 2654435761;
  const rnd = () => { h = (h ^ (h >>> 15)) * 2246822519; h >>>= 0; return (h % 1000) / 1000; };
  if (rnd() < 0.18) return null; // missed day
  const f = Math.min(4, Math.floor(rnd() * rnd() * 5 + (m === 0 || m === 1 ? 1 : 0)));
  const b = rnd() < 0.22 ? 1 : 0;
  const i = rnd() < 0.3 ? 1 + Math.floor(rnd() * 4) : 0;
  const t = rnd() < 0.08 ? 1 : 0;
  return `${f}${b}${i}${t}`;
}

const cmp = (y: number, m: number) => y * 12 + m;

export default function Calendar() {
  const { loggedAt, entry } = useStore();
  const navigate = useNavigate();
  const [year, setYear] = useState(NOW.y);
  const [month, setMonth] = useState(NOW.m);
  const [drag, setDrag] = useState(false);
  const [from, setFrom] = useState(12);
  const [to, setTo] = useState(15);
  const [filled, setFilled] = useState<number[]>([]);
  const [justApplied, setJustApplied] = useState(0);

  const isCurrent = year === NOW.y && month === NOW.m;
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const isFuture = (d: number) => cmp(year, month) > cmp(NOW.y, NOW.m) || (isCurrent && d > NOW.d);
  const isToday = (d: number) => isCurrent && d === NOW.d;

  const codeOf = (d: number): string | null => {
    if (isFuture(d)) return null;
    if (!isCurrent) return demoCode(year, month, d);
    if (d === NOW.d) return loggedAt ? `${entry.feel}${entry.marks.spots ? 1 : 0}${entry.marks.itch ? 2 : 0}0` : null;
    if (filled.includes(d)) return NOV[SOURCE];
    return NOV[d] ?? null;
  };
  const isOpen = (d: number) => isCurrent && !codeOf(d) && d < NOW.d;

  const goTo = (y: number, m: number) => {
    const c = Math.max(cmp(YEARS[0], 0), Math.min(cmp(YEARS[YEARS.length - 1], 11), cmp(y, m)));
    setYear(Math.floor(c / 12));
    setMonth(c % 12);
    setDrag(false);
    setJustApplied(0);
  };
  const atStart = cmp(year, month) <= cmp(YEARS[0], 0);
  const atEnd = cmp(year, month) >= cmp(YEARS[YEARS.length - 1], 11);

  const pick = (d: number) => {
    const code = codeOf(d);
    if (!drag) {
      if (code || isToday(d)) navigate(isToday(d) && !code ? '/camera' : '/day');
      return;
    }
    if (!isOpen(d)) return;
    setJustApplied(0);
    if (d < from) setFrom(d);
    else if (d > to) setTo(d);
    else if (d - from < to - d) setFrom(d);
    else setTo(d);
  };

  const range = Array.from({ length: to - from + 1 }, (_, k) => from + k).filter(isOpen);
  const apply = () => {
    setFilled((f) => [...f, ...range]);
    setJustApplied(range.length);
    setDrag(false);
  };
  const srcLog = parseCode(NOV[SOURCE]);
  const logged = Array.from({ length: days }, (_, k) => codeOf(k + 1)).filter(Boolean).length;

  return (
    <main className="screen tabbed" style={{ padding: '56px 24px 20px', gap: 10 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
        <div className="row" style={{ gap: 4, minWidth: 0 }}>
          <button type="button" className="iconbtn" style={{ border: 0, width: 36, opacity: atStart ? 0.3 : 1 }} aria-label="Previous month" disabled={atStart} onClick={() => goTo(year, month - 1)}><Back /></button>
          <h1 className="h-title" style={{ fontSize: 24, whiteSpace: 'nowrap' }} aria-live="polite">{MONTHS[month]}</h1>
          <button type="button" className="iconbtn" style={{ border: 0, width: 36, opacity: atEnd ? 0.3 : 1 }} aria-label="Next month" disabled={atEnd} onClick={() => goTo(year, month + 1)}><Chevron /></button>
        </div>
        {isCurrent ? (
          <button type="button" aria-pressed={drag} className={`chip bold${drag ? ' on' : ''}`} style={{ flexShrink: 0 }} onClick={() => { setDrag((v) => !v); setJustApplied(0); }}>
            {drag ? 'Done' : 'Log the same'}
          </button>
        ) : (
          <button type="button" className="chip bold" style={{ flexShrink: 0 }} onClick={() => goTo(NOW.y, NOW.m)}>Today</button>
        )}
      </div>

      <div role="radiogroup" aria-label="Year" className="row" style={{ gap: 6 }}>
        {YEARS.map((y) => (
          <button key={y} type="button" role="radio" aria-checked={year === y} className={`chip sm${year === y ? ' on' : ''}`} style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => goTo(y, y === NOW.y ? Math.min(month, NOW.m) : month)}>{y}</button>
        ))}
      </div>

      <p className="small muted" style={{ margin: 0, minHeight: 36 }}>
        {drag ? 'Wed 11 is copied across the days that felt the same. Tap days to adjust.'
          : isCurrent ? 'Felt the same for a while? Use “Log the same” to fill several days at once.'
          : isFuture(1) ? 'Nothing logged yet.'
          : `${logged} of ${days} days logged in ${MONTHS[month]} ${year}. Tap a day to open it.`}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 2, fontSize: 11, lineHeight: '14px', color: '#5c5c5c', textAlign: 'center' }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', rowGap: 2 }}>
        {Array.from({ length: offset }, (_, k) => <span key={`b${k}`} />)}
        {Array.from({ length: days }, (_, k) => {
          const d = k + 1;
          const code = codeOf(d);
          const log = code ? parseCode(code) : null;
          const future = isFuture(d);
          const sel = drag && d >= from && d <= to && isOpen(d);
          const selStyle = sel ? {
            background: '#f0f0f0', borderTop: '2px solid #000', borderBottom: '2px solid #000',
            ...(d === from || !isOpen(d - 1) ? { borderLeft: '2px solid #000', borderTopLeftRadius: 14, borderBottomLeftRadius: 14 } : null),
            ...(d === to || !isOpen(d + 1) ? { borderRight: '2px solid #000', borderTopRightRadius: 14, borderBottomRightRadius: 14 } : null),
          } : d === SOURCE && drag ? { background: '#000', color: '#fff', borderRadius: 14 } : null;
          return (
            <button key={d} type="button" onClick={() => pick(d)}
              aria-label={`${MONTHS[month]} ${d}, ${year}${log ? `: ${summary(log)}` : future ? ', upcoming' : ', not logged'}`}
              style={{ borderTop: 0, borderBottom: 0, borderLeft: 0, borderRight: 0, padding: '2px 0', minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, color: '#000', background: 'transparent', ...selStyle }}>
              {log ? (
                <Glyph size={34} r={CORES[log.f]} breakouts={log.b} itch={log.i > 0} travel={log.t} />
              ) : (
                <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
                  <circle cx="20" cy="20" r="11" fill="none" stroke={future ? '#d0d0d0' : '#000'} strokeWidth="0.8" strokeDasharray={future ? undefined : '1.6 1.6'} />
                </svg>
              )}
              <span style={{ fontSize: 11, lineHeight: '13px', ...(isToday(d) ? { fontWeight: 700, textDecoration: 'underline' } : null) }}>{d}</span>
            </button>
          );
        })}
      </div>

      {drag && (
        <div role="dialog" aria-label="Log the same" className="col" style={{ border: '1.5px solid #000', borderRadius: 22, padding: 14, gap: 10, background: '#fff' }}>
          <div className="row" style={{ gap: 12 }}>
            <Glyph size={44} r={CORES[srcLog.f]} breakouts={srcLog.b} itch={srcLog.i > 0} travel={srcLog.t} />
            <span style={{ fontSize: 15, lineHeight: '21px' }}>
              <b style={{ fontWeight: 600 }}>Log Nov {from}–{to} the same as Wed 11?</b><br />
              <span style={{ color: '#5c5c5c' }}>{FEELS[srcLog.f]} skin, nothing new. You can edit any day later.</span>
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
        <p className="fill-card" style={{ margin: 0, textAlign: 'center', fontSize: 15, fontWeight: 500 }}>Logged {justApplied} days ✓</p>
      )}

      <div className="spacer" />
      <Nav active="calendar" />
    </main>
  );
}
