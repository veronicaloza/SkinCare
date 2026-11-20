/** Demo log history shared by the photo album and the calendar. */

export const NOW = { y: 2026, m: 10, d: 19 };
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Hand-written current month (Nov 2026). */
export const NOV: Record<number, string> = {
  1: '2110', 2: '1000', 3: '1000', 4: '0000', 5: '1100', 6: '2100', 7: '3131', 8: '2120', 9: '1000', 10: '1001', 11: '2000',
  16: '3021', 17: '2020', 18: '3030',
};

/** Deterministic made-up entry for any other past day (null = missed). */
function demoCode(y: number, m: number, d: number): string | null {
  let h = (y * 372 + m * 31 + d) * 2654435761;
  const rnd = () => { h = (h ^ (h >>> 15)) * 2246822519; h >>>= 0; return (h % 1000) / 1000; };
  if (rnd() < 0.18) return null;
  const f = Math.min(4, Math.floor(rnd() * rnd() * 5 + (m === 0 || m === 1 ? 1 : 0)));
  const b = rnd() < 0.22 ? 1 : 0;
  const i = rnd() < 0.3 ? 1 + Math.floor(rnd() * 4) : 0;
  const t = rnd() < 0.08 ? 1 : 0;
  return `${f}${b}${i}${t}`;
}

export const monthIndex = (y: number, m: number) => y * 12 + m;
export const daysIn = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
/** Blank cells before day 1 in a Monday-first grid. */
export const offsetOf = (y: number, m: number) => (new Date(y, m, 1).getDay() + 6) % 7;

export function isFuture(y: number, m: number, d: number) {
  const a = monthIndex(y, m), n = monthIndex(NOW.y, NOW.m);
  return a > n || (a === n && d > NOW.d);
}

/** Saved code for a past day, ignoring today (today comes from the store). */
export function pastCode(y: number, m: number, d: number): string | null {
  if (isFuture(y, m, d)) return null;
  if (y === NOW.y && m === NOW.m) return d === NOW.d ? null : NOV[d] ?? null;
  return demoCode(y, m, d);
}
