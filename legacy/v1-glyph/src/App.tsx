import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './store';
import Home from './screens/Home';
import Checkin from './screens/Checkin';
import Journal from './screens/Journal';
import DayDetail from './screens/DayDetail';
import Insights from './screens/Insights';
import Patterns from './screens/Patterns';
import Questions from './screens/Questions';
import LogStep from './screens/LogStep';
import LogReview from './screens/LogReview';
import LogDone from './screens/LogDone';

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <div className="stage">
          <div className="phone">
            <Routes>
              {/* Section 4 · Black & white: every log becomes a glyph */}
              <Route path="/" element={<Home />} />
              <Route path="/checkin" element={<Checkin />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/day" element={<DayDetail />} />
              <Route path="/insights" element={<Patterns />} />
              <Route path="/key" element={<Insights />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/questions/edit" element={<Questions startEdit />} />
              {/* Section 7 · Log my skin: one slide per question */}
              <Route path="/log/review" element={<LogReview />} />
              <Route path="/log/done" element={<LogDone />} />
              <Route path="/log/:step" element={<LogStep />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </StoreProvider>
  );
}
