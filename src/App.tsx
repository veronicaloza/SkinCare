import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './store';
import Home from './screens/Home';
import Learn from './screens/Learn';
import Legend from './screens/Legend';
import Camera from './screens/Camera';
import Entry from './screens/Entry';
import Day from './screens/Day';
import Album from './screens/Album';
import Compare from './screens/Compare';
import Food from './screens/Food';
import Options from './screens/Options';
import Routine from './screens/Routine';
import Product from './screens/Product';
import Travel from './screens/Travel';
import Notes from './screens/Notes';
import Calendar from './screens/Calendar';
import Reminders from './screens/Reminders';

/** Shrink the desktop phone frame so it always fits the window (no page scroll). */
function useFitPhone() {
  useEffect(() => {
    const fit = () => {
      const s = Math.min(1, (window.innerHeight - 68) / 844, (window.innerWidth - 68) / 390);
      document.documentElement.style.setProperty('--fit', String(Math.max(0.4, s)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
}

export default function App() {
  useFitPhone();
  return (
    <StoreProvider>
      <HashRouter>
        <div className="stage">
          <div className="phone">
            <Routes>
              {/* 1 · Nav, home, legend, learn */}
              <Route path="/" element={<Home />} />
              <Route path="/key" element={<Legend />} />
              <Route path="/learn" element={<Learn />} />
              {/* 2 · Photo first, then data */}
              <Route path="/camera" element={<Camera />} />
              <Route path="/entry" element={<Entry />} />
              <Route path="/day" element={<Day />} />
              <Route path="/album" element={<Album />} />
              <Route path="/compare" element={<Compare />} />
              {/* 3 · What I ate, products, travel, notes */}
              <Route path="/food" element={<Food />} />
              <Route path="/routine" element={<Routine />} />
              <Route path="/product" element={<Product />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/notes" element={<Notes />} />
              {/* 4 · Habits: customize, repeat, remind */}
              <Route path="/options" element={<Options />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </StoreProvider>
  );
}
