import Glyph from './Glyph';
import { parseCode, type SkinLog } from '../glyph';

export interface Pattern {
  title: string;
  body: string;
  strength: 'strong' | 'developing';
  days: { code: string; caption?: string }[];
  tip: string;
  /** Does this pattern explain something in a given day's log? */
  matches?: (log: SkinLog) => boolean;
}

export type Range = 'week' | 'month' | 'half' | 'year';

export const RANGES: { id: Range; label: string }[] = [
  { id: 'week', label: 'Last week' },
  { id: 'month', label: 'Last 30 days' },
  { id: 'half', label: 'Last 6 months' },
  { id: 'year', label: 'Last year' },
];

/** Glyphs shown on the black hero card for each range. */
export const HERO_GLYPHS: Record<Range, string[]> = {
  week: ['2041', '2030', '1010'],
  month: ['1001', '1101', '1031'],
  half: ['3131', '2100', '1000'],
  year: ['4141', '2110', '0000'],
};

export const PATTERNS: Pattern[] = [
  {
    title: 'Travel is followed by more itching',
    body: 'On both recent trips, your itch level rose within 2 days of flying. Your average moved from 1/5 to 4/5.',
    strength: 'strong',
    days: [{ code: '3001' }, { code: '1100' }, { code: '1030' }, { code: '2041' }, { code: '2140' }, { code: '2030' }],
    tip: 'Try packing a heavier moisturiser for travel days.',
    matches: (log) => log.t || log.i >= 2,
  },
  {
    title: 'Breakouts appear after shorter nights',
    body: 'New breakouts appeared on 3 of the 4 mornings after you slept fewer than 7 hours.',
    strength: 'developing',
    days: [
      { code: '2100', caption: '6h' }, { code: '1000', caption: '8h' }, { code: '2100', caption: '5h' },
      { code: '1000', caption: '7h' }, { code: '2110', caption: '6h' }, { code: '1000', caption: '6h' },
    ],
    tip: 'Aim for 7 hours or more before days that matter.',
    matches: (log) => log.b,
  },
];

const TRAVEL = PATTERNS[0];
const SLEEP = PATTERNS[1];

/** Sample insights for each time range (30 days = PATTERNS). */
export const PATTERNS_BY_RANGE: Record<Range, Pattern[]> = {
  week: [
    {
      title: 'Itch eased once you got home',
      body: 'Your itch dropped from 4/5 to 1/5 over the three days after your last trip.',
      strength: 'developing',
      days: [{ code: '2041' }, { code: '2030' }, { code: '2020' }, { code: '1010' }, { code: '1010' }, { code: '1000' }],
      tip: 'Keep the heavier moisturiser going for a few days after flying.',
    },
  ],
  month: PATTERNS,
  half: [
    { ...TRAVEL, body: 'On 5 of your 6 trips, your itch level rose within 2 days of flying.' },
    {
      ...SLEEP,
      strength: 'strong',
      body: 'New breakouts appeared on 11 of the 15 mornings after you slept fewer than 7 hours.',
    },
    {
      title: 'Rougher days pick up as it gets colder',
      body: 'Since September, your skin has felt Okay or worse on twice as many days as in the summer.',
      strength: 'developing',
      days: [
        { code: '1000', caption: 'Jun' }, { code: '1000', caption: 'Jul' }, { code: '1000', caption: 'Aug' },
        { code: '2010', caption: 'Sep' }, { code: '2020', caption: 'Oct' }, { code: '3020', caption: 'Nov' },
      ],
      tip: 'Switch to a richer cream when the heating comes on.',
    },
  ],
  year: [
    { ...TRAVEL, body: 'On 9 of your 11 trips this year, your itch level rose within 2 days of flying.' },
    {
      title: 'Winter is your roughest season',
      body: 'December to February had the most Meh and Rough days, and the most itch.',
      strength: 'strong',
      days: [
        { code: '3030', caption: 'Dec' }, { code: '4040', caption: 'Jan' }, { code: '3030', caption: 'Feb' },
        { code: '1000', caption: 'May' }, { code: '1000', caption: 'Jul' }, { code: '2020', caption: 'Oct' },
      ],
      tip: 'Start your winter routine before the cold sets in.',
    },
    {
      title: 'Breakouts are getting less frequent',
      body: 'You logged breakouts on 18% of days in the last three months, down from 31% at the start of the year.',
      strength: 'developing',
      days: [
        { code: '2100', caption: 'Q1' }, { code: '2100', caption: 'Q1' }, { code: '2100', caption: 'Q2' },
        { code: '1000', caption: 'Q3' }, { code: '1000', caption: 'Q4' }, { code: '1000', caption: 'Q4' },
      ],
      tip: 'Whatever changed in spring is working. Keep it up.',
    },
  ],
};

function Badge({ strength }: { strength: Pattern['strength'] }) {
  const strong = strength === 'strong';
  return (
    <span style={{
      height: 26, padding: '0 10px', borderRadius: 999, display: 'inline-flex', alignItems: 'center',
      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', border: '1.5px solid #000',
      background: strong ? '#000' : '#fff', color: strong ? '#fff' : '#000',
    }}>{strong ? 'STRONG PATTERN' : 'DEVELOPING'}</span>
  );
}

export function PatternCard({ pattern: p, index }: { pattern: Pattern; index: number }) {
  return (
    <article style={{ border: '1.5px solid #000', borderRadius: 24, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>{String(index + 1).padStart(2, '0')}</span>
        <Badge strength={p.strength} />
      </div>
      <h3 style={{ margin: '6px 0 0', fontSize: 23, lineHeight: '28px', fontWeight: 400, letterSpacing: '-0.01em' }}>{p.title}</h3>
      <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: '19px' }}>{p.body}</p>
      <div style={{ background: 'var(--fill)', borderRadius: 14, padding: '12px 10px', display: 'grid', gridTemplateColumns: `repeat(${p.days.length}, minmax(0, 1fr))`, justifyItems: 'center', margin: '6px 0' }}>
        {p.days.map((d, j) => (
          <div key={j} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Glyph size={40} log={parseCode(d.code)} />
            {d.caption && <span className="muted" style={{ fontSize: 11, lineHeight: '14px' }}>{d.caption}</span>}
          </div>
        ))}
      </div>
      <p style={{ margin: 0, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: 13, lineHeight: '19px', fontWeight: 600 }}>{p.tip}</p>
    </article>
  );
}

/** Only the patterns that relate to one day's log. Renders nothing if none match. */
export function DayInsights({ log }: { log: SkinLog }) {
  const matched = PATTERNS.map((p, k) => ({ p, k })).filter(({ p }) => p.matches?.(log));
  if (matched.length === 0) return null;
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
      <h2 style={{ margin: 0, fontSize: 21, lineHeight: '28px', fontWeight: 400 }}>Insights for this day</h2>
      {matched.map(({ p, k }) => <PatternCard key={p.title} pattern={p} index={k} />)}
    </section>
  );
}

/** Every pattern card, with an optional heading above them. */
export default function PatternCards({ heading, patterns = PATTERNS }: { heading?: string; patterns?: Pattern[] }) {
  return (
    <>
      {heading && <h2 style={{ margin: '4px 0 -8px', fontSize: 21, lineHeight: '28px', fontWeight: 400 }}>{heading}</h2>}
      {patterns.map((p, k) => <PatternCard key={p.title} pattern={p} index={k} />)}
    </>
  );
}
