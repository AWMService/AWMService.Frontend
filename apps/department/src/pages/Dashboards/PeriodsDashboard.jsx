import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../../components/DashboardLayout/DashboardLayout';
import InitialPeriodsPage from '../InitialPeriods/InitialPeriodsPage';
import TimePeriodsPage from '../TimePeriods/TimePeriodsPage';

export default function PeriodsDashboard() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'initial';

    const tabs = [
        { id: 'initial', label: t('nav.initialPeriods') },
        { id: 'defenses', label: t('nav.timePeriods') },
    ];

    const handleTabChange = (id) => {
        setSearchParams({ tab: id });
    };

    return (
        <DashboardLayout
            title={t('nav.timePeriods')}
            subtitle={t('department.timePeriods')}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
        >
            {activeTab === 'initial' && <InitialPeriodsPage />}
            {activeTab === 'defenses' && <TimePeriodsPage />}
        </DashboardLayout>
    );
}
