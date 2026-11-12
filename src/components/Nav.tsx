import { Link } from 'react-router-dom';

export type NavKey = 'home' | 'journal' | 'questions' | 'insights';

const svg = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const };

/** White outlined pill: Home · Log today · Insights. */
export default function Nav({ active }: { active?: NavKey }) {
  return (
    <nav className="nav" aria-label="Main">
      <Link to="/" className={`nav-item${active === 'home' ? ' active' : ''}`} aria-label="Home" aria-current={active === 'home' ? 'page' : undefined}>
        <svg {...svg} width="36" height="36" viewBox="0 0 36 36" strokeWidth="1.6">
          <path d="M4 17.5L18 4.5l14 13" />
          <path d="M7.5 14.5V31.5h21V14.5" />
          <path d="M14.5 31.5v-9h7v9" />
        </svg>
      </Link>
      <Link to="/log/1" className="nav-item" aria-label="Log today">
        <svg {...svg} width="38" height="38" viewBox="0 0 38 38" strokeWidth="1.4">
          <circle cx="19" cy="19" r="17.5" />
          <path d="M19 11.5v15M11.5 19h15" strokeWidth="1.6" />
        </svg>
      </Link>
      <Link to="/insights" className={`nav-item${active === 'insights' ? ' active' : ''}`} aria-label="Insights" aria-current={active === 'insights' ? 'page' : undefined}>
        <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
          <circle cx="19" cy="19" r="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeDasharray="1.9 2.3" />
          <circle cx="19" cy="19" r="5.2" fill="currentColor" />
        </svg>
      </Link>
    </nav>
  );
}
