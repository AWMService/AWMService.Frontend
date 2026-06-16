import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, ROLES } from '@awm/shared';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import TimePeriodSetupPage from './pages/TimePeriods/TimePeriodsSetupPage/TimePeriodSetupPage.jsx';
import TimePeriodSchedulePage from './pages/TimePeriods/TimePeriodSchedulePage.jsx';
import { NotificationsPage } from '@awm/shared';
import StaffDashboard from './pages/Dashboards/StaffDashboard.jsx';
import SettingsDashboard from './pages/Dashboards/SettingsDashboard.jsx';
import PeriodsDashboard from './pages/Dashboards/PeriodsDashboard.jsx';
import TopicsDashboard from './pages/Dashboards/TopicsDashboard.jsx';
import DefensesDashboard from './pages/Dashboards/DefensesDashboard.jsx';
import './App.css';

function App() {
    return (
        <RequireAuth allowedRoles={[ROLES.DEPARTMENT]}>
            <div className="app-container">
                <Header />
                <div className="main-layout">
                    <Sidebar />
                    <main className="content">
                        <Routes>
                            {}
                            <Route index element={<Navigate to="/staff" replace />} />
                            <Route path="/staff" element={<StaffDashboard />} />
                            <Route path="/periods" element={<PeriodsDashboard />} />
                            <Route path="/topics" element={<TopicsDashboard />} />
                            <Route path="/defenses" element={<DefensesDashboard />} />
                            <Route path="/settings-dashboard" element={<SettingsDashboard />} />
                            
                            {}
                            <Route path="/time-periods/:id/setup" element={<div style={{ padding: '32px' }}><TimePeriodSetupPage /></div>} />
                            <Route path="/time-periods/:id/schedule" element={<div style={{ padding: '32px' }}><TimePeriodSchedulePage /></div>} />
                            <Route path="/notifications" element={<div style={{ padding: '32px' }}><NotificationsPage translationPrefix="department" /></div>} />
                            
                            {}
                            <Route path="/employees" element={<Navigate to="/staff?tab=employees" replace />} />
                            <Route path="/reviewers" element={<Navigate to="/staff?tab=reviewers" replace />} />
                            <Route path="/settings" element={<Navigate to="/settings-dashboard?tab=profile" replace />} />
                            <Route path="/evaluation-criteria" element={<Navigate to="/settings-dashboard?tab=criteria" replace />} />
                            <Route path="/check-settings" element={<Navigate to="/settings-dashboard?tab=checks" replace />} />
                            <Route path="/initial-periods" element={<Navigate to="/periods?tab=initial" replace />} />
                            <Route path="/time-periods" element={<Navigate to="/periods?tab=defenses" replace />} />
                            <Route path="/directions-topics" element={<Navigate to="/topics" replace />} />
                            <Route path="/topic-coordination" element={<Navigate to="/topics?tab=coordination" replace />} />
                            <Route path="/defense-readiness" element={<Navigate to="/defenses?tab=readiness" replace />} />
                            <Route path="/commissions" element={<Navigate to="/defenses?tab=commissions" replace />} />
                            <Route path="/student-distribution" element={<Navigate to="/defenses?tab=distribution" replace />} />
                            <Route path="/expert-assignment" element={<Navigate to="/defenses?tab=experts" replace />} />
                            <Route path="/reviewer-assignment" element={<Navigate to="/defenses?tab=reviewer-assignment" replace />} />

                            <Route path="*" element={<Navigate to="/staff" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </RequireAuth>
    );
}

export default App;
