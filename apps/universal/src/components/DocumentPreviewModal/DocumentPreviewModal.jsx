import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, FileText, Clock } from 'lucide-react';
import './DocumentPreviewModal.css';

const mockVersions = [
    { version: 1, date: '2025-04-20', size: '1.8 MB' },
    { version: 2, date: '2025-05-05', size: '2.1 MB' },
    { version: 3, date: '2025-05-15', size: '2.4 MB' },
];

export default function DocumentPreviewModal({ document, onClose }) {
    const { t } = useTranslation();

    if (!document) return null;

    const docName = `${document.studentName.replace(/\s/g, '_')}_${document.documentType}.docx`;
    const versions = mockVersions.slice(0, document.version);
    const currentVersion = versions[versions.length - 1];

    const handleDownload = () => {
        console.log('Download:', docName);
        alert(`${t('common.download')}: ${docName}`);
    };

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
                            <span className="dpm-info-label">{t('normocontrol.fileSize')}</span>
                            <span className="dpm-info-value">{currentVersion?.size || '—'}</span>
                        </div>
                        <div className="dpm-info-item">
                            <span className="dpm-info-label">{t('normocontrol.version')}</span>
                            <span className="dpm-info-value">v{document.version}</span>
                        </div>
                        <div className="dpm-info-item">
                            <span className="dpm-info-label">{t('normocontrol.uploadDate')}</span>
                            <span className="dpm-info-value">{document.submittedDate}</span>
                        </div>
                        <div className="dpm-info-item">
                            <span className="dpm-info-label">{t('normocontrol.documentType')}</span>
                            <span className="dpm-info-value">{document.documentType}</span>
                        </div>
                    </div>

                    <div className="dpm-section">
                        <h3 className="dpm-section-title">
                            <Clock size={16} />
                            {t('normocontrol.previousVersions')}
                        </h3>
                        <div className="dpm-versions-list">
                            {versions.map((v) => (
                                <div
                                    key={v.version}
                                    className={`dpm-version-item ${v.version === document.version ? 'current' : ''}`}
                                >
                                    <div>
                                        <span>v{v.version}</span>
                                        {v.version === document.version && (
                                            <span className="dpm-version-tag" style={{ marginLeft: 8 }}>
                                                {t('normocontrol.currentVersion')}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="dpm-version-date">{v.date} · {v.size}</span>
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
                    <button className="dpm-btn-primary" onClick={handleDownload}>
                        <Download size={16} />
                        {t('common.download')}
                    </button>
                </div>
            </div>
        </div>
    );
}
