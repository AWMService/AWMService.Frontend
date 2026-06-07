import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../../components/DashboardLayout/DashboardLayout';
import DefenseReadinessPage from '../DefenseReadiness/DefenseReadinessPage';
import CommissionsPage from '../Commissions/CommissionsPage';
import StudentDistributionPage from '../StudentDistribution/StudentDistributionPage';
import ExpertAssignmentPage from '../ExpertAssignment/ExpertAssignmentPage';
import ReviewerAssignmentPage from '../ReviewerAssignment/ReviewerAssignmentPage';

export default function DefensesDashboard() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'readiness';

    const tabs = [
        { id: 'readiness', label: t('nav.defenseReadiness') },
        { id: 'commissions', label: t('nav.commissions') },
        { id: 'distribution', label: t('nav.studentDistribution') },
        { id: 'experts', label: t('nav.expertAssignment') },
        { id: 'reviewer-assignment', label: t('nav.reviewerAssignment') },
    ];

    const handleTabChange = (id) => {
        setSearchParams({ tab: id });
    };

    return (
        <DashboardLayout
            title={t('nav.defenseReadiness')}
            subtitle={t('department.defenseReadinessSubtitle')}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
        >
            {activeTab === 'readiness' && <DefenseReadinessPage />}
            {activeTab === 'commissions' && <CommissionsPage />}
            {activeTab === 'distribution' && <StudentDistributionPage />}
            {activeTab === 'experts' && <ExpertAssignmentPage />}
            {activeTab === 'reviewer-assignment' && <ReviewerAssignmentPage />}
        </DashboardLayout>
    );
}
