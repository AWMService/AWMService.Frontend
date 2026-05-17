import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector, useAuth, SharedHeader } from '@awm/shared';

export function AdminHeader() {
  const location = useLocation();
  const { t } = useTranslation();
  const { logout, user } = useAuth();

  const getPageName = () => {
    const path = location.pathname;
    if (path.includes('/supervisors')) return t('nav.supervisors');
    if (path.includes('/time-periods')) return t('nav.timePeriods');
    if (path.includes('/directions-topics')) return t('nav.directionsTopics');
    if (path.includes('/settings')) return t('auth.settings');
    return t('nav.dashboard');
  };

  return (
    <SharedHeader
      appLogoBox={t('roles.admin', 'А').charAt(0)}
      appLogoBoxColor="#4f46e5"
      appTitle={t('roles.admin', 'Администратор')}
      appSubtitle={t('nav.dashboard')}
      pageTitle={getPageName()}
      userProfile={{
        initials: 'А',
        name: user?.name || 'Admin',
        role: t('roles.admin', 'Администратор'),
      }}
      userDropdownItems={
        <div className="dropdown-item">{t('auth.profile')}</div>
      }
      onLogout={logout}
      notificationCount={3}
      actions={<LanguageSelector />}
    />
  );
}

export function Header() {
    return <AdminHeader />;
}
