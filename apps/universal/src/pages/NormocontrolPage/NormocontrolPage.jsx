import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, getLocalizedValue, useAuth, useAllExpertChecks, useCompleteQualityCheckMutation, uploadExpertDocument } from '@awm/shared';
import DocumentPreviewModal from '../../components/DocumentPreviewModal/DocumentPreviewModal';
import RemarksFormModal from '../../components/RemarksFormModal/RemarksFormModal';
import './NormocontrolPage.css';


const API_STATUS = { Pending: 0, Approved: 1, SentForRevision: 2 };

function mapStatus(apiStatus) {
    if (apiStatus === API_STATUS.Approved) return 'approved';
    if (apiStatus === API_STATUS.SentForRevision) return 'revision';
    return 'pending';
}

function NormocontrolPage() {
    const { t } = useTranslation();
    const locale = getIntlLocale();
    const { user } = useAuth();
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    
    const { data: allChecks = [] } = useAllExpertChecks(orgUnitId, semesterId, 'NormControl');
    const completeCheckMutation = useCompleteQualityCheckMutation();

    const displayDocuments = useMemo(() => allChecks.map(check => ({
        id: check.id,
        workId: check.workId,
        studentName: check.studentName || `Work #${check.workId}`,
        group: '-',
        themeTitle: {
            ru: check.topicTitle || `Check #${check.id}`,
            kk: check.topicTitle || `Check #${check.id}`,
            en: check.topicTitle || `Check #${check.id}`,
        },
        documentType: { ru: 'Документ', kk: 'Құжат', en: 'Document' },
        submittedDate: check.createdAt || new Date().toISOString(),
        status: mapStatus(check.status),
        version: check.attemptNumber || 1,
        remarks: check.comment ? 1 : 0,
    })), [allChecks]);

    const [activeTab, setActiveTab] = useState('pending');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [remarkOpen, setRemarkOpen] = useState(false);

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

    const handleRemarkSubmit = async (remark) => {
        const doc = displayDocuments.find(d => d.id === remark.documentId);
        if (!doc) return;

        let attachmentId = null;
        if (remark.file && doc.workId) {
            try {
                const uploaded = await uploadExpertDocument(doc.workId, doc.id, remark.file, 'Other');
                attachmentId = uploaded?.id ?? null;
            } catch (err) {
                console.error('Failed to upload expert document', err);
            }
        }

        try {
            await completeCheckMutation.mutateAsync({
                workId: doc.workId,
                checkId: doc.id,
                checkData: { isPassed: false, comment: remark.text, attachmentId },
            });
        } catch (err) {
            console.error('Failed to complete quality check', err);
        }
        closeModals();
    };

    const handleApprove = async (docId) => {
        const doc = displayDocuments.find(d => d.id === docId);
        if (!doc) return;
        try {
            await completeCheckMutation.mutateAsync({
                workId: doc.workId,
                checkId: doc.id,
                checkData: { isPassed: true },
            });
        } catch (err) {
            console.error('Failed to approve quality check', err);
        }
    };

    const filteredDocs = displayDocuments.filter(doc => {
        if (activeTab === 'pending')  return doc.status === 'pending';
        if (activeTab === 'revision') return doc.status === 'revision';
        if (activeTab === 'approved') return doc.status === 'approved';
        return true;
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            pending:  { label: t('normocontrol.pendingCheck'), class: 'status-pending' },
            revision: { label: t('normocontrol.revision'),     class: 'status-revision' },
            approved: { label: t('normocontrol.approved'),     class: 'status-approved' },
        };
        return statusMap[status] || { label: status, class: '' };
    };

    const formatDate = (value) =>
        new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(value));

    const pendingCount  = displayDocuments.filter(d => d.status === 'pending').length;
    const revisionCount = displayDocuments.filter(d => d.status === 'revision').length;
    const approvedCount = displayDocuments.filter(d => d.status === 'approved').length;

    return (
        <div className="normocontrol-page">
            <div className="page-header">
                <h1>{t('normocontrol.documentsCheck')}</h1>
                <p className="page-subtitle">
                    {t('normocontrol.pendingCheck')}: {pendingCount}
                </p>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    {t('normocontrol.pendingCheck')} ({pendingCount})
                </button>
                <button
                    className={`tab ${activeTab === 'revision' ? 'active' : ''}`}
                    onClick={() => setActiveTab('revision')}
                >
                    {t('normocontrol.revision')} ({revisionCount})
                </button>
                <button
                    className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('approved')}
                >
                    {t('normocontrol.checked')} ({approvedCount})
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
                                {doc.remarks > 0 && (
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
                                        <button
                                            className="action-btn success"
                                            onClick={() => handleApprove(doc.id)}
                                            disabled={completeCheckMutation.isPending}
                                        >
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
