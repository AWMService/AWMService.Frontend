import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector, useAuth, SharedHeader } from '@awm/shared';

export function Header() {
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
      appLogoBox={t('roles.department').charAt(0)}
      appLogoBoxColor="#4f46e5"
      appTitle={t('roles.department')}
      appSubtitle={t('nav.dashboard')}
      pageTitle={getPageName()}
      userProfile={{
        name: user?.name || user?.login || 'Пользователь',
        role: t('roles.department'),
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
