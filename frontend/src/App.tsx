import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import GoalsPage from './pages/GoalsPage';
import CaptainRoster from './pages/CaptainRoster';
import ActivitiesPage from './pages/ActivitiesPage';
import PrecinctsPage from './pages/PrecinctsPage';
import TurnoutAnalysis from './pages/TurnoutAnalysis';
import DirectoryPage from './pages/DirectoryPage';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/captains" element={<CaptainRoster />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/precincts" element={<PrecinctsPage />} />
        <Route path="/turnout" element={<TurnoutAnalysis />} />
        <Route path="/directory" element={<DirectoryPage />} />
      </Route>
    </Routes>
  );
}
