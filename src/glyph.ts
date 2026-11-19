/** Every day's log is drawn as a glyph of concentric layers:
 *  centre dot = how skin feels (bigger = rougher), solid ring = new breakouts,
 *  dashed ring = itch (thicker = itchier), dotted outer ring = travel. */
export const COLORS = {
  core: '#ff5a3d',   // coral · how it feels
  break: '#7a5cff',  // violet · breakouts
  itch: '#ff6fd8',   // pink · itch / dryness
  travel: '#8cc20a', // lime · travel
};

export const FEELS = ['Great', 'Good', 'Okay', 'Meh', 'Rough'];
export const CORES = [1.6, 3.6, 6, 8.4, 11];

export interface DayCode {
  /** 0 Great … 4 Rough */
  f: number;
  b: boolean;
  /** itch 0–5 */
  i: number;
  t: boolean;
}

/** Parse a 4-char code like "3021" (feel, breakouts, itch, travel). */
export function parseCode(code: string): DayCode {
  return { f: +code[0], b: code[1] === '1', i: +code[2], t: code[3] === '1' };
}

/** "Meh skin · breakouts · itch 3/5 · travelling" */
export function summary(d: DayCode): string {
  const parts = [`${FEELS[d.f]} skin`];
  if (d.b) parts.push('breakouts');
  if (d.i) parts.push(`itch ${d.i}/5`);
  if (d.t) parts.push('travelling');
  return parts.join(' · ');
}

/** Demo history for November 2026 (today = Thu 19). */
export const NOV_CODES: Record<number, string> = {
  1: '2110', 2: '1000', 3: '1000', 4: '0000', 5: '1100', 6: '2100', 7: '3131', 8: '2120',
  9: '1000', 10: '1001', 11: '2000', 12: '1000', 13: '3131', 14: '2010', 15: '1001',
  16: '3021', 17: '2020', 18: '3030',
};
export const TODAY = 19;
