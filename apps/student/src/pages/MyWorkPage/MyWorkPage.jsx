import React from 'react';
import { useTranslation } from 'react-i18next';
import './MyWorkPage.css';

const workDetails = {
    topicRu: 'Разработка системы управления процессами защиты ВКР',
    topicKz: 'ВКР қорғау процестерін басқару жүйесін әзірлеу',
    topicEn: 'Development of a thesis defense process management system',
    supervisor: 'Иванов И.И.',
    supervisorContacts: 'ivanov@university.kz',
    workType: 'Дипломная работа',
    direction: 'Информационные технологии',
    assignedDate: '2025-09-15',
};

const participants = [
    { name: 'Сергеев Николай Сергеевич', role: 'author', status: 'active' },
];

const materials = [
    { id: '1', name: 'пояснительная записка.pdf', size: '2.4 MB', date: '2026-03-25', icon: '📄' },
    { id: '2', name: 'презентация.pptx', size: '5.1 MB', date: '2026-03-20', icon: '📊' },
    { id: '3', name: 'исходный код.zip', size: '12.8 MB', date: '2026-03-18', icon: '📦' },
    { id: '4', name: 'README.md', size: '4 KB', date: '2026-03-18', icon: '📝' },
];

const timeline = [
    { id: '1', date: '2025-09-15', status: 'completed', titleKey: 'student.topicApproved', description: 'Тема утверждена кафедрой и научным руководителем.' },
    { id: '2', date: '2026-03-15', status: 'completed', titleKey: 'student.preDefense1Passed', description: 'Предзащита 1 пройдена с оценкой 65 баллов.' },
    { id: '3', date: '2026-03-28', status: 'in_progress', titleKey: 'student.normocontrolInProgress', description: 'Документы отправлены на нормоконтроль.' },
    { id: '4', date: '', status: 'pending', titleKey: 'student.antiplagiarismPending', description: 'Ожидает прохождения нормоконтроля.' },
];

function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function MyWorkPage() {
    const { t } = useTranslation();

    return (
        <div className="my-work-page">
            <h1 className="my-work-page-title">{t('student.myWorkTitle')}</h1>

            <div className="my-work-grid">
                {/* Work Details Card */}
                <div className="my-work-card">
                    <h2 className="my-work-card-title">{t('student.workDetails')}</h2>
                    <div className="my-work-info-list">
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.thesisTitle')} (RU)</span>
                            <span className="my-work-info-value">{workDetails.topicRu}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.thesisTitle')} (KZ)</span>
                            <span className="my-work-info-value">{workDetails.topicKz}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.thesisTitle')} (EN)</span>
                            <span className="my-work-info-value">{workDetails.topicEn}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.scientificSupervisor')}</span>
                            <span className="my-work-info-value">{workDetails.supervisor} ({workDetails.supervisorContacts})</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.workTypeLabel')}</span>
                            <span className="my-work-info-value">{workDetails.workType}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.directionLabel')}</span>
                            <span className="my-work-info-value">{workDetails.direction}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.assignedDate')}</span>
                            <span className="my-work-info-value">{formatDate(workDetails.assignedDate)}</span>
                        </div>
                    </div>
                </div>

                {/* Participants Card */}
                <div className="my-work-card">
                    <h2 className="my-work-card-title">{t('student.participants')}</h2>
                    <table className="my-work-participants-table">
                        <thead>
                            <tr>
                                <th>{t('student.fullName')}</th>
                                <th>{t('student.roleLabel')}</th>
                                <th>{t('student.workStatus')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((p, idx) => (
                                <tr key={idx}>
                                    <td>{p.name}</td>
                                    <td>{t('student.author')}</td>
                                    <td>
                                        <span className="my-work-participant-status active">
                                            {t('student.activeStatus')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Materials Card */}
            <div className="my-work-card my-work-materials-card">
                <h2 className="my-work-card-title">{t('student.materials')}</h2>
                <div className="my-work-file-list">
                    {materials.map((file) => (
                        <div key={file.id} className="my-work-file-item">
                            <span className="my-work-file-icon">{file.icon}</span>
                            <div className="my-work-file-info">
                                <span className="my-work-file-name">{file.name}</span>
                                <span className="my-work-file-meta">{file.size} · {formatDate(file.date)}</span>
                            </div>
                            <button className="my-work-download-btn">{t('student.downloadReview')}</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Work Status Timeline */}
            <div className="my-work-card my-work-timeline-card">
                <h2 className="my-work-card-title">{t('student.workTimeline')}</h2>
                <div className="my-work-timeline">
                    {timeline.map((item, idx) => (
                        <div key={item.id} className={`my-work-timeline-item status-${item.status}`}>
                            <div className="my-work-timeline-marker">
                                <div className={`my-work-timeline-dot ${item.status}`} />
                                {idx < timeline.length - 1 && <div className="my-work-timeline-line" />}
                            </div>
                            <div className="my-work-timeline-content">
                                <div className="my-work-timeline-header">
                                    <span className="my-work-timeline-title">{t(item.titleKey)}</span>
                                    <span className="my-work-timeline-date">{formatDate(item.date)}</span>
                                </div>
                                <p className="my-work-timeline-desc">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
