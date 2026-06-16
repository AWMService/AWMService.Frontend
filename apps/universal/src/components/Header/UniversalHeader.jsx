import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector, useAuth, useRole, SharedHeader } from '@awm/shared';

export function UniversalHeader() {
    const location = useLocation();
    const { t } = useTranslation();
    const { roleMeta } = useRole();
    const { logout, user } = useAuth();

    const getPageName = () => {
        const path = location.pathname;
        if (path.includes('/my-topics')) return t('nav.myTopics');
        if (path.includes('/directions')) return t('nav.directions');
        if (path.includes('/mystudents')) return t('nav.myStudents');
        if (path.includes('/reviews')) return t('reviewer.assignedWorks');
        if (path.includes('/documents')) return t('normocontrol.documentsCheck');
        if (path.includes('/schedule')) return t('commission.schedule');
        if (path.includes('/commission')) return t('commission.commissions');
        if (path.includes('/checks')) return t('nav.checks');
        return t('nav.dashboard');
    };

    return (
        <SharedHeader
            appLogoBox={t(roleMeta?.labelKey || 'roles.supervisor').charAt(0)}
            appLogoBoxColor={roleMeta?.color || '#6366f1'}
            appTitle={t(roleMeta?.labelKey || 'roles.supervisor')}
            appSubtitle={t('nav.dashboard')}
            pageTitle={getPageName()}
            userProfile={{
                name: user?.name || user?.login || 'Пользователь',
                role: t(roleMeta?.labelKey || 'roles.supervisor'),
            }}
            userDropdownItems={
                <div className="dropdown-item">{t('auth.profile')}</div>
            }
            onLogout={logout}
            notificationCount={2}
            actions={
                <>
                    <LanguageSelector />
                </>
            }
        />
    );
}
