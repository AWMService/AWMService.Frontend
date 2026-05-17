import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, ROLES } from '@awm/shared';
import { AdminHeader } from './components/Header/Header';
import { AdminSidebar } from './components/Sidebar/Sidebar';
import UsersPage from './pages/UsersPage/UsersPage.jsx';
import RolesPage from './pages/RolesPage/RolesPage.jsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx';
import MonitoringPage from './pages/MonitoringPage/MonitoringPage.jsx';
import DepartmentsPage from './pages/DepartmentsPage/DepartmentsPage.jsx';
import InstitutesPage from './pages/InstitutesPage/InstitutesPage.jsx';
import EducationLevelsPage from './pages/EducationLevelsPage/EducationLevelsPage.jsx';
import ProgramsPage from './pages/ProgramsPage/ProgramsPage.jsx';
import WorkTypesPage from './pages/WorkTypesPage/WorkTypesPage.jsx';
import StudentsPage from './pages/StudentsPage/StudentsPage.jsx';
import './App.css';

function App() {
    return (
        <RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.VICE_RECTOR]}>
            <div className="app-container">
                <AdminHeader />
                <div className="main-layout">
                    <AdminSidebar />
                    <main className="content">
                        <Routes>
                            <Route index element={<Navigate to="/users" replace />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/roles" element={<RolesPage />} />
                            <Route path="/departments" element={<DepartmentsPage />} />
                            <Route path="/institutes" element={<InstitutesPage />} />
                            <Route path="/education-levels" element={<EducationLevelsPage />} />
                            <Route path="/programs" element={<ProgramsPage />} />
                            <Route path="/work-types" element={<WorkTypesPage />} />
                            <Route path="/students" element={<StudentsPage />} />
                            <Route path="/monitoring" element={<MonitoringPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="*" element={<Navigate to="/users" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </RequireAuth>
    );
}

export default App;
