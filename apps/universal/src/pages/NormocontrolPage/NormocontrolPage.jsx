import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, getLocalizedValue, useAuth, usePendingChecks } from '@awm/shared';
import DocumentPreviewModal from '../../components/DocumentPreviewModal/DocumentPreviewModal';
import RemarksFormModal from '../../components/RemarksFormModal/RemarksFormModal';
import './NormocontrolPage.css';

// Mock data для документов на нормоконтроль
const initialDocuments = [
    {
        id: 1,
        studentName: 'Иванов А.А.',
        group: 'ИС-21',
        themeTitle: {
            ru: 'Разработка веб-приложения для управления задачами',
            kk: 'Тапсырмаларды басқаруға арналған веб-қосымша әзірлеу',
            en: 'Development of a web application for task management',
        },
        documentType: {
            ru: 'Пояснительная записка',
            kk: 'Түсіндірме жазба',
            en: 'Explanatory note',
        },
        submittedDate: '2025-05-15',
        status: 'pending',
        version: 2,
    },
    {
        id: 2,
        studentName: 'Сидорова М.В.',
        group: 'ИС-21',
        themeTitle: {
            ru: 'Мобильное приложение для учёта финансов',
            kk: 'Қаржыны есепке алуға арналған мобильді қосымша',
            en: 'Mobile application for financial tracking',
        },
        documentType: {
            ru: 'Пояснительная записка',
            kk: 'Түсіндірме жазба',
            en: 'Explanatory note',
        },
        submittedDate: '2025-05-14',
        status: 'revision',
        version: 1,
        remarks: 3,
    },
    {
        id: 3,
        studentName: 'Петренко О.И.',
        group: 'ИС-20',
        themeTitle: {
            ru: 'Система автоматизации документооборота',
            kk: 'Құжат айналымын автоматтандыру жүйесі',
            en: 'Document workflow automation system',
        },
        documentType: {
            ru: 'Пояснительная записка',
            kk: 'Түсіндірме жазба',
            en: 'Explanatory note',
        },
        submittedDate: '2025-05-10',
        status: 'approved',
        version: 3,
    },
];

function NormocontrolPage() {
    const { t } = useTranslation();
    const locale = getIntlLocale();
    const { user } = useAuth();
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.semesterId;
    const { data: pendingChecks = [] } = usePendingChecks(orgUnitId, semesterId, 'NormControl');

    const apiDocuments = useMemo(() => pendingChecks.map(check => ({
        id: check.id,
        workId: check.workId,
        studentName: `Work #${check.workId}`,
        group: '-',
        themeTitle: { ru: `Check #${check.id}`, kk: `Check #${check.id}`, en: `Check #${check.id}` },
        documentType: { ru: 'Документ', kk: 'Құжат', en: 'Document' },
        submittedDate: check.checkedAt || new Date().toISOString(),
        status: check.isPassed ? 'approved' : 'revision',
        version: check.attemptNumber || 1,
        remarks: check.comment ? 1 : 0,
    })), [pendingChecks]);

    const [activeTab, setActiveTab] = useState('pending');
    const [documents, setDocuments] = useState(initialDocuments);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [remarkOpen, setRemarkOpen] = useState(false);

    const displayDocuments = apiDocuments.length > 0 ? apiDocuments : documents;

    const openPreview = (doc) => {
        setSelectedDocument(doc);
        setPreviewOpen(true);
    };

    const openRemarkForm = (doc) => {
        setSelectedDocument(doc);
        setRemarkOpen(true);
    };

    const closeModals = () => {
        setPreviewOpen(false);
        setRemarkOpen(false);
        setSelectedDocument(null);
    };

    const handleRemarkSubmit = (remark) => {
        setDocuments((prev) =>
            prev.map((doc) =>
                doc.id === remark.documentId
                    ? { ...doc, status: 'revision', remarks: (doc.remarks || 0) + 1 }
                    : doc
            )
        );
        closeModals();
    };

    const handleApprove = (docId) => {
        setDocuments((prev) =>
            prev.map((doc) =>
                doc.id === docId ? { ...doc, status: 'approved' } : doc
            )
        );
    };

    const filteredDocs = displayDocuments.filter(doc => {
        if (activeTab === 'pending') return doc.status === 'pending';
        if (activeTab === 'revision') return doc.status === 'revision';
        if (activeTab === 'approved') return doc.status === 'approved';
        return true;
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: t('normocontrol.pendingCheck'), class: 'status-pending' },
            revision: { label: t('normocontrol.revision'), class: 'status-revision' },
            approved: { label: t('normocontrol.approved'), class: 'status-approved' },
        };
        return statusMap[status] || { label: status, class: '' };
    };

    const formatDate = (value) =>
        new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(value));

    return (
        <div className="normocontrol-page">
            <div className="page-header">
                <h1>{t('normocontrol.documentsCheck')}</h1>
                <p className="page-subtitle">
                    {t('normocontrol.pendingCheck')}: {displayDocuments.filter(d => d.status === 'pending').length}
                </p>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    {t('normocontrol.pendingCheck')} ({displayDocuments.filter(d => d.status === 'pending').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'revision' ? 'active' : ''}`}
                    onClick={() => setActiveTab('revision')}
                >
                    {t('normocontrol.revision')} ({displayDocuments.filter(d => d.status === 'revision').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('approved')}
                >
                    {t('normocontrol.checked')} ({displayDocuments.filter(d => d.status === 'approved').length})
                </button>
            </div>

            <div className="documents-list">
                {filteredDocs.map(doc => {
                    const statusBadge = getStatusBadge(doc.status);
                    return (
                        <div key={doc.id} className="document-card">
                            <div className="document-card-header">
                                <div className="student-info">
                                    <h3>{doc.studentName}</h3>
                                    <span className="group">{doc.group}</span>
                                </div>
                                <span className={`status-badge ${statusBadge.class}`}>
                                    {statusBadge.label}
                                </span>
                            </div>
                            
                            <p className="theme-title">{getLocalizedValue(doc.themeTitle)}</p>
                            
                            <div className="document-meta">
                                <span className="doc-type">{t('normocontrol.documentType')}</span>
                                <span className="version">v{doc.version}</span>
                            </div>

                            <div className="document-card-footer">
                                <span>{t('common.date')}: {formatDate(doc.submittedDate)}</span>
                                {doc.remarks && (
                                    <span className="remarks">
                                        {t('normocontrol.remarksCount', { count: doc.remarks })}
                                    </span>
                                )}
                            </div>

                            <div className="document-actions">
                                <button className="action-btn secondary" onClick={() => openPreview(doc)}>
                                    {t('common.view')}
                                </button>
                                {doc.status === 'pending' && (
                                    <>
                                        <button className="action-btn success" onClick={() => handleApprove(doc.id)}>
                                            {t('normocontrol.approved')}
                                        </button>
                                        <button className="action-btn warning" onClick={() => openRemarkForm(doc)}>
                                            {t('normocontrol.addRemark')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredDocs.length === 0 && (
                    <div className="empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                )}
            </div>
            {previewOpen && selectedDocument && (
                <DocumentPreviewModal
                    document={selectedDocument}
                    onClose={closeModals}
                />
            )}

            {remarkOpen && selectedDocument && (
                <RemarksFormModal
                    document={selectedDocument}
                    onClose={closeModals}
                    onSubmit={handleRemarkSubmit}
                />
            )}
        </div>
    );
}

export default NormocontrolPage;



