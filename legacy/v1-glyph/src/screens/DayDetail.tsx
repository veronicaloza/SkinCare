import { Link } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { DayInsights } from '../components/PatternCards';
import { IconBack, IconPencil } from '../components/Icons';
import { DAY_DETAILS } from '../data';
import { COLORS, FEELS, describe, itchWidth } from '../glyph';

type Kind = 'core' | 'break' | 'itch' | 'travel';

function RowIcon({ kind, on, f, i }: { kind: Kind; on: boolean; f: number; i: number }) {
  const ring = kind === 'core' ? '#d0d0d0' : on ? COLORS[kind] : '#d0d0d0';
  const w = kind === 'itch' ? (on ? itchWidth(i) : 1) : kind === 'travel' ? 1.8 : kind === 'core' ? 0.6 : 1.4;
  const dash = kind === 'itch' ? '3 2' : kind === 'travel' ? '0.01 3.2' : undefined;
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" style={{ flexShrink: 0 }}>
      {kind === 'core' && <circle cx="11" cy="11" r={[1.3, 2.4, 3.6, 4.8, 6][f]} fill={COLORS.core} />}
      <circle cx="11" cy="11" r="8.5" fill="none" stroke={ring} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" />
    </svg>
  );
}

/** B4 · Day detail */
export default function DayDetail() {
  const day = DAY_DETAILS[1];
  const { f, b, i, t } = day.log;

  const rows: { label: string; value: string; on: boolean; kind: Kind }[] = [
    { label: 'Skin sensation', value: FEELS[f], on: true, kind: 'core' },
    { label: 'Breakouts', value: b ? 'Yes' : 'No', on: b, kind: 'break' },
    { label: 'Itch', value: i ? `${i} of 5` : 'None', on: i > 0, kind: 'itch' },
    { label: 'Travel', value: t ? 'Yes' : 'No', on: t, kind: 'travel' },
  ];

  return (
    <main className="screen" style={{ padding: '60px 0 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 16px' }}>
        <Link to="/journal" className="circle-btn" aria-label="Back to journal"><IconBack /></Link>
        <p style={{ margin: 0, fontSize: 17, lineHeight: '24px', fontWeight: 500 }}>{day.date}</p>
        <Link to="/log/review" className="circle-btn solid" aria-label="Edit this log"><IconPencil /></Link>
      </div>

      <div className="scroll" style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Glyph size={150} log={day.log} label={`${day.date}: ${describe(day.log)}`} />
      </div>

      <p className="body" style={{ textAlign: 'center' }}>{day.note}</p>

      <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--line)' }}>
        {rows.map((r) => (
          <div key={r.kind} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 40, borderBottom: '1px solid var(--line)' }}>
            <RowIcon kind={r.kind} on={r.on} f={f} i={i} />
            <dt className="muted" style={{ flex: 1, fontSize: 15, lineHeight: '20px' }}>{r.label}</dt>
            <dd style={{ margin: 0, fontSize: 15, lineHeight: '20px', fontWeight: 500 }}>{r.value}</dd>
          </div>
        ))}
      </dl>

      <DayInsights log={day.log} />
      </div>

      <div style={{ paddingTop: 12, borderTop: '1px solid var(--line)', display: 'flex' }}>
        <Nav active="journal" />
      </div>
    </main>
  );
}
