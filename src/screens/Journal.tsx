import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { FIRST_YEAR, LAST_YEAR, MONTHS, TODAY } from '../data';
import { COLORS, describe, parseCode, type DayState, type SkinLog } from '../glyph';
import { useStore } from '../store';

/** Stand-in selfie for every logged day until real photos exist. */
const PLACEHOLDER_PHOTO = `${import.meta.env.BASE_URL}placeholder-face.webp`;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface Cell { day: number; state: DayState; log: SkinLog | null }

function Legend() {
  const item = (icon: React.ReactNode, text: string) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{icon}{text}</span>
  );
  return (
    <div style={{ padding: '12px 24px 16px', display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 12, lineHeight: '16px', borderTop: '1px solid var(--line)' }}>
      {item(<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="3.5" fill={COLORS.core} /></svg>, 'Centre = feel')}
      {item(<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" fill="none" stroke={COLORS.break} strokeWidth="1.5" /></svg>, 'Breakouts')}
      {item(<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" fill="none" stroke={COLORS.itch} strokeWidth="1.5" strokeDasharray="2 1.4" /></svg>, 'Itch')}
      {item(<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" fill="none" stroke={COLORS.travel} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.01 2.4" /></svg>, 'Travel')}
      <Link to="/key" style={{ marginLeft: 'auto' }}>Full key</Link>
    </div>
  );
}

/** B3 · Journal, as glyphs or photos */
export default function Journal() {
  const { today } = useStore();
  const [glyphs, setGlyphs] = useState(true);
  const [activeYear, setActiveYear] = useState(TODAY.year);
  const scrollRef = useRef<HTMLDivElement>(null);

  const months = useMemo(() => MONTHS.map((m) => {
    const isThisMonth = m.year === TODAY.year && m.month === TODAY.month;
    const after = m.year > TODAY.year || (m.year === TODAY.year && m.month > TODAY.month);
    const cells: Cell[] = [];
    for (let d = 1; d <= m.days; d++) {
      const code = m.codes[d - 1];
      let state: DayState = 'logged';
      let log: SkinLog | null = null;
      if (isThisMonth && d === TODAY.day) {
        state = today ? 'logged' : 'today';
        log = today;
      } else if (after || (isThisMonth && d > TODAY.day)) state = 'future';
      else if (!code || code === 'x') state = 'missed';
      else log = parseCode(code);
      cells.push({ day: d, state, log });
    }
    return { ...m, cells, todayDay: isThisMonth ? TODAY.day : undefined };
  }), [today]);

  const years = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, k) => FIRST_YEAR + k);

  // Open on the current month.
  useEffect(() => {
    const el = document.getElementById(`m-${TODAY.year}-${TODAY.month}`);
    const box = scrollRef.current;
    if (el && box) box.scrollTop = el.offsetTop - box.offsetTop - 8;
  }, []);

  const jumpTo = (y: number) => {
    const el = document.getElementById(`y-${y}`);
    const box = scrollRef.current;
    if (el && box) box.scrollTo({ top: el.offsetTop - box.offsetTop, behavior: 'smooth' });
    setActiveYear(y);
  };

  const onScroll = () => {
    const box = scrollRef.current;
    if (!box) return;
    let current = years[0];
    for (const y of years) {
      const el = document.getElementById(`y-${y}`);
      if (el && el.offsetTop - box.offsetTop <= box.scrollTop + 40) current = y;
    }
    if (current !== activeYear) setActiveYear(current);
  };

  return (
    <main className="screen" style={{ padding: '60px 0 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 12px' }}>
        <h1 className="h-title">{glyphs ? 'Skin Journal' : 'Photo Journal'}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="muted" style={{ fontSize: 12 }}>Photos</span>
          <button
            type="button" role="switch" aria-checked={glyphs} aria-label="Show glyphs instead of photos"
            onClick={() => setGlyphs((g) => !g)}
            style={{ width: 50, height: 28, borderRadius: 999, padding: 3, display: 'flex', border: '1.5px solid #000', background: glyphs ? '#000' : '#fff', justifyContent: glyphs ? 'flex-end' : 'flex-start' }}
          >
            <span style={{ width: 19, height: 19, borderRadius: 999, background: glyphs ? '#fff' : '#000' }} />
          </button>
          <span className="muted" style={{ fontSize: 12 }}>Glyphs</span>
        </div>
      </div>

      <div role="tablist" aria-label="Jump to year" style={{ display: 'flex', gap: 6, padding: '0 24px 12px' }}>
        {years.map((y) => (
          <button
            key={y} type="button" role="tab" aria-selected={activeYear === y} onClick={() => jumpTo(y)}
            style={{ height: 32, padding: '0 14px', borderRadius: 999, border: '1.5px solid #000', fontSize: 13, fontWeight: 500, background: activeYear === y ? '#000' : '#fff', color: activeYear === y ? '#fff' : '#000' }}
          >{y}</button>
        ))}
      </div>

      <div ref={scrollRef} onScroll={onScroll} className="scroll" style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {months.map((m) => (
          <section key={`${m.year}-${m.month}`} id={`m-${m.year}-${m.month}`} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {m.month === 0 && (
              <div id={`y-${m.year}`} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: m.year === FIRST_YEAR ? 0 : 12 }}>
                <h2 style={{ margin: 0, fontSize: 28, lineHeight: '34px', fontWeight: 500, letterSpacing: '-0.02em' }}>{m.year}</h2>
                <span style={{ flex: 1, height: 1, background: '#000' }} />
              </div>
            )}
            <h3 style={{ margin: 0, fontSize: 17, lineHeight: '24px', fontWeight: 500, textAlign: 'center' }}>{m.name} {m.year}</h3>
            <div className="muted" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 2, fontSize: 11, lineHeight: '14px', textAlign: 'center' }}>
              {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', rowGap: 4, columnGap: 2 }}>
              {Array.from({ length: m.offset }, (_, k) => <span key={`pad${k}`} />)}
              {m.cells.map((c) => {
                const isToday = m.todayDay === c.day;
                const aria = `${m.name} ${c.day} ${m.year}: ${c.log ? describe(c.log) : isToday ? 'today, not logged yet' : c.state === 'future' ? 'upcoming' : 'no log'}`;
                const to = isToday ? (today ? '/log/review' : '/checkin') : c.log ? '/day' : null;
                const inner = (
                  <>
                    {!glyphs && c.log ? (
                      <img
                        src={PLACEHOLDER_PHOTO} alt="" width={37} height={37} loading="lazy"
                        style={{ width: 37, height: 37, margin: 1.5, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 30%', display: 'block' }}
                      />
                    ) : (
                      <Glyph
                        size={40}
                        log={glyphs ? c.log : null}
                        state={c.state}
                        futureColor="#d0d0d0"
                      />
                    )}
                    <span style={{ fontSize: 10, lineHeight: '12px', ...(isToday ? { fontWeight: 600, color: '#fff', background: '#000', borderRadius: 999, padding: '0 5px' } : { color: 'var(--muted)' }) }}>{c.day}</span>
                  </>
                );
                const style = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 1, textDecoration: 'none', color: '#000' };
                return to ? (
                  <Link key={c.day} to={to} aria-label={aria} style={style}>{inner}</Link>
                ) : (
                  <div key={c.day} aria-label={aria} role="img" style={style}>{inner}</div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <Legend />
      <div style={{ padding: '0 24px' }}><Nav active="journal" /></div>
    </main>
  );
}
