import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../../components/DashboardLayout/DashboardLayout';
import EmployeesPage from '../Employees/EmployeesPage';
import ReviewersPage from '../Reviewers/ReviewersPage';

export default function StaffDashboard() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'employees';

    const tabs = [
        { id: 'employees', label: t('nav.employees') },
        { id: 'reviewers', label: t('reviewer.reviewers') },
    ];

    const handleTabChange = (id) => {
        setSearchParams({ tab: id });
    };

    return (
        <DashboardLayout
            title={t('nav.employees')}
            subtitle={t('department.employees')}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
        >
            {activeTab === 'employees' && <EmployeesPage />}
            {activeTab === 'reviewers' && <ReviewersPage />}
        </DashboardLayout>
    );
}
