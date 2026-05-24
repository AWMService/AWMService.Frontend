import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth, useMyWorkProgress, getLocalizedText } from '@awm/shared';
import './ProfilePage.css';

export default function ProfilePage() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const { data: work, isLoading } = useMyWorkProgress();

    const currentLang = i18n.language || 'ru';

    // Calculate student details dynamically
    const fullName = user?.name || '—';
    const email = user?.email || '—';
    const course = work?.course || '—';
    const group = work?.groupName || '—';
    const specialty = work?.specialityName || '—';
    const academicYear = work?.academicYear || '—';
    const supervisor = work?.supervisorName || '—';

    const hasWork = !!work;

    const topic = work?.topicTitle ? getLocalizedText(work, 'topicTitle', currentLang) : '—';
    const direction = work?.directionTitle ? getLocalizedText(work, 'directionTitle', currentLang) : '—';
    const workType = work?.workTypeName || '—';
    const status = work?.status || 'not_started';

    const statusLabels = {
        in_progress: t('student.workStatusInProgress', 'В процессе'),
        completed: t('student.workStatusCompleted', 'Завершено'),
        not_started: t('student.workStatusNotStarted', 'Не начато'),
    };

    const workflowStages = [
        { key: 'chooseTheme', completed: hasWork },
        { key: 'preDefense1', completed: work?.hasPassedPreDefense1 || false, inProgress: hasWork && !work?.hasPassedPreDefense1 },
        { key: 'preDefense2', completed: work?.hasPassedPreDefense2 || false, inProgress: work?.hasPassedPreDefense1 && !work?.hasPassedPreDefense2 },
        { key: 'normocontrol', completed: work?.hasPassedNormocontrol || false, inProgress: work?.hasPassedPreDefense2 && !work?.hasPassedNormocontrol },
        { key: 'softwareCheck', completed: work?.hasPassedSoftwareCheck || false },
        { key: 'antiplagiarism', completed: work?.hasPassedAntiplagiarism || false },
        { key: 'critique', completed: work?.hasPassedCritique || false },
        { key: 'defense', completed: work?.isDefended || false },
    ];

    if (isLoading) {
        return (
            <div className="profile-page">
                <h1 className="profile-page-title">{t('student.profileTitle')}</h1>
                <div className="profile-loading">{t('common.loading', 'Загрузка...')}</div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <h1 className="profile-page-title">{t('student.profileTitle')}</h1>

            <div className="profile-cards-grid">
                {/* Student Info Card */}
                <div className="profile-card">
                    <h2 className="profile-card-title">{t('student.studentInfo')}</h2>
                    <div className="profile-info-list">
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.fullName')}</span>
                            <span className="profile-info-value">{fullName}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.group')}</span>
                            <span className="profile-info-value">{group}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.specialty')}</span>
                            <span className="profile-info-value">{specialty}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.course')}</span>
                            <span className="profile-info-value">{course}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.academicYear')}</span>
                            <span className="profile-info-value">{academicYear}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.scientificSupervisor')}</span>
                            <span className="profile-info-value">{supervisor}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">Email</span>
                            <span className="profile-info-value">{email}</span>
                        </div>
                    </div>
                </div>

                {/* Current Work Card */}
                <div className="profile-card">
                    <h2 className="profile-card-title">{t('student.currentWork')}</h2>
                    <div className="profile-info-list">
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.thesisTitle')}</span>
                            <span className="profile-info-value">{topic}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.directionLabel')}</span>
                            <span className="profile-info-value">{direction}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.workTypeLabel')}</span>
                            <span className="profile-info-value">{workType}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.workStatus')}</span>
                            <span className="profile-info-value">
                                <span className={`profile-status-badge status-${status}`}>
                                    {statusLabels[status] || statusLabels.not_started}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Summary Card */}
            <div className="profile-card profile-progress-card">
                <h2 className="profile-card-title">{t('student.progressSummary')}</h2>
                <div className="profile-checklist">
                    {workflowStages.map((stage) => (
                        <div key={stage.key} className="profile-checklist-item">
                            <span className={`profile-checklist-icon ${stage.completed ? 'completed' : stage.inProgress ? 'in-progress' : 'pending'}`}>
                                {stage.completed ? '✅' : stage.inProgress ? '⏳' : '❌'}
                            </span>
                            <span className={`profile-checklist-text ${stage.completed ? 'completed' : ''}`}>
                                {t(`student.${stage.key}`)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
