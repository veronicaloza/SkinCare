import { Link } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { Bell, Camera, Check } from '../components/Icons';
import { PHOTO } from '../components/ui';
import { FEELS } from '../glyph';
import { itchOf, useStore } from '../store';

const PINNED_FILTER = 'saturate(1.25) contrast(1.06) brightness(0.97)';

export default function Home() {
  const { name, loggedAt, entry } = useStore();
  const now = new Date();
  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).replace(/^(\w+)/, '$1,');
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const itch = itchOf(entry);

  return (
    <main className="screen tabbed">
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

      {loggedAt ? (
        <Link to="/day" style={{ position: 'relative', display: 'block', height: 236, borderRadius: 28, overflow: 'hidden', textDecoration: 'none', color: '#fff', flexShrink: 0 }}>
          <img src={PHOTO} alt="Today’s morning photo" className="photo" style={{ objectPosition: 'center 35%' }} />
          <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)' }} />
          <span className="badge light" style={{ position: 'absolute', left: 16, top: 16, gap: 6, padding: '0 12px' }}>
            <Check size={14} /> Logged {loggedAt}
          </span>
          <span style={{ position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <span className="col">
              <span style={{ fontSize: 22, lineHeight: '26px', fontWeight: 500 }}>Today</span>
              <span style={{ fontSize: 13, lineHeight: '18px' }}>{FEELS[entry.feel]} skin{itch ? ` · itch ${itch}/5` : ''} · tap for insights</span>
            </span>
            <Glyph size={56} disc feel={entry.feel} breakouts={entry.marks.spots} itch={entry.marks.itch} />
          </span>
        </Link>
      ) : (
        <Link to="/camera" style={{ position: 'relative', height: 236, borderRadius: 28, background: '#000', color: '#fff', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20, overflow: 'hidden', flexShrink: 0 }}>
          <Glyph size={210} feel={3} breakouts itch travel style={{ position: 'absolute', right: -40, top: -30, opacity: 0.35 }} />
          <span style={{ position: 'relative', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px', borderRadius: 999, background: 'rgba(255,255,255,0.16)', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}>
            MORNING PHOTO · NOT TAKEN YET
          </span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div className="col" style={{ gap: 6 }}>
              <span style={{ fontSize: 26, lineHeight: '30px', fontWeight: 500, letterSpacing: '-0.01em' }}>Start with a photo</span>
              <span style={{ fontSize: 14, lineHeight: '20px', color: '#d6d6d6' }}>Then a few taps about your skin. About 40 seconds.</span>
            </div>
            <span style={{ width: 60, height: 60, borderRadius: 999, background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Camera />
            </span>
          </div>
        </Link>
      )}

      <section className="col" style={{ gap: 10 }}>
        <div className="row" style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 className="eyebrow">{loggedAt ? 'Today vs. a day you picked' : 'Two days side by side'}</h2>
          <Link to="/compare" style={{ fontSize: 13, lineHeight: '18px', fontWeight: 500 }}>{loggedAt ? 'Compare' : 'Change days'}</Link>
        </div>
        <div className="grid2">
          {loggedAt ? (
            <DayTile to="/day" alt="Today" title="Today" />
          ) : (
            <DayTile to="/day" alt="Photo from Wednesday 18 November" title="Yesterday" sub="Wed 18 · Meh, itch 3/5" filter="saturate(0.95) brightness(1.03)"
              glyph={<Glyph size={44} disc feel={3} itch />} />
          )}
          <DayTile to="/compare" alt="Photo from Friday 30 October" title="Fri 30 Oct" sub={loggedAt ? undefined : 'Pinned · Rough, breakouts'}
            inlineSub={loggedAt ? '· before new cleanser' : undefined} filter={PINNED_FILTER} tag={loggedAt ? undefined : 'Before new cleanser'}
            glyph={loggedAt ? undefined : <Glyph size={44} disc feel={4} breakouts itch travel />} />
        </div>
        {loggedAt && (
          <p className="fill-card" style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>
            Fewer breakout days since you switched cleansers: <b style={{ fontWeight: 600 }}>2 in 3 weeks</b>, down from 7.
          </p>
        )}
      </section>

      <div className="spacer" />
      <Nav active="home" />
    </main>
  );
}

function DayTile({ to, alt, title, sub, inlineSub, filter, tag, glyph }: {
  to: string; alt: string; title: string; sub?: string; inlineSub?: string; filter?: string; tag?: string; glyph?: React.ReactNode;
}) {
  return (
    <Link to={to} className="col" style={{ gap: 8, textDecoration: 'none', color: '#000' }}>
      <span style={{ position: 'relative', display: 'block', aspectRatio: '1 / 1', borderRadius: 18, overflow: 'hidden', background: '#e6e6e6' }}>
        <img src={PHOTO} alt={alt} className="photo" style={{ filter }} />
        {tag && <span className="badge" style={{ position: 'absolute', left: 8, top: 8, height: 24, padding: '0 8px', fontSize: 11 }}>{tag}</span>}
        {glyph && <span style={{ position: 'absolute', right: 8, bottom: 8 }}>{glyph}</span>}
      </span>
      <span className="col">
        <span style={{ fontSize: 14, lineHeight: '18px', fontWeight: 600 }}>
          {title}{inlineSub && <span style={{ fontWeight: 400, color: '#5c5c5c' }}> {inlineSub}</span>}
        </span>
        {sub && <span style={{ fontSize: 12, lineHeight: '16px', color: '#5c5c5c' }}>{sub}</span>}
      </span>
    </Link>
  );
}
