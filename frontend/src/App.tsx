import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import CaptainRoster from './pages/CaptainRoster';
import PrecinctsPage from './pages/PrecinctsPage';
import TurnoutAnalysis from './pages/TurnoutAnalysis';
import DirectoryPage from './pages/DirectoryPage';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/captains" element={<CaptainRoster />} />
        <Route path="/precincts" element={<PrecinctsPage />} />
        <Route path="/turnout" element={<TurnoutAnalysis />} />
        <Route path="/directory" element={<DirectoryPage />} />
      </Route>
    </Routes>
  );
}
