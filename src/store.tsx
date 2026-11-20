import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export interface Entry {
  /** 0 Great … 4 Rough */
  feel: number;
  /** spots | itch | red | oily | none */
  marks: Record<string, boolean>;
}

export interface Food {
  coffee: number;
  water: number;
  foods: Record<string, boolean>;
  vit: boolean;
  vits: Record<string, boolean>;
}

export interface Routine {
  /** [morning, night] → step index → done */
  done: [Record<number, boolean>, Record<number, boolean>];
  skipped: boolean;
}

export const ROUTINES: [string, string, boolean?][][] = [
  [['Cleanser', 'Gentle foaming cleanser', true], ['Serum', 'Niacinamide 10%'], ['Moisturiser', 'Ceramide cream'], ['Sunscreen', 'SPF 50, fragrance-free']],
  [['Cleanser', 'Gentle foaming cleanser', true], ['Treatment', 'Retinol 0.2% · 3 nights a week'], ['Moisturiser', 'Ceramide cream']],
];

interface Store {
  name: string;
  /** Time today's entry was saved, or null. */
  loggedAt: string | null;
  entry: Entry;
  food: Food;
  foodOptions: string[];
  routine: Routine;
  setEntry: (e: Partial<Entry>) => void;
  setFood: (f: Partial<Food>) => void;
  setFoodOptions: (o: string[]) => void;
  setRoutine: (r: Partial<Routine>) => void;
  saveToday: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loggedAt, setLoggedAt] = useState<string | null>(null);
  const [entry, setEntryS] = useState<Entry>({ feel: 2, marks: { itch: true } });
  const [food, setFoodS] = useState<Food>({
    coffee: 2, water: 5, foods: { 'Oat milk': true, Sweets: true }, vit: true, vits: { Zinc: true, 'Vitamin D': true },
  });
  const [foodOptions, setFoodOptions] = useState(['Dairy', 'Oat milk', 'Sweets', 'Gluten', 'Fried food', 'Spicy food']);
  const [routine, setRoutineS] = useState<Routine>({ done: [{ 0: true, 1: true }, {}], skipped: false });

  const value = useMemo<Store>(() => ({
    name: 'Eric',
    loggedAt, entry, food, foodOptions, routine,
    setEntry: (e) => setEntryS((s) => ({ ...s, ...e })),
    setFood: (f) => setFoodS((s) => ({ ...s, ...f })),
    setFoodOptions,
    setRoutine: (r) => setRoutineS((s) => ({ ...s, ...r })),
    saveToday: () => setLoggedAt(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })),
  }), [loggedAt, entry, food, foodOptions, routine]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}

/** Itch level shown on summaries (prototype: itchy = 2/5). */
export const itchOf = (e: Entry) => (e.marks.itch ? 2 : 0);

/** Today's entry as a 4-char glyph code (feel, breakouts, itch, travel). */
export const codeOfEntry = (e: Entry) => `${e.feel}${e.marks.spots ? 1 : 0}${itchOf(e)}0`;
