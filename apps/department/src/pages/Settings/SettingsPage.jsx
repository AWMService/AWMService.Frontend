import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SettingsPage.css';

const DEFAULT_SETTINGS = {
  departmentName: 'Программная инженерия',
  faculty: 'Институт автоматики и информационных технологий',
  headOfDepartment: 'Сыздыкова Заведующая Кафедрой',
  phone: '+7 (727) 123-45-67',
  email: 'head@university.edu',
  academicYear: '2025-2026',
  notifyNewDirections: true,
  notifyStudentApplications: true,
  notifyReviews: false,
  notifyEmail: false,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem('departmentSettings');
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
    localStorage.setItem('departmentSettings', JSON.stringify(form));
    setFeedback({ type: 'success', message: t('department.settingsSaved', 'Настройки сохранены') });
    alert(t('department.settingsSaved', 'Настройки сохранены'));
  };

  const handleCancel = () => {
    setForm(loadSettings());
    setFeedback(null);
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        {}
        <div className="settings-group">
          <h2>{t('department.departmentProfile')}</h2>

          <label className="field-label" htmlFor="dept-name">
            {t('department.departmentName')}
          </label>
          <input
            id="dept-name"
            className="text-input"
            value={form.departmentName}
            onChange={(e) => handleChange('departmentName', e.target.value)}
          />

          <label className="field-label" htmlFor="dept-faculty">
            {t('department.faculty')}
          </label>
          <input
            id="dept-faculty"
            className="text-input"
            value={form.faculty}
            onChange={(e) => handleChange('faculty', e.target.value)}
          />

          <label className="field-label" htmlFor="dept-head">
            {t('department.headOfDepartment')}
          </label>
          <input
            id="dept-head"
            className="text-input"
            value={form.headOfDepartment}
            onChange={(e) => handleChange('headOfDepartment', e.target.value)}
          />

          <label className="field-label" htmlFor="dept-phone">
            {t('common.phone')}
          </label>
          <input
            id="dept-phone"
            className="text-input"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />

          <label className="field-label" htmlFor="dept-email">
            {t('common.email')}
          </label>
          <input
            id="dept-email"
            className="text-input"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        {}
        <div className="settings-group">
          <h2>{t('department.academicYear')}</h2>

          <label className="field-label" htmlFor="dept-year">
            {t('department.academicYear')}
          </label>
          <select
            id="dept-year"
            className="text-input"
            value={form.academicYear}
            onChange={(e) => handleChange('academicYear', e.target.value)}
          >
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
          </select>
        </div>

        {}
        <div className="settings-group">
          <h2>{t('department.notificationSettings')}</h2>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.notifyNewDirections}
              onChange={(e) => handleChange('notifyNewDirections', e.target.checked)}
            />
            <span>{t('department.notifyNewDirections')}</span>
          </label>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.notifyStudentApplications}
              onChange={(e) => handleChange('notifyStudentApplications', e.target.checked)}
            />
            <span>{t('department.notifyStudentApplications')}</span>
          </label>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.notifyReviews}
              onChange={(e) => handleChange('notifyReviews', e.target.checked)}
            />
            <span>{t('department.notifyReviews')}</span>
          </label>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.notifyEmail}
              onChange={(e) => handleChange('notifyEmail', e.target.checked)}
            />
            <span>{t('department.notifyEmail')}</span>
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
