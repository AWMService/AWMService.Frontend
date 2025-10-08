import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { HeaderSupervisor } from './components/Header/HeaderSupervisor';
import { SidebarSupervisor } from './components/Sidebar/SidebarSupervisor';
import SupervisorsPage from './pages/Department/Supervisors/SupervisorsPage.jsx';
import TimePeriodsPage from './pages/Department/TimePeriods/TimePeriodsPage.jsx';
import DirectionsPage from './pages/Department/Directions/DirectionsPage.jsx';
import ThemePage from './pages/Department/Theme/ThemesPage.jsx';
import SettingsPage from './pages/Department/Settings/SettingsPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import StudentPage from './pages/Students/StudentPage.jsx';
import './App.css';
import SDirectionsPage from "./pages/Supervisor/DirectionsPage/SDirectionsPage.jsx";
import STopicsPage from "./pages/Supervisor/TopicsPage/STopicsPage.jsx";
import MyStudentsPage from "./pages/Supervisor/MyStudentsPage/MyStudentsPage.jsx";

function App() {
    const location = useLocation();

    // Простые страницы (без хедера и сайдбара)
    const isSimplePage =
        location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/student';

    // Раздел кафедры
    const isDepartment = location.pathname.startsWith('/department');

    // Раздел руководителя (supervisors)
    const isSupervisor = location.pathname.startsWith('/supervisors');

    if (isSimplePage) {
        return (
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/student" element={<StudentPage />} />
            </Routes>
        );
    }

    if (isDepartment) {
        return (
            <div className="app-container">
                <Header />
                <div className="main-layout">
                    <Sidebar />
                    <main className="content">
                        <Routes>
                            <Route path="/department/supervisors" element={<SupervisorsPage />} />
                            <Route path="/department/time-periods" element={<TimePeriodsPage />} />
                            <Route path="/department/directions" element={<DirectionsPage />} />
                            <Route path="/department/topics" element={<ThemePage />} />
                            <Route path="/department/settings" element={<SettingsPage />} />
                        </Routes>
                    </main>
                </div>
            </div>
        );
    }

    if (isSupervisor) {
        return (
            <div className="app-container">
                <HeaderSupervisor />
                <div className="main-layout">
                    <SidebarSupervisor />
                    <main className="content">
                        <Routes>
                            <Route path="/supervisors/my-topics" element={<STopicsPage />} />
                            <Route path="/supervisors/directions" element={<SDirectionsPage />} />
                            <Route path="/supervisors/mystudents" element={<MyStudentsPage />} />
                        </Routes>
                    </main>
                </div>
            </div>
        );
    }

    // Любой другой путь → страница логина
    return (
        <Routes>
            <Route path="*" element={<LoginPage />} />
        </Routes>
    );
}

export default App;
