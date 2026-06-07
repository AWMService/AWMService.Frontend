import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../../components/DashboardLayout/DashboardLayout';
import SettingsPage from '../Settings/SettingsPage';
import EvaluationCriteriaPage from '../EvaluationCriteria/EvaluationCriteriaPage';
import CheckSettingsPage from '../CheckSettings/CheckSettingsPage';

export default function SettingsDashboard() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';

    const tabs = [
        { id: 'profile', label: t('department.departmentProfile') },
        { id: 'criteria', label: t('nav.evaluationCriteria') },
        { id: 'checks', label: t('nav.checks') },
    ];

    const handleTabChange = (id) => {
        setSearchParams({ tab: id });
    };

    return (
        <DashboardLayout
            title={t('auth.settings')}
            subtitle={t('department.settingsDescription')}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
        >
            {activeTab === 'profile' && <SettingsPage />}
            {activeTab === 'criteria' && <EvaluationCriteriaPage />}
            {activeTab === 'checks' && <CheckSettingsPage />}
        </DashboardLayout>
    );
}
