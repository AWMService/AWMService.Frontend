import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../../components/DashboardLayout/DashboardLayout';
import DirectionsAndThemes from '../DirectionsAndThemes/DirectionsAndThemes';
import TopicCoordinationPage from '../TopicCoordination/TopicCoordinationPage';

export default function TopicsDashboard() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'directions';

    const tabs = [
        { id: 'directions', label: t('department.directions') },
        { id: 'themes', label: t('supervisor.topics') },
        { id: 'coordination', label: t('nav.topicCoordination') },
    ];

    const handleTabChange = (id) => {
        setSearchParams({ tab: id });
    };

    return (
        <DashboardLayout
            title={t('nav.directionsTopics')}
            subtitle={t('department.directions')}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
        >
            {(activeTab === 'directions' || activeTab === 'themes') && <DirectionsAndThemes />}
            {activeTab === 'coordination' && <TopicCoordinationPage />}
        </DashboardLayout>
    );
}
