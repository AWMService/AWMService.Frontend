import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, ROLES } from '@awm/shared';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import SupervisorsPage from './pages/Supervisors/SupervisorsPage.jsx';
import TimePeriodsPage from './pages/TimePeriods/TimePeriodsPage.jsx';
import SettingsPage from './pages/Settings/SettingsPage.jsx';
import TimePeriodSetupPage from './pages/TimePeriods/TimePeriodsSetupPage/TimePeriodSetupPage.jsx';
import DirectionsAndThemes from './pages/DirectionsAndThemes/DirectionsAndThemes.jsx';
import TimePeriodSchedulePage from './pages/TimePeriods/TimePeriodSchedulePage.jsx';
import InitialPeriodsPage from './pages/InitialPeriods/InitialPeriodsPage.jsx';
import TopicCoordinationPage from './pages/TopicCoordination/TopicCoordinationPage.jsx';
import { NotificationsPage } from '@awm/shared';
import CommissionsPage from './pages/Commissions/CommissionsPage.jsx';
import StudentDistributionPage from './pages/StudentDistribution/StudentDistributionPage.jsx';
import ExpertAssignmentPage from './pages/ExpertAssignment/ExpertAssignmentPage.jsx';
import CheckSettingsPage from './pages/CheckSettings/CheckSettingsPage.jsx';
import DefenseReadinessPage from './pages/DefenseReadiness/DefenseReadinessPage.jsx';
import EvaluationCriteriaPage from './pages/EvaluationCriteria/EvaluationCriteriaPage.jsx';
import ReviewersPage from './pages/Reviewers/ReviewersPage.jsx';
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
                            <Route index element={<Navigate to="/supervisors" replace />} />
                            <Route path="/supervisors" element={<SupervisorsPage />} />
                            <Route path="/time-periods" element={<TimePeriodsPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/time-periods/:id/setup" element={<TimePeriodSetupPage />} />
                            <Route path="/initial-periods" element={<InitialPeriodsPage />} />
                            <Route path="/directions-topics" element={<DirectionsAndThemes />} />
                            <Route path="/topic-coordination" element={<TopicCoordinationPage />} />
                            <Route path="/time-periods/:id/schedule" element={<TimePeriodSchedulePage />} />
                            <Route path="/notifications" element={<NotificationsPage translationPrefix="department" />} />
                            <Route path="/commissions" element={<CommissionsPage />} />
                            <Route path="/evaluation-criteria" element={<EvaluationCriteriaPage />} />
                            <Route path="/student-distribution" element={<StudentDistributionPage />} />
                            <Route path="/expert-assignment" element={<ExpertAssignmentPage />} />
                            <Route path="/check-settings" element={<CheckSettingsPage />} />
                            <Route path="/defense-readiness" element={<DefenseReadinessPage />} />
                            <Route path="/reviewers" element={<ReviewersPage />} />
                            <Route path="*" element={<Navigate to="/supervisors" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </RequireAuth>
    );
}

export default App;
