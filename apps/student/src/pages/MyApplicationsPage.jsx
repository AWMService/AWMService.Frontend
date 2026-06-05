import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getLocalizedValue,
  normalizeLanguage,
  useAuth,
  useMyApplications,
  useWithdrawApplication,
} from '@awm/shared';
import { StudentThemeCard } from '../components/StudentThemeCard/StudentThemeCard';
import './StudentPage.css';

export default function MyApplicationsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const currentLanguage = normalizeLanguage(i18n.language);
  const { data: applications = [], isLoading, error } = useMyApplications(user?.currentSemesterId);
  const withdrawApplication = useWithdrawApplication();

  const isAlreadyAssigned = useMemo(() =>
    applications.some(a => a.status === 'approved'),
  [applications]);

  const handleCancel = async (id) => {
    await withdrawApplication.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="student-content-container">
        <div className="no-themes-message">{t('common.loading')}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-content-container">
        <div className="no-themes-message">{error.message}</div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="student-content-container">
        <div className="no-themes-message">{t('student.noApplications')}</div>
      </div>
    );
  }

  return (
    <div className="student-content-container">
      <div className="themes-list-container">
        {applications.map((app) => {
          const status = app.status === 'approved'
            ? 'approved'
            : app.status === 'rejected'
              ? 'rejected'
              : 'applied';

          const theme = {
            id: app.topicId,
            applicationId: app.id,
            title: getLocalizedValue(app.topicTitle, currentLanguage),
            description: app.motivationLetter || '',
            supervisor: app.supervisorName || `#${app.supervisorId}`,
            availableSlots: app.topicAvailableSpots ?? 0,
            direction: getLocalizedValue(app.directionTitle, currentLanguage) || t('common.noData'),
            workType: app.workTypeName || app.workTypeId,
            status,
            isAssigned: status === 'approved',
            rejectionReason: app.reviewComment,
          };

          return (
            <StudentThemeCard
              key={app.id}
              theme={theme}
              isAlreadyAssigned={isAlreadyAssigned}
              onApply={() => {}}
              onCancel={() => handleCancel(app.id)}
              onReapply={() => {}}
            />
          );
        })}
      </div>
    </div>
  );
}

