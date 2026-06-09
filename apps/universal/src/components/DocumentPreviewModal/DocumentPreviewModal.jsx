import React from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, getLocalizedValue, useAttachments, useQualityChecks, downloadAttachment } from '@awm/shared';
import { X, Download, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import './DocumentPreviewModal.css';

export default function DocumentPreviewModal({ document, onClose }) {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);

    
    const { data: attachments = [] } = useAttachments(document?.workId);
    const { data: checks = [] } = useQualityChecks(document?.workId);

    if (!document) return null;

    
    const latestAttachment = attachments
        .slice()
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];

    const documentType = getLocalizedValue(document.documentType, i18n.language) || 'document';
    const docName = latestAttachment?.fileName
        || `${document.studentName.replace(/\s/g, '_')}_${documentType}.docx`;

    
    const checkHistory = checks
        .filter(c => c.checkTypeName === 'NormControl' || c.checkType === 'NormControl')
        .sort((a, b) => a.attemptNumber - b.attemptNumber)
        .map(c => ({
            version:   c.attemptNumber,
            date:      c.createdAt,
            isPassed:  c.isPassed,
            comment:   c.comment,
        }));

    
    const versions = checkHistory.length > 0
        ? checkHistory
        : [{ version: document.version, date: document.submittedDate, isPassed: null, comment: null }];

    const currentVersion = versions[versions.length - 1];

    const formatDate = (value) =>
        new Date(value).toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    const handleDownload = () => {
        if (latestAttachment) {
            downloadAttachment(document.workId, latestAttachment.id, docName);
        }
    };

    const canDownload = !!latestAttachment;

    return (
        <div className="dpm-overlay" onClick={onClose}>
            <div className="dpm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="dpm-header">
                    <div className="dpm-header-text">
                        <h2>{t('normocontrol.documentPreview')}</h2>
                        <p>{document.studentName} — {document.group}</p>
                    </div>
                    <button className="dpm-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="dpm-body">
                    <div className="dpm-info-grid">
                        <div className="dpm-info-item full-width">
                            <span className="dpm-info-label">
                                <FileText size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                {t('normocontrol.fileName')}
                            </span>
                            <span className="dpm-info-value">{docName}</span>
                        </div>
                        <div className="dpm-info-item">
                            <span className="dpm-info-label">{t('normocontrol.version')}</span>
                            <span className="dpm-info-value">v{currentVersion?.version ?? document.version}</span>
                        </div>
                        <div className="dpm-info-item">
                            <span className="dpm-info-label">{t('normocontrol.uploadDate')}</span>
                            <span className="dpm-info-value">{formatDate(document.submittedDate)}</span>
                        </div>
                        <div className="dpm-info-item">
                            <span className="dpm-info-label">{t('normocontrol.documentType')}</span>
                            <span className="dpm-info-value">{documentType}</span>
                        </div>
                        {latestAttachment && (
                            <div className="dpm-info-item">
                                <span className="dpm-info-label">{t('normocontrol.fileSize')}</span>
                                <span className="dpm-info-value">
                                    {latestAttachment.fileSizeBytes
                                        ? `${(latestAttachment.fileSizeBytes / 1024 / 1024).toFixed(1)} MB`
                                        : '—'}
                                </span>
                            </div>
                        )}
                    </div>

                    {}
                    <div className="dpm-section">
                        <h3 className="dpm-section-title">
                            <Clock size={16} />
                            {t('normocontrol.previousVersions')}
                        </h3>
                        <div className="dpm-versions-list">
                            {versions.map((v) => (
                                <div
                                    key={v.version}
                                    className={`dpm-version-item ${v.version === (currentVersion?.version ?? document.version) ? 'current' : ''}`}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span>v{v.version}</span>
                                        {v.isPassed === true && (
                                            <CheckCircle size={14} color="#059669" title={t('normocontrol.approved')} />
                                        )}
                                        {v.isPassed === false && (
                                            <XCircle size={14} color="#DC2626" title={t('normocontrol.revision')} />
                                        )}
                                        {v.version === (currentVersion?.version ?? document.version) && (
                                            <span className="dpm-version-tag" style={{ marginLeft: 4 }}>
                                                {t('normocontrol.currentVersion')}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="dpm-version-date">{formatDate(v.date)}</span>
                                        {v.comment && (
                                            <span className="dpm-version-comment" style={{ marginLeft: 8, fontSize: '0.8em', color: '#6B7280' }}>
                                                {v.comment.length > 60 ? `${v.comment.slice(0, 60)}…` : v.comment}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dpm-footer">
                    <button className="dpm-btn-secondary" onClick={onClose}>
                        {t('common.close')}
                    </button>
                    <button
                        className="dpm-btn-primary"
                        onClick={handleDownload}
                        disabled={!canDownload}
                        title={canDownload ? undefined : t('common.noData')}
                    >
                        <Download size={16} />
                        {t('common.download')}
                    </button>
                </div>
            </div>
        </div>
    );
}
