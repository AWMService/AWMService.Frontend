import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  getIntlLocale,
  getLocalizedValue,
  normalizeLanguage,
  useAuth,
  useMyApplications,
  useWithdrawApplication,
} from '@awm/shared';
import './StudentPage.css';

const statusConfig = {
  pending: { key: 'student.pending', className: 'status-pending' },
  approved: { key: 'student.approved', className: 'status-approved' },
  rejected: { key: 'student.rejected', className: 'status-rejected' },
};

export default function MyApplicationsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const locale = getIntlLocale(i18n.language);
  const currentLanguage = normalizeLanguage(i18n.language);
  const { data: applications = [], isLoading, error } = useMyApplications(user?.currentAcademicYearId);
  const withdrawApplication = useWithdrawApplication();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(locale);
  };

  const handleCancel = async (id) => {
    await withdrawApplication.mutateAsync(id);
  };

  return (
    <div className="student-content-container">
      <div className="my-applications-header">
        <h2 className="my-applications-title">{t('student.myApplications')}</h2>
        <p className="my-applications-subtitle">{t('student.applicationStatus')}</p>
      </div>

      {isLoading ? (
        <div className="my-applications-empty">
          <p>{t('common.loading')}...</p>
        </div>
      ) : error ? (
        <div className="my-applications-empty">
          <p>{error.message}</p>
        </div>
      ) : applications.length === 0 ? (
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
                    <h3 className="my-app-card-title">{getLocalizedValue(app.topicTitle, currentLanguage)}</h3>
                    <p className="my-app-card-supervisor">
                      {t('student.scientificSupervisor')} {app.supervisorName || `#${app.supervisorId}`}
                    </p>
                    <p className="my-app-card-date">{formatDate(app.appliedAt)}</p>
                  </div>
                  <div className="my-app-card-actions">
                    <span className={`status-badge ${config.className}`}>
                      {t(config.key)}
                    </span>
                    {app.status === 'pending' && (
                      <button
                        className="cancel-button"
                        onClick={() => handleCancel(app.id)}
                        disabled={withdrawApplication.isPending}
                      >
                        {t('student.cancelApplication')}
                      </button>
                    )}
                  </div>
                </div>

                {app.status === 'approved' && app.reviewedAt && (
                  <div className="my-app-card-extra approved-info">
                    {t('student.approved')}: {formatDate(app.reviewedAt)}
                  </div>
                )}

                {app.status === 'rejected' && app.reviewComment && (
                  <div className="my-app-card-extra rejected-info">
                    {t('student.reason')} {app.reviewComment}
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
