import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    getIntlLocale,
    useAuth,
    usePendingChecks,
    useCompleteQualityCheckMutation,
    downloadAttachment,
} from '@awm/shared';
import './SoftwareCheckDashboard.css';

const SoftwareCheckDashboard = () => {
    const { t } = useTranslation();
    const locale = getIntlLocale();
    const { user } = useAuth();
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: allChecks = [] } = useAllExpertChecks(orgUnitId, semesterId, 'SoftwareCheck');
    const completeMutation = useCompleteQualityCheckMutation();

    const [activeTab, setActiveTab] = useState('pending');

    // Per-card inline rejection state
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectComment, setRejectComment] = useState('');
    const [submitting, setSubmitting] = useState({});

    const displayDocuments = useMemo(() => allChecks.map(check => {
        let status = 'pending';
        if (check.status === 1) status = 'passed';
        if (check.status === 2) status = 'failed';
        
        // Map string status from backend (from QualityCheckStatus)
        if (check.status === 'Approved') status = 'passed';
        if (check.status === 'SentForRevision') status = 'failed';
        if (check.status === 'Pending') status = 'pending';

        return {
            id: check.id,
            workId: check.workId,
            studentName: check.studentName || `Work #${check.workId}`,
            topicTitle: check.topicTitle || '—',
            submittedDate: check.createdAt,
            attemptNumber: check.attemptNumber || 1,
            attachmentId: check.attachmentId ?? null,
            submissionUrl: check.submissionUrl ?? null,
            status: status,
            comment: check.comment
        };
    }), [allChecks]);

    const filteredDocs = displayDocuments.filter(d =>
        activeTab === 'pending' ? d.status === 'pending' :
        activeTab === 'failed'  ? d.status === 'failed'  :
        activeTab === 'passed'  ? d.status === 'passed'  : true
    );

    const handlePass = async (doc) => {
        setSubmitting(prev => ({ ...prev, [doc.id]: true }));
        try {
            await completeMutation.mutateAsync({
                workId: doc.workId,
                checkId: doc.id,
                checkData: { isPassed: true },
            });
        } catch (err) {
            console.error('Failed to pass SW check', err);
        } finally {
            setSubmitting(prev => ({ ...prev, [doc.id]: false }));
        }
    };

    const handleStartReject = (doc) => {
        setRejectingId(doc.id);
        setRejectComment('');
    };

    const handleCancelReject = () => {
        setRejectingId(null);
        setRejectComment('');
    };

    const handleSubmitReject = async (doc) => {
        setSubmitting(prev => ({ ...prev, [doc.id]: true }));
        try {
            await completeMutation.mutateAsync({
                workId: doc.workId,
                checkId: doc.id,
                checkData: { isPassed: false, comment: rejectComment.trim() || undefined },
            });
            setRejectingId(null);
            setRejectComment('');
        } catch (err) {
            console.error('Failed to reject SW check', err);
        } finally {
            setSubmitting(prev => ({ ...prev, [doc.id]: false }));
        }
    };

    const tabs = [
        { key: 'pending', label: t('softwareCheck.tabPending'), count: displayDocuments.filter(d => d.status === 'pending').length },
        { key: 'failed',  label: t('softwareCheck.tabFailed'),  count: displayDocuments.filter(d => d.status === 'failed').length },
        { key: 'passed',  label: t('softwareCheck.tabPassed'),  count: displayDocuments.filter(d => d.status === 'passed').length },
    ];

    return (
        <div className="edu-container">
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 className="edu-main-title">{t('softwareCheck.workReview')}</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '0.6rem 1.25rem',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: activeTab === tab.key ? 600 : 400,
                            borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                            color: activeTab === tab.key ? '#3b82f6' : '#64748b',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'color 0.15s',
                        }}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span style={{
                                background: activeTab === tab.key ? '#eff6ff' : '#f1f5f9',
                                color: activeTab === tab.key ? '#3b82f6' : '#64748b',
                                borderRadius: '9999px',
                                padding: '0 0.45rem',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Document list */}
            {filteredDocs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem 0', fontSize: '0.9rem' }}>
                    {t('softwareCheck.noDocuments')}
                </div>
            ) : (
                <div className="edu-list">
                    {filteredDocs.map(doc => {
                        const isRejecting = rejectingId === doc.id;
                        const isSubmittingThis = !!submitting[doc.id];

                        return (
                            <div key={doc.id} className="edu-topic-card" style={{ padding: '1rem 1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    {/* Student + topic info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', color: '#0f172a' }}>
                                            {doc.studentName}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '480px' }}>
                                            {doc.topicTitle}
                                        </p>
                                        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                                            {t('softwareCheck.attempt')} №{doc.attemptNumber}
                                            {doc.submittedDate && (
                                                <> · {new Date(doc.submittedDate).toLocaleDateString(locale)}</>
                                            )}
                                        </p>

                                        {/* Submission material */}
                                        {doc.submissionUrl ? (
                                            <a
                                                href={doc.submissionUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="sw-material-link"
                                            >
                                                🔗 {t('softwareCheck.viewRepo')}
                                            </a>
                                        ) : doc.attachmentId ? (
                                            <button
                                                className="sw-download-btn"
                                                onClick={() => downloadAttachment(doc.workId, doc.attachmentId, 'software_archive.zip')}
                                            >
                                                ⬇ {t('softwareCheck.downloadFile')}
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                                {t('softwareCheck.noMaterials')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action area */}
                                    {doc.status === 'pending' && (
                                        <div className="sw-actions" style={{ flexShrink: 0 }}>
                                            {!isRejecting ? (
                                                <>
                                                    <button
                                                        className="sw-btn-pass"
                                                        disabled={isSubmittingThis}
                                                        onClick={() => handlePass(doc)}
                                                    >
                                                        {isSubmittingThis ? '…' : `✓ ${t('softwareCheck.passWork')}`}
                                                    </button>
                                                    <button
                                                        className="sw-btn-fail"
                                                        disabled={isSubmittingThis}
                                                        onClick={() => handleStartReject(doc)}
                                                    >
                                                        {`✗ ${t('softwareCheck.failWork')}`}
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="sw-reject-area">
                                                    <textarea
                                                        className="sw-reject-textarea"
                                                        placeholder={t('softwareCheck.addComment')}
                                                        value={rejectComment}
                                                        onChange={e => setRejectComment(e.target.value)}
                                                        rows={3}
                                                    />
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button
                                                            className="sw-btn-cancel"
                                                            onClick={handleCancelReject}
                                                            disabled={isSubmittingThis}
                                                        >
                                                            ✕
                                                        </button>
                                                        <button
                                                            className="sw-btn-fail"
                                                            onClick={() => handleSubmitReject(doc)}
                                                            disabled={isSubmittingThis}
                                                        >
                                                            {isSubmittingThis ? '…' : t('softwareCheck.submitRemark')}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Completed status badge */}
                                    {doc.status !== 'pending' && (
                                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                background: doc.status === 'passed' ? '#ecfdf5' : '#fef2f2',
                                                color: doc.status === 'passed' ? '#10b981' : '#ef4444',
                                            }}>
                                                {doc.status === 'passed'
                                                    ? `✓ ${t('softwareCheck.resultPassed')}`
                                                    : `✗ ${t('softwareCheck.resultFailed')}`
                                                }
                                            </span>
                                            {doc.status === 'failed' && doc.comment && (
                                                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.3rem', maxWidth: '200px', textAlign: 'right' }}>
                                                    {doc.comment}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SoftwareCheckDashboard;
