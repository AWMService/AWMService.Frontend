import React from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, getLocalizedValue, normalizeLanguage, useMyWorkProgress } from '@awm/shared';
import './MyWorkPage.css';

function formatDate(dateString, locale) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getFileIcon(fileName) {
    if (!fileName) return '📄';
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'pdf': return '📄';
        case 'pptx':
        case 'ppt': return '📊';
        case 'zip':
        case 'rar': return '📦';
        case 'md':
        case 'txt': return '📝';
        case 'docx':
        case 'doc': return '📝';
        default: return '📄';
    }
}

export default function MyWorkPage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const currentLanguage = normalizeLanguage(i18n.language);

    const { data: work, isLoading, error } = useMyWorkProgress();

    if (isLoading) {
        return (
            <div className="my-work-page">
                <h1 className="my-work-page-title">{t('student.myWorkTitle')}</h1>
                <div className="my-work-loading">{t('common.loading')}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-work-page">
                <h1 className="my-work-page-title">{t('student.myWorkTitle')}</h1>
                <div className="my-work-error">{t('common.errorLoading')}</div>
            </div>
        );
    }

    if (!work) {
        return (
            <div className="my-work-page">
                <h1 className="my-work-page-title">{t('student.myWorkTitle')}</h1>
                <div className="my-work-empty">{t('student.noWorkYet')}</div>
            </div>
        );
    }

    const topicTitle = work.topicTitle || {};
    const directionTitle = work.directionTitle || {};
    const workTypeValue = work.workTypeName || '';

    const participants = work.participants || [];
    const attachments = work.attachments || [];
    const timeline = work.timeline || [];

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
                            <span className="my-work-info-value">{topicTitle.ru || '—'}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.thesisTitle')} (KZ)</span>
                            <span className="my-work-info-value">{topicTitle.kk || '—'}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.thesisTitle')} (EN)</span>
                            <span className="my-work-info-value">{topicTitle.en || '—'}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.scientificSupervisor')}</span>
                            <span className="my-work-info-value">
                                {work.supervisorName || '—'}
                                {work.supervisorContacts ? ` (${work.supervisorContacts})` : ''}
                            </span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.workTypeLabel')}</span>
                            <span className="my-work-info-value">{workTypeValue}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.directionLabel')}</span>
                            <span className="my-work-info-value">{getLocalizedValue(directionTitle, currentLanguage)}</span>
                        </div>
                        <div className="my-work-info-row">
                            <span className="my-work-info-label">{t('student.assignedDate')}</span>
                            <span className="my-work-info-value">{formatDate(work.createdAt, locale)}</span>
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
                            {participants.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="my-work-empty-cell">{t('student.noParticipants')}</td>
                                </tr>
                            )}
                            {participants.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.name || '—'}</td>
                                    <td>{p.role}</td>
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
                    {attachments.length === 0 && (
                        <div className="my-work-empty">{t('student.noMaterials')}</div>
                    )}
                    {attachments.map((file) => (
                        <div key={file.id} className="my-work-file-item">
                            <span className="my-work-file-icon">{getFileIcon(file.fileName)}</span>
                            <div className="my-work-file-info">
                                <span className="my-work-file-name">{file.fileName}</span>
                                <span className="my-work-file-meta">{file.attachmentType} · {formatDate(file.createdAt, locale)}</span>
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
                    {timeline.length === 0 && (
                        <div className="my-work-empty">{t('student.noTimeline')}</div>
                    )}
                    {timeline.map((item, idx) => (
                        <div key={item.id} className={`my-work-timeline-item status-${item.status}`}>
                            <div className="my-work-timeline-marker">
                                <div className={`my-work-timeline-dot ${item.status}`} />
                                {idx < timeline.length - 1 && <div className="my-work-timeline-line" />}
                            </div>
                            <div className="my-work-timeline-content">
                                <div className="my-work-timeline-header">
                                    <span className="my-work-timeline-title">{item.title}</span>
                                    <span className="my-work-timeline-date">{formatDate(item.date, locale)}</span>
                                </div>
                                <p className="my-work-timeline-desc">{item.description || ''}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
