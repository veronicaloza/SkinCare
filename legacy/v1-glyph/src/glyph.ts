/** One day's skin log. Every log renders as a glyph:
 *  centre = how skin feels, solid ring = breakouts,
 *  dashed ring = itch (thicker = itchier), dotted outer ring = travel. */
export interface SkinLog {
  /** 0 Great … 4 Rough */
  f: number;
  /** new breakouts */
  b: boolean;
  /** itch / dryness 0–5 */
  i: number;
  /** travelling or flew in the last day */
  t: boolean;
}

export type DayState = 'logged' | 'today' | 'missed' | 'future';

export const CORES = [1.6, 3.6, 6, 8.4, 11];

/** Layer colour mixes taken from the "Blooming" posters. */
export const PALETTES = {
  /** Green / cyan posters (1 & 3). */
  greenMagenta: {
    core: '#2fd15a',   // lime green · skin sensation
    break: '#ff4fc8',  // hot magenta · breakouts
    itch: '#13bfe6',   // cyan · itch
    travel: '#6b5cff', // violet-blue · travel
  },
  /** Pink / coral poster (4). */
  coralLavender: {
    core: '#ff5a3d',   // coral · skin sensation
    break: '#7a5cff',  // lavender-violet · breakouts
    itch: '#ff6fd8',   // bubblegum pink · itch
    travel: '#8cc20a', // acid lime · travel
  },
};

/** Active palette: swap the key to try another mix. */
export const COLORS = PALETTES.coralLavender;
export const FEELS = ['Great', 'Good', 'Okay', 'Meh', 'Rough'];

export const itchWidth = (i: number) => 0.6 + 0.35 * i;

/** Parse a 4-char code like "3021" (feel, breakouts, itch, travel). */
export function parseCode(code: string): SkinLog {
  return { f: +code[0], b: code[1] === '1', i: +code[2], t: code[3] === '1' };
}

/** Layer props for <Glyph> from a full log. */
export function layersOf(log: SkinLog) {
  return {
    coreR: CORES[log.f],
    b: log.b ? COLORS.break : 'none',
    i: log.i > 0 ? COLORS.itch : 'none',
    iW: itchWidth(log.i),
    t: log.t ? COLORS.travel : 'none',
  };
}

/** "meh, breakouts, itch 3 of 5, travelling" */
export function describe(log: SkinLog): string {
  const parts = [FEELS[log.f].toLowerCase()];
  if (log.b) parts.push('breakouts');
  if (log.i) parts.push(`itch ${log.i} of 5`);
  if (log.t) parts.push('travelling');
  return parts.join(', ');
}

/** "Meh skin · breakouts · itch 3/5 · travelling" */
export function summary(log: SkinLog): string {
  const parts = [`${FEELS[log.f]} skin`];
  if (log.b) parts.push('breakouts');
  if (log.i) parts.push(`itch ${log.i}/5`);
  if (log.t) parts.push('travelling');
  return parts.join(' · ');
}
