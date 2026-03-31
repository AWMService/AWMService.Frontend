import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './StudentPage.css';

const initialApplications = [
  {
    id: '1',
    theme: 'Разработка веб-приложения для управления проектами',
    supervisor: 'Петров А.В.',
    status: 'pending',
    date: '2026-03-15',
  },
  {
    id: '2',
    theme: 'Анализ данных с использованием машинного обучения',
    supervisor: 'Сидорова М.И.',
    status: 'approved',
    date: '2026-03-10',
    approvedDate: '2026-03-12',
  },
  {
    id: '3',
    theme: 'Мобильное приложение для учебного расписания',
    supervisor: 'Козлов В.П.',
    status: 'rejected',
    date: '2026-03-08',
    rejectionReason: 'Тема не соответствует направлению кафедры',
  },
];

const statusConfig = {
  pending: { key: 'student.pending', className: 'status-pending' },
  approved: { key: 'student.approved', className: 'status-approved' },
  rejected: { key: 'student.rejected', className: 'status-rejected' },
};

export default function MyApplicationsPage() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState(initialApplications);

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
                    <h3 className="my-app-card-title">{app.theme}</h3>
                    <p className="my-app-card-supervisor">
                      {t('student.scientificSupervisor')} {app.supervisor}
                    </p>
                    <p className="my-app-card-date">{app.date}</p>
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
                    {t('student.approved')}: {app.approvedDate}
                  </div>
                )}

                {app.status === 'rejected' && app.rejectionReason && (
                  <div className="my-app-card-extra rejected-info">
                    {t('student.reason')} {app.rejectionReason}
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
