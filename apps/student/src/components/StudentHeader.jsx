import React from 'react';
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
        name: user?.name || user?.login || 'Студент',
        role: t('roles.student'),
      }}
      userDropdownItems={null}
      onLogout={logout}
      notificationCount={0}
      actions={<LanguageSelector />}
    />
  );
}
