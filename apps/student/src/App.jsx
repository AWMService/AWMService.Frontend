import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RequireAuth, ROLES, useAuth, useMyApplications, useMyWorkProgress } from '@awm/shared';
import { StudentLayout } from './pages/StudentLayout.jsx';
import ChooseThemePage from './pages/ChooseThemePage.jsx';
import MyApplicationsPage from './pages/MyApplicationsPage.jsx';
import DefenseStepPage from './pages/DefenseStepPage/DefenseStepPage.jsx';
import MySchedulePage from './pages/MySchedulePage/MySchedulePage.jsx';
import ReviewStepPage from './pages/ReviewStepPage/ReviewStepPage.jsx';
import AntiplagiarismPage from './pages/AntiplagiarismPage/AntiplagiarismPage.jsx';
import CritiquePage from './pages/CritiquePage/CritiquePage.jsx';
import documentCheckIcon from './assets/icons/document-check-icon.svg';
import codeIcon from './assets/icons/code-icon.svg';

function RequireStudentWork({ children }) {
    const { user } = useAuth();
    const { data: myApplications = [] } = useMyApplications(user?.currentSemesterId);
    const { data: workProgress, isLoading } = useMyWorkProgress();

    if (isLoading) return null;

    const hasApprovedApplication = myApplications.some(a => a.status === 'approved');
    const hasWork = !!workProgress;

    
    
    if (hasApprovedApplication && !hasWork) {
        return <Navigate to="/choose-theme" replace />;
    }

    return children;
}

function App() {
    const { t } = useTranslation();

    const normocontrolData = {
        pageTitle: t('student.normocontrol'),
        pageIcon: documentCheckIcon,
        initialStatus: 'in_progress',
    };

    const softwareCheckData = {
        pageTitle: t('student.softwareCheck'),
        pageIcon: codeIcon,
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
                    <Route path="pre-defense-1" element={<RequireStudentWork><DefenseStepPage /></RequireStudentWork>} />
                    <Route path="pre-defense-2" element={<RequireStudentWork><DefenseStepPage /></RequireStudentWork>} />
                    <Route path="pre-defense-3" element={<RequireStudentWork><DefenseStepPage /></RequireStudentWork>} />
                    <Route path="normocontrol" element={<RequireStudentWork><ReviewStepPage {...normocontrolData} /></RequireStudentWork>} />
                    <Route path="software-check" element={<RequireStudentWork><ReviewStepPage {...softwareCheckData} /></RequireStudentWork>} />
                    <Route path="antiplagiarism" element={<RequireStudentWork><AntiplagiarismPage /></RequireStudentWork>} />
                    <Route path="critique" element={<RequireStudentWork><CritiquePage /></RequireStudentWork>} />
                    <Route path="defense" element={<RequireStudentWork><DefenseStepPage /></RequireStudentWork>} />
                    <Route path="my-schedule" element={<RequireStudentWork><MySchedulePage /></RequireStudentWork>} />
                </Route>
                <Route path="*" element={<Navigate to="/choose-theme" replace />} />
            </Routes>
        </RequireAuth>
    );
}

export default App;
