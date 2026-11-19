import type { CSSProperties } from 'react';
import { COLORS, CORES } from '../glyph';

export interface GlyphProps {
  size: number;
  /** Centre radius (on the 40×40 grid) or a feel index via `feel`. */
  r?: number;
  feel?: number;
  breakouts?: boolean;
  itch?: boolean | number;
  travel?: boolean;
  /** White disc behind the glyph (when it sits on a photo). */
  disc?: boolean;
  label?: string;
  style?: CSSProperties;
  /** Override layer colours (used by the legend to dim layers). */
  colors?: Partial<typeof COLORS>;
  /** Centre fill override. */
  coreFill?: string;
}

/** Concentric-ring glyph on a 40×40 grid. */
export default function Glyph({ size, r, feel, breakouts, itch, travel, disc, label, style, colors, coreFill }: GlyphProps) {
  const c = { ...COLORS, ...colors };
  const coreR = r ?? (feel != null ? CORES[feel] : 0);
  const itchW = typeof itch === 'number' && itch > 0 ? (0.6 + 0.35 * itch) * 1.4 : 1.65;
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <svg
      className="glyph" width={size} height={size} viewBox="0 0 40 40" {...a11y}
      style={{ flexShrink: 0, display: 'block', ...(disc ? { background: '#fff', borderRadius: 999 } : null), ...style }}
    >
      <circle cx="20" cy="20" r="18.6" fill="none" stroke={travel ? c.travel : 'none'} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.01 2.9" />
      <circle cx="20" cy="20" r="16" fill="none" stroke={itch ? c.itch : 'none'} strokeWidth={itchW} strokeDasharray="2.2 1.6" />
      <circle cx="20" cy="20" r="13.4" fill="none" stroke={breakouts ? c.break : 'none'} strokeWidth="1.4" />
      <circle cx="20" cy="20" r={coreR} fill={coreFill ?? c.core} />
    </svg>
  );
}
