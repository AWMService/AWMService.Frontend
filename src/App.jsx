import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import SupervisorsPage from './pages/Supervisors/SupervisorsPage';
import TimePeriodsPage from './pages/TimePeriods/TimePeriodsPage';
import DirectionsPage from './pages/Directions/DirectionsPage';
import TopicsPage from './pages/Topics/TopicsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <Header pathname={location.pathname} />
      <div className="main-layout">
        <Sidebar pathname={location.pathname} />
        <main className="content">
          <Routes>
            <Route path="/" element={<SupervisorsPage />} />
            <Route path="/time-periods" element={<TimePeriodsPage />} />
            <Route path="/directions" element={<DirectionsPage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
