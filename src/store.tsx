import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { SAMPLE_LOG } from './data';
import type { SkinLog } from './glyph';

interface Store {
  /** Today's saved log, or null if not logged yet. */
  today: SkinLog | null;
  /** Answers in progress in the "Log my skin" flow. */
  draft: SkinLog;
  note: string;
  setDraft: (patch: Partial<SkinLog>) => void;
  setNote: (note: string) => void;
  save: (log: SkinLog) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [today, setToday] = useState<SkinLog | null>(null);
  const [draft, setDraftState] = useState<SkinLog>(SAMPLE_LOG);
  const [note, setNote] = useState('');

  const value = useMemo<Store>(() => ({
    today,
    draft,
    note,
    setNote,
    setDraft: (patch) => setDraftState((d) => ({ ...d, ...patch })),
    save: (log) => { setToday(log); setDraftState(log); },
  }), [today, draft, note]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
