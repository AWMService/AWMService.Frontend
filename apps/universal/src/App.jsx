import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, RoleProvider, UNIVERSAL_ROLES, useRole, ROLES, ProtectedRoute } from '@awm/shared';
import { UniversalHeader } from './components/Header/UniversalHeader';
import { UniversalSidebar } from './components/Sidebar/UniversalSidebar';
import STopicsPage from './pages/TopicsPage/STopicsPage.jsx';
import SDirectionsPage from './pages/DirectionsPage/SDirectionsPage.jsx';
import MyStudentsPage from './pages/MyStudentsPage/MyStudentsPage.jsx';
import SchedulePage from './pages/SchedulePage/SchedulePage.jsx';
import StudentList from './pages/StudentsList/StudentList.jsx';
import SecretaryStudentList from './pages/StudentsList/SecretaryStudent/SecretaryStudentList.jsx';
import AntiPlagiarismDashboard from './pages/AntiPlagiarismDashboard.jsx';
import SoftwareCheckDashboard from './pages/SoftwareCheckDashboard/SoftwareCheckDashboard.jsx';

import ReviewerWorksPage from './pages/ReviewerWorksPage/ReviewerWorksPage.jsx';
import NormocontrolPage from './pages/NormocontrolPage/NormocontrolPage.jsx';
import CommissionPage from './pages/CommissionPage/CommissionPage.jsx';
import { NotificationsPage } from '@awm/shared';
import './App.css';

function AppContent() {
    const { currentRole, hasRole } = useRole();

    
    const getDefaultRoute = () => {
        if (currentRole === ROLES.SUPERVISOR) return '/my-topics';
        if (currentRole === ROLES.REVIEWER) return '/reviews';
        if (currentRole === ROLES.NORMOCONTROL) return '/documents';
        if (currentRole === ROLES.CHAIRMAN || currentRole === ROLES.SECRETARY || currentRole === ROLES.COMMISSION_MEMBER) return '/schedule';
        
        
        if (hasRole(ROLES.SUPERVISOR)) return '/my-topics';
        return '/my-topics';
    };

    return (
        <div className="app-container">
            <UniversalHeader />
            <div className="main-layout">
                <UniversalSidebar />
                <main className="content">
                    <Routes>
                        <Route index element={<Navigate to={getDefaultRoute()} replace />} />
                        
                        {}
                        <Route path="/my-topics" element={
                            <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]} fallback="/">
                                <STopicsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/directions" element={
                            <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]} fallback="/">
                                <SDirectionsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/mystudents" element={
                            <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]} fallback="/">
                                <MyStudentsPage />
                            </ProtectedRoute>
                        } />
                        
                        {}
                        <Route path="/reviews" element={
                            <ProtectedRoute allowedRoles={[ROLES.REVIEWER]} fallback="/">
                                <ReviewerWorksPage />
                            </ProtectedRoute>
                        } />
                        
                        {}
                        <Route path="/documents" element={
                            <ProtectedRoute allowedRoles={[ROLES.NORMOCONTROL]} fallback="/">
                                <NormocontrolPage />
                            </ProtectedRoute>
                        } />
                        
                        {}
                        <Route path="/schedule" element={
                            <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR, ROLES.CHAIRMAN, ROLES.SECRETARY, ROLES.COMMISSION_MEMBER]} fallback="/">
                                <SchedulePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/schedule/:commissionId" element={
                            <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR, ROLES.CHAIRMAN, ROLES.SECRETARY, ROLES.COMMISSION_MEMBER]} fallback="/">
                                <StudentList />
                            </ProtectedRoute>
                        } />
                        <Route path="/secretary/:commissionId" element={
                            <ProtectedRoute allowedRoles={[ROLES.SECRETARY]} fallback="/">
                                <SecretaryStudentList />
                            </ProtectedRoute>
                        } />
                        <Route path="/commission" element={
                            <ProtectedRoute allowedRoles={[ROLES.CHAIRMAN, ROLES.SECRETARY, ROLES.COMMISSION_MEMBER]} fallback="/">
                                <CommissionPage />
                            </ProtectedRoute>
                        } />
                        
                        {}
                        <Route path="/checks" element={
                            <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]} fallback="/">
                                <AntiPlagiarismDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/software-checks" element={
                            <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]} fallback="/">
                                <SoftwareCheckDashboard />
                            </ProtectedRoute>
                        } />
                        
                        {}
                        <Route path="/notifications" element={
                            <ProtectedRoute allowedRoles={UNIVERSAL_ROLES} fallback="/">
                                <NotificationsPage translationPrefix="department" />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

function App() {
    return (
        <RequireAuth allowedRoles={UNIVERSAL_ROLES}>
            <RoleProvider 
                availableRoles={UNIVERSAL_ROLES} 
                defaultRole={ROLES.SUPERVISOR}
            >
                <AppContent />
            </RoleProvider>
        </RequireAuth>
    );
}

export default App;
