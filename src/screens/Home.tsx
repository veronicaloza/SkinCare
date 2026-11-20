import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { Bell, Camera, Check, Chevron } from '../components/Icons';
import { PHOTO } from '../components/ui';
import { COLORS, CORES, FEELS, parseCode, type DayCode } from '../glyph';
import { daysIn, MONTHS, NOW } from '../history';
import { itchOf, useCodeAt, useStore } from '../store';

const PINNED_FILTER = 'saturate(1.25) contrast(1.06) brightness(0.97)';
const WEEKDAY = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Logged days of a month up to `last`, parsed. */
function monthLogs(codeAt: ReturnType<typeof useCodeAt>, y: number, m: number, last: number) {
  const out: DayCode[] = [];
  for (let d = 1; d <= last; d++) { const c = codeAt(y, m, d); if (c) out.push(parseCode(c)); }
  return out;
}

export default function Home() {
  const { name, loggedAt, entry } = useStore();
  const codeAt = useCodeAt();
  const now = new Date();
  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).replace(/^(\w+)/, '$1,');
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const itch = itchOf(entry);

  // ---- Insights from the log history ----
  const week = Array.from({ length: 7 }, (_, k) => {
    const t = new Date(NOW.y, NOW.m, NOW.d - 6 + k);
    const c = codeAt(t.getFullYear(), t.getMonth(), t.getDate());
    return { d: t.getDate(), wd: WEEKDAY[t.getDay()], log: c ? parseCode(c) : null, today: k === 6 };
  });
  const weekLogged = week.filter((w) => w.log);
  const weekAvg = weekLogged.length ? Math.round(weekLogged.reduce((s, w) => s + w.log!.f, 0) / weekLogged.length) : 2;

  const thisMonth = monthLogs(codeAt, NOW.y, NOW.m, NOW.d);
  const prevY = NOW.m === 0 ? NOW.y - 1 : NOW.y, prevM = (NOW.m + 11) % 12;
  const lastMonth = monthLogs(codeAt, prevY, prevM, daysIn(prevY, prevM));
  const breakNow = thisMonth.filter((l) => l.b).length;
  const breakPrev = lastMonth.filter((l) => l.b).length;
  const itchDays = thisMonth.filter((l) => l.i > 0).length;
  const goodDays = thisMonth.filter((l) => l.f <= 1).length;

  let streak = 0;
  for (let k = loggedAt ? 0 : 1; ; k++) {
    const t = new Date(NOW.y, NOW.m, NOW.d - k);
    if (!codeAt(t.getFullYear(), t.getMonth(), t.getDate())) break;
    streak++;
  }

  return (
    <main className="screen tabbed" style={{ gap: 14 }}>
      <div className="row" style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div className="col" style={{ gap: 2 }}>
          <h1 className="h-hello">Hey {name},</h1>
          <p className="small muted" style={{ margin: 0 }}>{date} · {loggedAt ? 'today is logged' : time}</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <Link to="/reminders" className="iconbtn" aria-label="Reminders"><Bell /></Link>
          <Link to="/learn" className="iconbtn info" aria-label="Learn how Clearday works">i</Link>
        </div>
      </div>

      <div className="no-bar" style={{ flex: 1, minHeight: 0, overflowY: 'auto', margin: '0 -24px', padding: '0 24px 8px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {loggedAt ? (
          <Link to="/day" style={{ position: 'relative', display: 'block', height: 220, borderRadius: 28, overflow: 'hidden', textDecoration: 'none', color: '#fff', flexShrink: 0 }}>
            <img src={PHOTO} alt="Today’s morning photo" className="photo" style={{ objectPosition: 'center 35%' }} />
            <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)' }} />
            <span className="badge light" style={{ position: 'absolute', left: 16, top: 16, gap: 6, padding: '0 12px' }}>
              <Check size={14} /> Logged {loggedAt}
            </span>
            <span style={{ position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span className="col">
                <span style={{ fontSize: 22, lineHeight: '26px', fontWeight: 500 }}>Today</span>
                <span style={{ fontSize: 13, lineHeight: '18px' }}>{FEELS[entry.feel]} skin{itch ? ` · itch ${itch}/5` : ''} · tap for details</span>
              </span>
              <Glyph size={56} disc feel={entry.feel} breakouts={entry.marks.spots} itch={entry.marks.itch} />
            </span>
          </Link>
        ) : (
          <Link to="/camera" style={{ position: 'relative', height: 200, borderRadius: 28, background: '#000', color: '#fff', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20, overflow: 'hidden', flexShrink: 0 }}>
            <Glyph size={210} feel={3} breakouts itch travel style={{ position: 'absolute', right: -40, top: -30, opacity: 0.35 }} />
            <span style={{ position: 'relative', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px', borderRadius: 999, background: 'rgba(255,255,255,0.16)', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}>
              MORNING PHOTO · NOT TAKEN YET
            </span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 26, lineHeight: '30px', fontWeight: 500, letterSpacing: '-0.01em' }}>Start with a photo</span>
              <span style={{ width: 60, height: 60, borderRadius: 999, background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Camera />
              </span>
            </div>
          </Link>
        )}

        {/* This week */}
        <Section title="This week" more={{ to: '/calendar', label: 'Calendar' }}>
          <Link to="/calendar" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', textDecoration: 'none', color: '#000', background: '#f0f0f0', borderRadius: 20, padding: '12px 6px 10px' }}
            aria-label={`This week: ${weekLogged.length} of 7 days logged`}>
            {week.map((w) => (
              <span key={w.d} className="col" style={{ alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, lineHeight: '14px', color: '#5c5c5c', fontWeight: w.today ? 700 : 500 }}>{w.wd}</span>
                {w.log ? (
                  <Glyph size={36} r={CORES[w.log.f]} breakouts={w.log.b} itch={w.log.i > 0} travel={w.log.t} />
                ) : (
                  <svg width="36" height="36" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="11" fill="none" stroke="#000" strokeWidth="0.8" strokeDasharray="1.6 1.6" /></svg>
                )}
                <span style={{ fontSize: 11, lineHeight: '13px', fontWeight: w.today ? 700 : 400, textDecoration: w.today ? 'underline' : undefined }}>{w.d}</span>
              </span>
            ))}
          </Link>
          <p style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>
            <b style={{ fontWeight: 600 }}>{weekLogged.length} of 7 days logged</b>, skin mostly <b style={{ fontWeight: 600 }}>{FEELS[weekAvg].toLowerCase()}</b>.
            {streak > 1 && <> You’re on a <b style={{ fontWeight: 600 }}>{streak}-day streak</b>.</>}
          </p>
        </Section>

        {/* Month so far */}
        <Section title={`${MONTHS[NOW.m]} so far`}>
          <div className="grid2" style={{ gap: 8 }}>
            <Stat value={`${thisMonth.length}/${NOW.d}`} label="days logged" />
            <Stat value={String(goodDays)} label="great or good days" dot={<Dot r={CORES[1]} />} />
            <Stat value={String(breakNow)} label={`breakout days · ${breakPrev} in ${MONTHS[prevM].slice(0, 3)}`} dot={<Ring color={COLORS.break} />} />
            <Stat value={String(itchDays)} label="itchy or dry days" dot={<Ring color={COLORS.itch} dash="2.6 1.8" />} />
          </div>
        </Section>

        {/* Patterns */}
        <Section title="Patterns from your logs" more={{ to: '/key', label: 'Skin key' }}>
          <Insight to="/compare" tag="PRODUCT · DAY 22 OF 28" title="Your new cleanser is helping"
            body={<>Fewer breakout days since you switched: <b style={{ fontWeight: 600 }}>2 in 3 weeks</b>, down from 7.</>}
            viz={<Progress value={22} max={28} />} />
          <Insight to="/travel" tag="TRAVEL" title="Flights make you itchy"
            body="Dry places and flights over 3 hours made you itchy within 2 days. Pack the barrier cream."
            viz={<Ring color={COLORS.travel} dash="0.01 3.2" size={40} w={2.4} />} />
          <Insight to="/food" tag="FOOD" title="Dairy shows up before breakouts"
            body="On days after you had dairy, new spots showed up more often. Try a week without it to check."
            viz={<Ring color={COLORS.break} size={40} w={2} />} />
          <Insight to="/learn" tag="BEST DAY · 4 NOV" title="What your best day had in common"
            body="You slept 8 hours and skipped dairy the day before."
            viz={<Dot r={CORES[0] + 1.5} size={40} />} />
        </Section>

        {/* Comparison */}
        <Section title="Today vs. a day you picked" more={{ to: '/compare', label: 'Compare' }}>
          <div className="grid2">
            <PhotoTile to={loggedAt ? '/day' : '/camera'} title="Today" sub={loggedAt ? `${FEELS[entry.feel]} skin` : 'Not taken yet'} dim={!loggedAt} />
            <PhotoTile to="/compare" title="Fri 30 Oct" sub="Before new cleanser" filter={PINNED_FILTER} />
          </div>
        </Section>

        <p className="foot" style={{ fontSize: 12, lineHeight: '16px' }}>Clearday spots patterns. It doesn’t diagnose.</p>
      </div>

      <Nav active="home" />
    </main>
  );
}

function Section({ title, more, children }: { title: string; more?: { to: string; label: string }; children: ReactNode }) {
  return (
    <section className="col" style={{ gap: 10, flexShrink: 0 }}>
      <div className="row" style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 className="eyebrow">{title}</h2>
        {more && <Link to={more.to} style={{ fontSize: 13, lineHeight: '18px', fontWeight: 500 }}>{more.label}</Link>}
      </div>
      {children}
    </section>
  );
}

function Stat({ value, label, dot }: { value: string; label: string; dot?: ReactNode }) {
  return (
    <div className="col" style={{ border: '1.5px solid #000', borderRadius: 18, padding: '12px 14px', gap: 2 }}>
      <span className="row" style={{ gap: 8, justifyContent: 'space-between' }}>
        <span style={{ fontSize: 26, lineHeight: '30px', fontWeight: 500, letterSpacing: '-0.01em' }}>{value}</span>
        {dot}
      </span>
      <span style={{ fontSize: 12, lineHeight: '16px', color: '#5c5c5c' }}>{label}</span>
    </div>
  );
}

function Insight({ to, tag, title, body, viz }: { to: string; tag: string; title: string; body: ReactNode; viz: ReactNode }) {
  return (
    <Link to={to} className="row" style={{ gap: 14, alignItems: 'flex-start', textDecoration: 'none', color: '#000', background: '#f0f0f0', borderRadius: 20, padding: 14 }}>
      <span style={{ width: 44, height: 44, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{viz}</span>
      <span className="col" style={{ flex: 1, gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: 11, lineHeight: '14px', fontWeight: 600, letterSpacing: '0.06em', color: '#5c5c5c' }}>{tag}</span>
        <span style={{ fontSize: 16, lineHeight: '21px', fontWeight: 600 }}>{title}</span>
        <span style={{ fontSize: 14, lineHeight: '20px' }}>{body}</span>
      </span>
      <Chevron size={16} style={{ marginTop: 14, flexShrink: 0 }} />
    </Link>
  );
}

function PhotoTile({ to, title, sub, filter, dim }: { to: string; title: string; sub: string; filter?: string; dim?: boolean }) {
  return (
    <Link to={to} className="col" style={{ gap: 8, textDecoration: 'none', color: '#000' }}>
      <span style={{ display: 'block', aspectRatio: '1 / 1', borderRadius: 18, overflow: 'hidden', background: '#e6e6e6' }}>
        <img src={PHOTO} alt={title} className="photo" style={{ filter, opacity: dim ? 0.45 : 1 }} />
      </span>
      <span className="col">
        <span style={{ fontSize: 14, lineHeight: '18px', fontWeight: 600 }}>{title}</span>
        <span style={{ fontSize: 12, lineHeight: '16px', color: '#5c5c5c' }}>{sub}</span>
      </span>
    </Link>
  );
}

const Dot = ({ r, size = 24 }: { r: number; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r={r * 0.75} fill={COLORS.core} /></svg>
);
const Ring = ({ color, dash, size = 24, w = 1.8 }: { color: string; dash?: string; size?: number; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke={color} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" /></svg>
);
const Progress = ({ value, max }: { value: number; max: number }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" role="img" aria-label={`Day ${value} of ${max}`}>
    <circle cx="20" cy="20" r="15" fill="none" stroke="#e6e6e6" strokeWidth="4" />
    <circle cx="20" cy="20" r="15" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round"
      strokeDasharray={`${(value / max) * 94.25} 94.25`} transform="rotate(-90 20 20)" />
  </svg>
);
