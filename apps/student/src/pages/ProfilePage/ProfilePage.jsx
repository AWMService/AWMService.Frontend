import React from 'react';
import { useTranslation } from 'react-i18next';
import './ProfilePage.css';

const studentInfo = {
    fullName: 'Сергеев Николай Сергеевич',
    group: 'ИС-21-1',
    specialty: 'Информационные системы',
    course: 4,
    academicYear: '2025-2026',
    supervisor: 'Иванов И.И.',
    email: 'sergeev@university.kz',
};

const currentWork = {
    topic: 'Разработка системы управления процессами защиты ВКР',
    direction: 'Информационные технологии',
    workType: 'Дипломная работа',
    status: 'in_progress',
};

const workflowStages = [
    { key: 'chooseTheme', completed: true },
    { key: 'preDefense1', completed: true },
    { key: 'preDefense2', completed: false, inProgress: true },
    { key: 'normocontrol', completed: false, inProgress: false },
    { key: 'softwareCheck', completed: false },
    { key: 'antiplagiarism', completed: false },
    { key: 'critique', completed: false },
    { key: 'defense', completed: false },
];

export default function ProfilePage() {
    const { t } = useTranslation();

    const statusLabels = {
        in_progress: t('student.workStatusInProgress'),
        completed: t('student.workStatusCompleted'),
        not_started: t('student.workStatusNotStarted'),
    };

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
                            <span className="profile-info-value">{studentInfo.fullName}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.group')}</span>
                            <span className="profile-info-value">{studentInfo.group}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.specialty')}</span>
                            <span className="profile-info-value">{studentInfo.specialty}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.course')}</span>
                            <span className="profile-info-value">{studentInfo.course}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.academicYear')}</span>
                            <span className="profile-info-value">{studentInfo.academicYear}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.scientificSupervisor')}</span>
                            <span className="profile-info-value">{studentInfo.supervisor}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">Email</span>
                            <span className="profile-info-value">{studentInfo.email}</span>
                        </div>
                    </div>
                </div>

                {/* Current Work Card */}
                <div className="profile-card">
                    <h2 className="profile-card-title">{t('student.currentWork')}</h2>
                    <div className="profile-info-list">
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.thesisTitle')}</span>
                            <span className="profile-info-value">{currentWork.topic}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.directionLabel')}</span>
                            <span className="profile-info-value">{currentWork.direction}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.workTypeLabel')}</span>
                            <span className="profile-info-value">{currentWork.workType}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">{t('student.workStatus')}</span>
                            <span className="profile-info-value">
                                <span className="profile-status-badge status-in-progress">
                                    {statusLabels[currentWork.status]}
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
