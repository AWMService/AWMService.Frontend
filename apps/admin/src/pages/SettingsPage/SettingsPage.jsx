import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SettingsPage.css';

const DEFAULT_SETTINGS = {
  platformName: 'AWM Service',
  supportEmail: 'support@awm.local',
  notifyOnErrors: true,
  maintenanceMode: false,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem('adminSettings');
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function SettingsPage() {
  const { t } = useTranslation();

  const [form, setForm] = useState(loadSettings);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  };

  const handleSave = () => {
    if (!form.platformName.trim() || !form.supportEmail.trim()) {
      setFeedback({ type: 'error', message: t('common.requiredFields') });
      return;
    }
    localStorage.setItem('adminSettings', JSON.stringify(form));
    setFeedback({ type: 'success', message: t('common.saved') });
  };

  const handleCancel = () => {
    setForm(loadSettings());
    setFeedback(null);
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
            <span>{t('admin.maintenanceMode')}</span>
          </label>
        </div>

        {feedback && (
          <p className={`feedback feedback-${feedback.type}`}>{feedback.message}</p>
        )}

        <div className="actions">
          <button className="btn-secondary" onClick={handleCancel}>{t('common.cancel')}</button>
          <button className="btn-primary" onClick={handleSave}>{t('common.save')}</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
