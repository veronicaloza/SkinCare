type P = { size?: number; strokeWidth?: number };

const base = (size: number, sw: number) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const,
});

export const IconClose = ({ size = 16, strokeWidth = 2 }: P) => <svg {...base(size, strokeWidth)}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const IconBack = ({ size = 18, strokeWidth = 2 }: P) => <svg {...base(size, strokeWidth)}><path d="M15 18l-6-6 6-6" /></svg>;
export const IconPlus = ({ size = 24, strokeWidth = 2 }: P) => <svg {...base(size, strokeWidth)}><path d="M12 5v14M5 12h14" /></svg>;
export const IconMinus = ({ size = 14, strokeWidth = 2.4 }: P) => <svg {...base(size, strokeWidth)}><path d="M5 12h14" /></svg>;
export const IconCheck = ({ size = 18, strokeWidth = 2.2 }: P) => <svg {...base(size, strokeWidth)}><path d="M5 12l5 5L20 7" /></svg>;
export const IconUp = ({ size = 14, strokeWidth = 2.4 }: P) => <svg {...base(size, strokeWidth)}><path d="M6 15l6-6 6 6" /></svg>;
export const IconDown = ({ size = 14, strokeWidth = 2.4 }: P) => <svg {...base(size, strokeWidth)}><path d="M6 9l6 6 6-6" /></svg>;
export const IconPencil = ({ size = 18, strokeWidth = 2 }: P) => <svg {...base(size, strokeWidth)}><path d="M4 20h4L19 9l-4-4L4 16z" /></svg>;
export const IconGrip = ({ size = 18, strokeWidth = 2 }: P) => <svg {...base(size, strokeWidth)}><path d="M5 8h14M5 12h14M5 16h14" /></svg>;
export const IconCalendar = ({ size = 18, strokeWidth = 1.6 }: P) => (
  <svg {...base(size, strokeWidth)}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
