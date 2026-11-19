import { Link } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { IconCalendar, IconPencil, IconPlus } from '../components/Icons';
import { THIS_WEEK, USER_NAME } from '../data';
import { describe, parseCode, summary } from '../glyph';
import { useStore } from '../store';

const CONDENSED = "'Archivo Narrow', 'Inter Tight', 'Helvetica Neue', Arial, sans-serif";

/** B1 · Home */
export default function Home() {
  const { today } = useStore();

  const week = [
    ...THIS_WEEK.map((d) => ({ label: d.label, log: d.code === 'x' ? null : parseCode(d.code), state: d.code === 'x' ? 'missed' as const : 'logged' as const, isToday: false })),
    { label: 'S', log: today, state: today ? 'logged' as const : 'today' as const, isToday: true },
  ];

  return (
    <main className="screen" style={{ padding: '56px 24px 32px', fontFamily: CONDENSED }}>
      <header style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'start' }}>
        <span />
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h1 style={{ margin: 0, fontSize: 38, lineHeight: '44px', fontWeight: 500, letterSpacing: '-0.01em' }}>Hey {USER_NAME},</h1>
          <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: '20px' }}>It’s 8th, Nov, 2026</p>
        </div>
        <Link to="/journal" aria-label="Open journal" style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
          <IconCalendar size={28} strokeWidth={1.7} />
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
        {today ? (
          <Glyph size={176} log={today} label={`Today’s glyph: ${describe(today)}`} />
        ) : (
          <svg width="176" height="176" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="19.2" fill="none" stroke="#000" strokeWidth="0.4" strokeLinecap="round" strokeDasharray="0.01 0.75" />
            <circle cx="20" cy="20" r="7" fill="#000" />
          </svg>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 38, lineHeight: '44px', fontWeight: 400, letterSpacing: '-0.01em' }}>
            {today ? 'Today is logged.' : 'How is your skin doing?'}
          </h2>
          {today ? (
            <>
              <p className="muted" style={{ margin: 0, fontSize: 15 }}>{summary(today)}</p>
              <Link to="/log/review" className="circle-btn solid" aria-label="Edit today’s log" style={{ width: 38, height: 38, border: 0 }}>
                <IconPencil size={16} />
              </Link>
            </>
          ) : (
            <Link to="/log/1" className="circle-btn solid" aria-label="Start today’s log" style={{ width: 38, height: 38, border: 0 }}>
              <IconPlus size={18} strokeWidth={1.8} />
            </Link>
          )}
        </div>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 6, borderBottom: '1.5px solid #000' }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: '18px' }}>THIS WEEK</p>
          <Link to="/key" style={{ fontSize: 13, lineHeight: '18px' }}>How to read this</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', paddingTop: 12 }}>
          {week.map((d, k) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Glyph size={30} log={d.log} state={d.state} />
              <span style={{ fontSize: 12, lineHeight: '16px', fontFamily: 'var(--font)', ...(d.isToday ? { fontWeight: 600 } : {}) }}>{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      <Nav active="home" />
    </main>
  );
}
