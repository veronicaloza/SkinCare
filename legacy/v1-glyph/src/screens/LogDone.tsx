import { Link, Navigate } from 'react-router-dom';
import Glyph from '../components/Glyph';
import Nav from '../components/Nav';
import { IconPencil } from '../components/Icons';
import { describe, summary } from '../glyph';
import { useStore } from '../store';

/** L6 · Logged */
export default function LogDone() {
  const { today } = useStore();
  if (!today) return <Navigate to="/log/review" replace />;

  return (
    <main className="screen" style={{ padding: '60px 24px 32px', gap: 16, alignItems: 'center' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center', width: '100%' }}>
        <Glyph size={220} log={today} label={`Today’s glyph: ${describe(today)}`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          <h1 className="h-hello">Logged. That’s today.</h1>
          <p className="body muted">{summary(today)}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <Link to="/log/review" className="pill outline md" style={{ flex: 1 }}><IconPencil size={16} /> Edit log</Link>
          <Link to="/journal" className="pill md" style={{ flex: 1 }}>See in journal</Link>
        </div>
      </div>
      <Nav active="home" />
    </main>
  );
}
