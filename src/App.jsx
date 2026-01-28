import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import { StudentLayout } from './pages/Students/StudentLayout.jsx';
import ChooseThemePage from './pages/Students/ChooseThemePage.jsx';
import MyApplicationsPage from './pages/Students/MyApplicationsPage.jsx';
import DefenseStepPage from './pages/Students/DefenseStepPage/DefenseStepPage.jsx';
import ReviewStepPage from './pages/Students/ReviewStepPage/ReviewStepPage.jsx';
import AntiplagiarismPage from './pages/Students/AntiplagiarismPage/AntiplagiarismPage.jsx';
import CritiquePage from './pages/Students/CritiquePage/CritiquePage.jsx';
import documentCheckIcon from './assets/icons/document-check-icon.svg';
import codeIcon from './assets/icons/code-icon.svg';

const normocontrolData = {
  pageTitle: 'Нормоконтроль',
  pageIcon: documentCheckIcon,
  expert: { name: 'Паленшеев П.П.', position: 'Старший преподаватель', degree: 'PhD' },
  initialStatus: 'failed',
};

const softwareCheckData = {
  pageTitle: 'Проверка ПО',
  pageIcon: codeIcon,
  expert: { name: 'Сидоров А.А.', position: 'Инженер-программист', degree: 'Магистр' },
  initialStatus: 'in_progress',
};
import './App.css';

const preDefense1Data = {
  pageTitle: 'Предзащита 1',
  schedule: {
    date: '2025-05-01',
    time: 'от 10:00',
    location: 'ГУК 723',
  },
  commission: [
    { name: 'Паленшеев П.П.', role: 'Председатель', degree: 'PhD', position: 'Старший Преподаватель' },
    { name: 'Паленов М.П.', role: 'Член Комиссии', degree: 'Магистр', position: 'Преподаватель' },
  ],
  infoText: 'Например: Презентация, черновик дипломной работы/дипломного проекта.',
  initialResults: null,
};

const preDefense2Data = {
  pageTitle: 'Предзащита 2',
  schedule: {
    date: '2025-05-21',
    time: 'от 10:00',
    location: 'ГУК 723',
  },
  commission: [
    { name: 'Паленшеев П.П.', role: 'Председатель', degree: 'PhD', position: 'Старший Преподаватель' },
    { name: 'Сидорова А.А.', role: 'Член Комиссии', degree: 'к.т.н.', position: 'Доцент' },
    { name: 'Паленбаев П.П.', role: 'Тех. Секретарь', degree: 'Магистр', position: 'Преподаватель' },
  ],
  infoText: 'Загрузите обновленные версии необходимых материалов.',
  initialResults: {
      finalScore: 85,
      readiness: 90,
      comments: "Все отлично, небольшие правки по оформлению."
  }
};

const defenseData = {
  pageTitle: 'Защита',
  resultsType: 'defense', // Add this to differentiate the results view
  schedule: {
    date: '2025-06-15',
    time: 'от 10:00',
    location: 'ГУК 723',
  },
  commission: [
    { name: 'Паленшеев П.П.', role: 'Председатель', degree: 'PhD', position: 'Старший Преподаватель' },
    { name: 'Иванов И.И.', role: 'Член Комиссии', degree: 'д.т.н.', position: 'Профессор' },
    { name: 'Петров П.П.', role: 'Член Комиссии', degree: 'к.т.н.', position: 'Доцент' },
    { name: 'Сидорова А.А.', role: 'Член Комиссии', degree: 'к.т.н.', position: 'Доцент' },
    { name: 'Паленбаев П.П.', role: 'Тех. Секретарь', degree: 'Магистр', position: 'Преподаватель' },
  ],
  infoText: 'Загрузите финальную версию Дипломной работы/проекта',
  initialResults: {
      finalGrade: 'A',
      commissionGrade: 95,
      comments: "Отличная работа и уверенная защита! Поздравляем!"
  }
};
import SDirectionsPage from "./pages/Supervisor/DirectionsPage/SDirectionsPage.jsx";
import STopicsPage from "./pages/Supervisor/TopicsPage/STopicsPage.jsx";
import MyStudentsPage from "./pages/Supervisor/MyStudentsPage/MyStudentsPage.jsx";

function App() {
    const location = useLocation();

    const isSimplePage = location.pathname === '/' || location.pathname === '/login';
    const isDepartment = location.pathname.startsWith('/department');
    const isSupervisor = location.pathname.startsWith('/supervisors');
    const isStudent = location.pathname.startsWith('/student');

    if (isSimplePage) {
        return (
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
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

    if (isStudent) {
        return (
            <Routes>
                <Route path="/student" element={<StudentLayout />}>
                    <Route index element={<Navigate to="/student/choose-theme" replace />} />
                    <Route path="choose-theme" element={<ChooseThemePage />} />
                    <Route path="my-applications" element={<MyApplicationsPage />} />
                    <Route path="pre-defense-1" element={<DefenseStepPage {...preDefense1Data} />} />
                    <Route path="pre-defense-2" element={<DefenseStepPage {...preDefense2Data} />} />
                    <Route path="normocontrol" element={<ReviewStepPage {...normocontrolData} />} />
                    <Route path="software-check" element={<ReviewStepPage {...softwareCheckData} />} />
                    <Route path="antiplagiarism" element={<AntiplagiarismPage />} />
                    <Route path="critique" element={<CritiquePage />} />
                    <Route path="defense" element={<DefenseStepPage {...defenseData} />} />
                </Route>
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="*" element={<LoginPage />} />
        </Routes>
    );
}

export default App;

