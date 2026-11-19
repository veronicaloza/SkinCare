import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Back } from './Icons';

export const PHOTO = `${import.meta.env.BASE_URL}placeholder-face.webp`;

/** Back arrow · centred title · optional right slot. */
export function TopBar({ back, backLabel = 'Back', title, right, wide }: {
  back?: string; backLabel?: string; title: ReactNode; right?: ReactNode; wide?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className={`topbar${wide ? ' wide-right' : ''}`}>
      {back ? (
        <Link to={back} className="iconbtn" aria-label={backLabel}><Back /></Link>
      ) : (
        <button type="button" className="iconbtn" aria-label={backLabel} onClick={() => navigate(-1)}><Back /></button>
      )}
      {typeof title === 'string' ? <h1 className="h-bar">{title}</h1> : title}
      {right ?? <span style={{ width: 44 }} />}
    </div>
  );
}

export function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="switch" onClick={onToggle}>
      <span />
    </button>
  );
}

/** Pill segmented control (single choice). */
export function Segmented({ options, value, onChange, label }: {
  options: string[]; value: number; onChange: (k: number) => void; label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="seg" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o, k) => (
        <button key={o} type="button" role="radio" aria-checked={value === k} onClick={() => onChange(k)}>{o}</button>
      ))}
    </div>
  );
}

/** Wrapping row of single-choice chips. */
export function ChipRadio({ options, value, onChange, label, small }: {
  options: string[]; value: number; onChange: (k: number) => void; label: string; small?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="wrap">
      {options.map((o, k) => (
        <button key={o} type="button" role="radio" aria-checked={value === k} className={`chip${small ? ' sm' : ''}${value === k ? ' on' : ''}`} onClick={() => onChange(k)}>{o}</button>
      ))}
    </div>
  );
}

/** Wrapping row of multi-select chips. */
export function ChipToggles({ options, on, onToggle, dim }: {
  options: string[]; on: Record<string, boolean>; onToggle: (o: string) => void; dim?: boolean;
}) {
  return (
    <div className="wrap" style={dim ? { opacity: 0.4 } : undefined}>
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={!!on[o]} className={`chip${on[o] ? ' on' : ''}`} onClick={() => onToggle(o)}>{o}</button>
      ))}
    </div>
  );
}

export const toggleKey = (rec: Record<string, boolean>, k: string) => ({ ...rec, [k]: !rec[k] });
