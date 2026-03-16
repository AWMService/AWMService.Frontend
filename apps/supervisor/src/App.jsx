import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HeaderSupervisor } from './components/Header/HeaderSupervisor';
import { SidebarSupervisor } from './components/Sidebar/SidebarSupervisor';
import STopicsPage from './pages/TopicsPage/STopicsPage.jsx';
import SDirectionsPage from './pages/DirectionsPage/SDirectionsPage.jsx';
import MyStudentsPage from './pages/MyStudentsPage/MyStudentsPage.jsx';
import SchedulePage from './pages/SchedulePage/SchedulePage.jsx';
import StudentList from './pages/StudentsList/StudentList.jsx';
import SecretaryStudentList from './pages/StudentsList/SecretaryStudent/SecretaryStudentList.jsx';
import AntiPlagiarismDashboard from './pages/AntiPlagiarismDashboard.jsx';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <HeaderSupervisor />
            <div className="main-layout">
                <SidebarSupervisor />
                <main className="content">
                    <Routes>
                        <Route index element={<Navigate to="/my-topics" replace />} />
                        <Route path="/my-topics" element={<STopicsPage />} />
                        <Route path="/directions" element={<SDirectionsPage />} />
                        <Route path="/mystudents" element={<MyStudentsPage />} />
                        <Route path="/schedule" element={<SchedulePage />} />
                        <Route path="/schedule/:commissionId" element={<StudentList />} />
                        <Route path="/secretary" element={<SecretaryStudentList />} />
                        <Route path="/checks" element={<AntiPlagiarismDashboard />} />
                        <Route path="*" element={<Navigate to="/my-topics" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
