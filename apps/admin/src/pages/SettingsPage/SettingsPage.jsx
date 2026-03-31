import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SettingsPage.css';

function SettingsPage() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    platformName: 'AWM Service',
    supportEmail: 'support@awm.local',
    notifyOnErrors: true,
    maintenanceMode: false,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>{t('admin.systemSettings')}</h1>
        <p className="page-subtitle">{t('admin.generalSettings')} / {t('admin.notificationSettings')}</p>
      </div>

      <div className="settings-card">
        <div className="settings-group">
          <h2>{t('admin.generalSettings')}</h2>

          <label className="field-label" htmlFor="platform-name">{t('common.platform')}</label>
          <input
            id="platform-name"
            className="text-input"
            value={form.platformName}
            onChange={(e) => handleChange('platformName', e.target.value)}
          />

          <label className="field-label" htmlFor="support-email">{t('common.email')}</label>
          <input
            id="support-email"
            className="text-input"
            value={form.supportEmail}
            onChange={(e) => handleChange('supportEmail', e.target.value)}
          />
        </div>

        <div className="settings-group">
          <h2>{t('admin.notificationSettings')}</h2>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.notifyOnErrors}
              onChange={(e) => handleChange('notifyOnErrors', e.target.checked)}
            />
            <span>{t('admin.notifyOnErrors')}</span>
          </label>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
            />
            <span>Maintenance mode</span>
          </label>
        </div>

        <div className="actions">
          <button className="btn-secondary">{t('common.cancel')}</button>
          <button className="btn-primary">{t('common.save')}</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
