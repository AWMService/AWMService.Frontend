import React from 'react';
import { useTranslation } from 'react-i18next';

function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('auth.settings')}</h1>
    </div>
  );
}

export default SettingsPage;
