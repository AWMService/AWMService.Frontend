import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import SupervisorsPage from './pages/Supervisors/SupervisorsPage.jsx';
import TimePeriodsPage from './pages/TimePeriods/TimePeriodsPage.jsx';
import SettingsPage from './pages/Settings/SettingsPage.jsx';
import TimePeriodSetupPage from './pages/TimePeriods/TimePeriodsSetupPage/TimePeriodSetupPage.jsx';
import DirectionsAndThemes from './pages/DirectionsAndThemes/DirectionsAndThemes.jsx';
import TimePeriodSchedulePage from './pages/TimePeriods/TimePeriodSchedulePage.jsx';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <Header />
            <div className="main-layout">
                <Sidebar />
                <main className="content">
                    <Routes>
                        <Route index element={<Navigate to="/supervisors" replace />} />
                        <Route path="/supervisors" element={<SupervisorsPage />} />
                        <Route path="/time-periods" element={<TimePeriodsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/time-periods/:id/setup" element={<TimePeriodSetupPage />} />
                        <Route path="/directions-topics" element={<DirectionsAndThemes />} />
                        <Route path="/time-periods/:id/schedule" element={<TimePeriodSchedulePage />} />
                        <Route path="*" element={<Navigate to="/supervisors" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
