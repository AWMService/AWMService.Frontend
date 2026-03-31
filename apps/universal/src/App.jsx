import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider, UNIVERSAL_ROLES, useRole, ROLES, ProtectedRoute } from '@awm/shared';
import { UniversalHeader } from './components/Header/UniversalHeader';
import { UniversalSidebar } from './components/Sidebar/UniversalSidebar';
import STopicsPage from './pages/TopicsPage/STopicsPage.jsx';
import SDirectionsPage from './pages/DirectionsPage/SDirectionsPage.jsx';
import MyStudentsPage from './pages/MyStudentsPage/MyStudentsPage.jsx';
import SchedulePage from './pages/SchedulePage/SchedulePage.jsx';
import StudentList from './pages/StudentsList/StudentList.jsx';
import SecretaryStudentList from './pages/StudentsList/SecretaryStudent/SecretaryStudentList.jsx';
import AntiPlagiarismDashboard from './pages/AntiPlagiarismDashboard.jsx';
// Страницы для других ролей
import ReviewerWorksPage from './pages/ReviewerWorksPage/ReviewerWorksPage.jsx';
import NormocontrolPage from './pages/NormocontrolPage/NormocontrolPage.jsx';
import CommissionPage from './pages/CommissionPage/CommissionPage.jsx';
import './App.css';

function AppContent() {
    const { currentRole } = useRole();

    // Определяем дефолтный путь в зависимости от роли
    const getDefaultRoute = () => {
        switch (currentRole) {
            case ROLES.SUPERVISOR:
                return '/my-topics';
            case ROLES.REVIEWER:
                return '/reviews';
            case ROLES.NORMOCONTROL:
                return '/documents';
            case ROLES.CHAIRMAN:
            case ROLES.SECRETARY:
            case ROLES.COMMISSION_MEMBER:
                return '/schedule';
            default:
                return '/my-topics';
        }
    };

    return (
        <div className="app-container">
            <UniversalHeader />
            <div className="main-layout">
                <UniversalSidebar />
                <main className="content">
                    <Routes>
                        <Route index element={<Navigate to={getDefaultRoute()} replace />} />
                        
                        {/* Руководитель */}
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
                        
                        {/* Рецензент */}
                        <Route path="/reviews" element={
                            <ProtectedRoute allowedRoles={[ROLES.REVIEWER]} fallback="/">
                                <ReviewerWorksPage />
                            </ProtectedRoute>
                        } />
                        
                        {/* Нормоконтроль */}
                        <Route path="/documents" element={
                            <ProtectedRoute allowedRoles={[ROLES.NORMOCONTROL]} fallback="/">
                                <NormocontrolPage />
                            </ProtectedRoute>
                        } />
                        
                        {/* Комиссия (Председатель, Секретарь, Член комиссии) */}
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
                        <Route path="/secretary" element={
                            <ProtectedRoute allowedRoles={[ROLES.SECRETARY]} fallback="/">
                                <SecretaryStudentList />
                            </ProtectedRoute>
                        } />
                        <Route path="/commission" element={
                            <ProtectedRoute allowedRoles={[ROLES.CHAIRMAN, ROLES.SECRETARY, ROLES.COMMISSION_MEMBER]} fallback="/">
                                <CommissionPage />
                            </ProtectedRoute>
                        } />
                        
                        {/* Проверки */}
                        <Route path="/checks" element={
                            <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]} fallback="/">
                                <AntiPlagiarismDashboard />
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
        <RoleProvider 
            availableRoles={UNIVERSAL_ROLES} 
            defaultRole={ROLES.SUPERVISOR}
        >
            <AppContent />
        </RoleProvider>
    );
}

export default App;
