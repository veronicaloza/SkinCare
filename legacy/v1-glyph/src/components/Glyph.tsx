import { COLORS, layersOf, type DayState, type SkinLog } from '../glyph';

export interface GlyphProps {
  size: number;
  /** Full log to draw. Omit for an empty day. */
  log?: SkinLog | null;
  /** How to draw a day with no log. */
  state?: DayState;
  /** Overrides for individual layers (used by the step-by-step log flow). */
  layers?: Partial<ReturnType<typeof layersOf>>;
  /** Thin guide circle just outside the glyph. */
  hairline?: boolean;
  /** Filled disc behind the glyph (photo-journal placeholder). */
  photo?: string;
  futureColor?: string;
  /** Ink colour (white on dark cards). */
  ink?: string;
  /** Accessible label; without it the glyph is decorative. */
  label?: string;
}

/** Concentric-ring glyph on a 40×40 grid. */
export default function Glyph({ size, log, state = 'logged', layers, hairline, photo, futureColor = '#c4c4c4', ink = '#000', label }: GlyphProps) {
  const base = log ? layersOf(log) : { coreR: 0, b: 'none', i: 'none', iW: 1, t: 'none' };
  const merged = { ...base, ...layers };
  const tint = (c: string) => (c === '#000' ? ink : c);
  const l = { ...merged, b: tint(merged.b), i: tint(merged.i), t: tint(merged.t) };
  const empty = !log && !layers;
  const emptyStroke = !empty ? 'none' : state === 'future' ? futureColor : '#000';
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" {...a11y} style={{ flexShrink: 0, display: 'block' }}>
      {photo && <circle cx="20" cy="20" r="18.5" fill={photo} />}
      {hairline && <circle cx="20" cy="20" r="19.6" fill="none" stroke="#e6e6e6" strokeWidth="0.15" />}
      <circle cx="20" cy="20" r="18.6" fill="none" stroke={l.t} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.01 2.9" style={{ transition: 'stroke .2s' }} />
      <circle cx="20" cy="20" r="16" fill="none" stroke={l.i} strokeWidth={l.iW} strokeDasharray="2.2 1.6" style={{ transition: 'stroke .2s, stroke-width .2s' }} />
      <circle cx="20" cy="20" r="13.4" fill="none" stroke={l.b} strokeWidth="1.4" style={{ transition: 'stroke .2s' }} />
      <circle cx="20" cy="20" r={l.coreR} fill={COLORS.core} style={{ transition: 'r .2s' }} />
      {empty && state !== 'logged' && (
        <circle cx="20" cy="20" r="11" fill="none" stroke={emptyStroke} strokeWidth="0.8" strokeDasharray={state === 'today' ? '1.2 1.2' : undefined} />
      )}
    </svg>
  );
}

/** Small single-layer icons used in legends and answer rows. */
export function LayerIcon({ kind, size = 26, on = true, value = 3 }: { kind: 'core' | 'break' | 'itch' | 'travel'; size?: number; on?: boolean; value?: number }) {
  const stroke = on ? COLORS[kind] : '#d0d0d0';
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden="true" style={{ flexShrink: 0 }}>
      {kind === 'core' && <circle cx="13" cy="13" r={[1.6, 2.8, 4.2, 6, 7.6][value] ?? 6} fill={COLORS.core} />}
      {kind === 'break' && <circle cx="13" cy="13" r="10" fill="none" stroke={stroke} strokeWidth="1.8" />}
      {kind === 'itch' && <circle cx="13" cy="13" r="10" fill="none" stroke={stroke} strokeWidth={on ? 0.8 + 0.4 * value : 1.4} strokeDasharray="3 2.4" />}
      {kind === 'travel' && <circle cx="13" cy="13" r="10" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.01 3.6" />}
    </svg>
  );
}
