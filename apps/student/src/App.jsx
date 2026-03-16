import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StudentLayout } from './pages/StudentLayout.jsx';
import ChooseThemePage from './pages/ChooseThemePage.jsx';
import MyApplicationsPage from './pages/MyApplicationsPage.jsx';
import DefenseStepPage from './pages/DefenseStepPage/DefenseStepPage.jsx';
import ReviewStepPage from './pages/ReviewStepPage/ReviewStepPage.jsx';
import AntiplagiarismPage from './pages/AntiplagiarismPage/AntiplagiarismPage.jsx';
import CritiquePage from './pages/CritiquePage/CritiquePage.jsx';
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
    resultsType: 'defense',
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

function App() {
    return (
        <Routes>
            <Route path="/" element={<StudentLayout />}>
                <Route index element={<Navigate to="/choose-theme" replace />} />
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
            <Route path="*" element={<Navigate to="/choose-theme" replace />} />
        </Routes>
    );
}

export default App;
