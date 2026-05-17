import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector, useAuth, SharedHeader } from '@awm/shared';

export function StudentHeader() {
  const { t } = useTranslation();
  const { logout, user } = useAuth();

  return (
    <SharedHeader
      appLogoBox={t('roles.student').charAt(0)}
      appLogoBoxColor="#4f46e5"
      appTitle={t('roles.student')}
      appSubtitle={t('student.thesisTitle')}
      userProfile={{
        initials: 'СН',
        name: user?.name || 'Сергеев Н.С.',
        role: t('roles.student'),
      }}
      userDropdownItems={
        <>
            <Link to="/profile" className="dropdown-item">
                {t('student.profileTitle')}
            </Link>
            <Link to="/my-work" className="dropdown-item">
                {t('student.myWorkTitle')}
            </Link>
            <Link to="/notifications" className="dropdown-item">
                {t('student.notificationsTitle')}
            </Link>
        </>
      }
      onLogout={logout}
      notificationCount={0}
      actions={<LanguageSelector />}
    />
  );
}
