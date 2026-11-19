import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size: number, p: P) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p,
});

export const Back = ({ size = 18, ...p }: P) => <svg {...base(size, p)} strokeWidth={2}><path d="M15 18l-6-6 6-6" /></svg>;
export const Close = ({ size = 16, ...p }: P) => <svg {...base(size, p)} strokeWidth={2}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const Check = ({ size = 16, ...p }: P) => <svg {...base(size, p)} strokeWidth={3}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const Plus = ({ size = 14, ...p }: P) => <svg {...base(size, p)} strokeWidth={2.6}><path d="M12 5v14M5 12h14" /></svg>;
export const Chevron = ({ size = 18, ...p }: P) => <svg {...base(size, p)} strokeWidth={2}><path d="M9 6l6 6-6 6" /></svg>;
export const Up = ({ size = 16, ...p }: P) => <svg {...base(size, p)} strokeWidth={2}><path d="M6 15l6-6 6 6" /></svg>;
export const Pencil = ({ size = 18, ...p }: P) => <svg {...base(size, p)} strokeWidth={2}><path d="M4 20h4L19 9l-4-4L4 16z" /></svg>;
export const Camera = ({ size = 26, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.8}><path d="M3.5 8.5h3.2l1.8-2.5h7l1.8 2.5h3.2V19h-17z" /><circle cx="12" cy="13" r="3.6" /></svg>
);
export const Sliders = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>
);
export const Bell = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.8}><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></svg>
);
export const Barcode = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.8}><path d="M4 7V5h3M17 5h3v2M20 17v2h-3M7 19H4v-2M8 9v6M11 9v6M14 9v6M17 9v6" /></svg>
);
export const Plane = ({ size = 22, ...p }: P) => <svg {...base(size, p)} strokeWidth={1.7}><path d="M2.5 16l19-7.5-5.5 11-3-4.5-4.5-2z" /></svg>;
export const Cup = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.7}><path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" /><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" /></svg>
);
export const Bottle = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.7}><rect x="8" y="8" width="8" height="13" rx="2" /><path d="M10 8V5h4v3M11 3h2" /></svg>
);
export const Note = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.7}><path d="M5 4h14v12l-4 4H5z" /><path d="M9 9h6M9 13h4" /></svg>
);
export const Ghost = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.8}><rect x="3" y="3" width="13" height="13" rx="2" /><rect x="8" y="8" width="13" height="13" rx="2" strokeDasharray="2 2" /></svg>
);
