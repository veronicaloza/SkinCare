import { parseCode, type SkinLog } from './glyph';

/** The prototype's sample data is anchored on Sunday 8 Nov 2026. */
export const TODAY_LONG = 'Sunday, 8 Nov 2026';
export const TODAY_SHORT = 'Sunday, 8 Nov';
export const USER_NAME = 'Eric';

/** Today in the sample data (month is 0-based). */
export const TODAY = { year: 2026, month: 10, day: 8 };

/** Journal covers these whole years. */
export const FIRST_YEAR = 2024;
export const LAST_YEAR = 2026;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export interface MonthData {
  year: number;
  /** 0-based */
  month: number;
  name: string;
  /** blank cells before day 1 (week starts Monday) */
  offset: number;
  days: number;
  /** one code per past day, 'x' = missed; empty for today and later */
  codes: string[];
}

/** Hand-written logs used by the prototype's other screens; they win over generated ones. */
const HAND_LOGS: Record<string, string[]> = {
  '2026-9': ['1000','2100','2100','1000','x','0000','1000','1001','2001','3031','3041','2120','2110','1000','1000','x','2100','3100','2100','1000','0000','0000','1000','x','x','2100','1000','1001','3021','3131','2120'],
  '2026-10': ['2110','1000','1000','0000','1100','2100','x'],
};

/** Small seeded PRNG so the sample history is the same on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const isPast = (y: number, m: number, d: number) =>
  y < TODAY.year || (y === TODAY.year && (m < TODAY.month || (m === TODAY.month && d < TODAY.day)));

/** Believable sample history: rougher, itchier winters; occasional trips with itch afterwards. */
function buildMonths(): MonthData[] {
  const rnd = mulberry32(20261108);
  const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
  const months: MonthData[] = [];
  let tripLeft = 0;
  let sinceTrip = 99;

  for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) {
    for (let m = 0; m < 12; m++) {
      const days = new Date(y, m + 1, 0).getDate();
      const offset = (new Date(y, m, 1).getDay() + 6) % 7;
      const winter = m === 11 || m <= 1;
      const codes: string[] = [];

      for (let d = 1; d <= days; d++) {
        if (tripLeft === 0 && rnd() < 0.022) tripLeft = 2 + Math.floor(rnd() * 3);
        const travelling = tripLeft > 0;
        if (travelling) { tripLeft--; sinceTrip = 0; } else sinceTrip++;
        if (!isPast(y, m, d)) continue;

        if (rnd() < 0.16) { codes.push('x'); continue; }
        const f = clamp(Math.round((winter ? 1.8 : 0.9) + (rnd() - 0.4) * 2.4 + (sinceTrip <= 2 ? 0.8 : 0)), 0, 4);
        const b = rnd() < (winter ? 0.3 : 0.17) ? 1 : 0;
        let i = rnd() < (winter ? 0.55 : 0.2) ? 1 + Math.floor(rnd() * 3) : 0;
        if (sinceTrip >= 1 && sinceTrip <= 2) i = clamp(i + 2 + Math.floor(rnd() * 2), 0, 5);
        codes.push(`${f}${b}${i}${travelling ? 1 : 0}`);
      }

      const hand = HAND_LOGS[`${y}-${m}`];
      months.push({ year: y, month: m, name: MONTH_NAMES[m], offset, days, codes: hand ?? codes });
    }
  }
  return months;
}

export const MONTHS: MonthData[] = buildMonths();

/** Mon–Sat of the current week (2–7 Nov); Sunday is today. */
export const THIS_WEEK: { label: string; code: string }[] = [
  { label: 'M', code: '1000' },
  { label: 'T', code: '1000' },
  { label: 'W', code: '0000' },
  { label: 'T', code: '1100' },
  { label: 'F', code: '2100' },
  { label: 'S', code: 'x' },
];

export interface DayEntry { short: string; date: string; log: SkinLog; note: string }

/** Days shown on the day-detail arc. */
export const DAY_DETAILS: DayEntry[] = [
  { short: 'Thu', date: 'Thursday, 29 Oct', log: parseCode('3021'), note: 'Flight day. Skin felt tight by the evening.' },
  { short: 'Fri', date: 'Friday, 30 Oct', log: parseCode('3131'), note: 'Day after the flight: itchy elbows and two new spots.' },
  { short: 'Sat', date: 'Saturday, 31 Oct', log: parseCode('2120'), note: 'Calmer. Extra moisturiser helped the itch.' },
];

/** Pattern strip on the insights screen (8–14 Oct). */
export const PATTERN_WEEK = ['1001', '2001', '3031', '3041', '2120', '2110', '1000'];

/** Default answers pre-filled in the "Log my skin" flow. */
export const SAMPLE_LOG: SkinLog = { f: 3, b: true, i: 3, t: true };
