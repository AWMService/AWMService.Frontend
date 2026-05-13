import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, getLocalizedValue, normalizeLanguage } from '@awm/shared';
import './StudentPage.css';

const initialApplications = [
  {
    id: '1',
    theme: {
      ru: 'Разработка веб-приложения для управления проектами',
      kk: 'Жобаларды басқаруға арналған веб-қосымшаны әзірлеу',
      en: 'Development of a project management web application',
    },
    supervisor: 'Петров А.В.',
    status: 'pending',
    date: '2026-03-15',
  },
  {
    id: '2',
    theme: {
      ru: 'Анализ данных с использованием машинного обучения',
      kk: 'Машиналық оқытуды қолдана отырып деректерді талдау',
      en: 'Data analysis using machine learning',
    },
    supervisor: 'Сидорова М.И.',
    status: 'approved',
    date: '2026-03-10',
    approvedDate: '2026-03-12',
  },
  {
    id: '3',
    theme: {
      ru: 'Мобильное приложение для учебного расписания',
      kk: 'Оқу кестесіне арналған мобильді қосымша',
      en: 'Mobile application for class scheduling',
    },
    supervisor: 'Козлов В.П.',
    status: 'rejected',
    date: '2026-03-08',
    rejectionReason: {
      ru: 'Тема не соответствует направлению кафедры',
      kk: 'Тақырып кафедра бағытына сәйкес келмейді',
      en: 'The topic does not match the department direction',
    },
  },
];

const statusConfig = {
  pending: { key: 'student.pending', className: 'status-pending' },
  approved: { key: 'student.approved', className: 'status-approved' },
  rejected: { key: 'student.rejected', className: 'status-rejected' },
};

export default function MyApplicationsPage() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const currentLanguage = normalizeLanguage(i18n.language);
  const [applications, setApplications] = useState(initialApplications);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(locale);
  };

  const handleCancel = (id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <div className="student-content-container">
      <div className="my-applications-header">
        <h2 className="my-applications-title">{t('student.myApplications')}</h2>
        <p className="my-applications-subtitle">{t('student.applicationStatus')}</p>
      </div>

      {applications.length === 0 ? (
        <div className="my-applications-empty">
          <p>{t('student.noApplications')}</p>
        </div>
      ) : (
        <div className="applications-list-container">
          {applications.map((app) => {
            const config = statusConfig[app.status] || statusConfig.pending;
            return (
              <div key={app.id} className="my-application-card">
                <div className="my-app-card-body">
                  <div className="my-app-card-content">
                    <h3 className="my-app-card-title">{getLocalizedValue(app.theme, currentLanguage)}</h3>
                    <p className="my-app-card-supervisor">
                      {t('student.scientificSupervisor')} {app.supervisor}
                    </p>
                    <p className="my-app-card-date">{formatDate(app.date)}</p>
                  </div>
                  <div className="my-app-card-actions">
                    <span className={`status-badge ${config.className}`}>
                      {t(config.key)}
                    </span>
                    {app.status === 'pending' && (
                      <button
                        className="cancel-button"
                        onClick={() => handleCancel(app.id)}
                      >
                        {t('student.cancelApplication')}
                      </button>
                    )}
                  </div>
                </div>

                {app.status === 'approved' && app.approvedDate && (
                  <div className="my-app-card-extra approved-info">
                    {t('student.approved')}: {formatDate(app.approvedDate)}
                  </div>
                )}

                {app.status === 'rejected' && app.rejectionReason && (
                  <div className="my-app-card-extra rejected-info">
                    {t('student.reason')} {getLocalizedValue(app.rejectionReason, currentLanguage)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
