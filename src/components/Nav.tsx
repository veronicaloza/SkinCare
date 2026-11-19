import { Link } from 'react-router-dom';
import { useStore } from '../store';

type Tab = 'home' | 'album' | 'calendar' | 'insights' | 'none';

/** Pill nav: filled + in the middle turns into ✓ once today is logged. */
export default function Nav({ active }: { active: Tab }) {
  const { loggedAt } = useStore();
  const logged = !!loggedAt;
  const item = (tab: Tab) => ({
    className: active === tab ? 'active' : undefined,
    'aria-current': active === tab ? ('page' as const) : undefined,
  });
  return (
    <nav className="nav" aria-label="Main">
      <Link to="/" aria-label="Home" {...item('home')}>
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 17.5L18 4.5l14 13" /><path d="M7.5 14.5V31.5h21V14.5" /><path d="M14.5 31.5v-9h7v9" /></svg>
      </Link>
      <Link to="/album" aria-label="Photos" {...item('album')}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></svg>
      </Link>
      <Link to={logged ? '/day' : '/camera'} className="plus" aria-label={logged ? 'Today is logged. Open today’s entry' : 'Log today'}>
        {logged ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 4.5v15M4.5 12h15" /></svg>
        )}
      </Link>
      <Link to="/calendar" aria-label="Calendar" {...item('calendar')}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
      </Link>
      <Link to="/key" aria-label="Insights" {...item('insights')}>
        <svg width="28" height="28" viewBox="0 0 38 38" aria-hidden="true"><circle cx="19" cy="19" r="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeDasharray="1.9 2.3" /><circle cx="19" cy="19" r="6" fill="currentColor" /></svg>
      </Link>
    </nav>
  );
}
