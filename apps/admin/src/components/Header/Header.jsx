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
    if (path.includes('/users')) return t('admin.users');
    if (path.includes('/roles')) return t('nav.roles');
    if (path.includes('/work-types')) return t('admin.workTypesTitle');
    if (path.includes('/students')) return t('admin.studentsTitle');
    if (path.includes('/monitoring')) return t('nav.monitoring');
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
        name: user?.name || user?.login || 'Admin',
        role: t('roles.admin', 'Администратор'),
      }}
      onLogout={logout}
      notificationCount={3}
      actions={<LanguageSelector />}
    />
  );
}

export function Header() {
    return <AdminHeader />;
}
