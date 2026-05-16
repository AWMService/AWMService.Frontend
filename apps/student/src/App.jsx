import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RequireAuth, ROLES } from '@awm/shared';
import { StudentLayout } from './pages/StudentLayout.jsx';
import ChooseThemePage from './pages/ChooseThemePage.jsx';
import MyApplicationsPage from './pages/MyApplicationsPage.jsx';
import DefenseStepPage from './pages/DefenseStepPage/DefenseStepPage.jsx';
import ReviewStepPage from './pages/ReviewStepPage/ReviewStepPage.jsx';
import AntiplagiarismPage from './pages/AntiplagiarismPage/AntiplagiarismPage.jsx';
import CritiquePage from './pages/CritiquePage/CritiquePage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import MyWorkPage from './pages/MyWorkPage/MyWorkPage.jsx';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage.jsx';
import documentCheckIcon from './assets/icons/document-check-icon.svg';
import codeIcon from './assets/icons/code-icon.svg';

function App() {
    const { t } = useTranslation();

    const normocontrolData = {
        pageTitle: t('student.normocontrol'),
        pageIcon: documentCheckIcon,
        expert: { name: 'Паленшеев П.П.', position: 'Старший преподаватель', degree: 'PhD' },
        initialStatus: 'failed',
    };

    const softwareCheckData = {
        pageTitle: t('student.softwareCheck'),
        pageIcon: codeIcon,
        expert: { name: 'Сидоров А.А.', position: 'Инженер-программист', degree: 'Магистр' },
        initialStatus: 'in_progress',
        route: 'software-check',
    };

    return (
        <RequireAuth allowedRoles={[ROLES.STUDENT]}>
            <Routes>
                <Route path="/" element={<StudentLayout />}>
                    <Route index element={<Navigate to="/choose-theme" replace />} />
                    <Route path="choose-theme" element={<ChooseThemePage />} />
                    <Route path="my-applications" element={<MyApplicationsPage />} />
                    <Route path="pre-defense-1" element={<DefenseStepPage />} />
                    <Route path="pre-defense-2" element={<DefenseStepPage />} />
                    <Route path="normocontrol" element={<ReviewStepPage {...normocontrolData} />} />
                    <Route path="software-check" element={<ReviewStepPage {...softwareCheckData} />} />
                    <Route path="antiplagiarism" element={<AntiplagiarismPage />} />
                    <Route path="critique" element={<CritiquePage />} />
                    <Route path="defense" element={<DefenseStepPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="my-work" element={<MyWorkPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/choose-theme" replace />} />
            </Routes>
        </RequireAuth>
    );
}

export default App;
