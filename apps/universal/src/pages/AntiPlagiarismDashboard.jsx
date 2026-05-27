import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, useAuth, usePendingChecks, useCompleteQualityCheckMutation, useActiveCheckConfigurations } from '@awm/shared';
import './anti.css';

const AntiPlagiarismDashboard = () => {
    const { t } = useTranslation();
    const locale = getIntlLocale();
    const { user } = useAuth();
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: pendingChecks = [] } = usePendingChecks(orgUnitId, semesterId, 'AntiPlagiarism');
    const { data: apConfigs } = useActiveCheckConfigurations(orgUnitId);
    const completeMutation = useCompleteQualityCheckMutation();

    const threshold = apConfigs?.find(c => c.checkTypeCode === 'ANTIPLAGIARISM')?.minimumPassValue ?? null;

    // Local state: track docs completed during the session (same pattern as NormocontrolPage)
    const [passedDocs, setPassedDocs] = useState([]);
    const [failedDocs, setFailedDocs] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [percentages, setPercentages] = useState({}); // { [checkId]: string }
    const [submitting, setSubmitting] = useState({}); // { [checkId]: boolean }

    const displayDocuments = useMemo(() => pendingChecks.map(check => ({
        id: check.id,
        workId: check.workId,
        studentName: check.studentName || `Work #${check.workId}`,
        topicTitle: check.topicTitle || '—',
        submittedDate: check.createdAt,
        attemptNumber: check.attemptNumber || 1,
        status: 'pending',
    })), [pendingChecks]);

    const allDocs = [...displayDocuments, ...passedDocs, ...failedDocs];
    const filteredDocs = allDocs.filter(d =>
        activeTab === 'pending' ? d.status === 'pending' :
        activeTab === 'failed'  ? d.status === 'failed'  :
        activeTab === 'passed'  ? d.status === 'passed'  : true
    );

    const handleSubmitResult = async (doc) => {
        const pctStr = percentages[doc.id];
        const pct = Number(pctStr);
        if (pctStr == null || pctStr === '' || pct < 0 || pct > 100) return;

        setSubmitting(prev => ({ ...prev, [doc.id]: true }));
        try {
            await completeMutation.mutateAsync({
                workId: doc.workId,
                checkId: doc.id,
                // Backend auto-overrides isPassed=false if resultValue < MinimumPassValue
                checkData: { isPassed: true, resultValue: pct },
            });
            // Optimistic categorisation based on known threshold (backend is authoritative)
            const passed = threshold == null || pct >= threshold;
            if (passed) {
                setPassedDocs(prev => [...prev, { ...doc, status: 'passed', resultValue: pct }]);
            } else {
                setFailedDocs(prev => [...prev, { ...doc, status: 'failed', resultValue: pct }]);
            }
            setPercentages(prev => { const next = { ...prev }; delete next[doc.id]; return next; });
        } catch (err) {
            console.error('Failed to complete AP check', err);
        } finally {
            setSubmitting(prev => ({ ...prev, [doc.id]: false }));
        }
    };

    const tabs = [
        { key: 'pending', label: t('antiplagiarism.tabPending'), count: displayDocuments.length },
        { key: 'failed',  label: t('antiplagiarism.tabFailed'),  count: failedDocs.length },
        { key: 'passed',  label: t('antiplagiarism.tabPassed'),  count: passedDocs.length },
    ];

    return (
        <div className="edu-container">
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 className="edu-main-title">{t('antiplagiarism.workReview')}</h1>
                {threshold != null && (
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {t('antiplagiarism.thresholdInfo')}: <strong style={{ color: '#0f172a' }}>{threshold}%</strong>
                    </p>
                )}
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
                    {t('antiplagiarism.noDocuments')}
                </div>
            ) : (
                <div className="edu-list">
                    {filteredDocs.map(doc => {
                        const pctStr = percentages[doc.id] ?? '';
                        const pctNum = Number(pctStr);
                        const isValid = pctStr !== '' && pctNum >= 0 && pctNum <= 100;
                        const isSubmitting = !!submitting[doc.id];

                        return (
                            <div key={doc.id} className="edu-topic-card" style={{ padding: '1rem 1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    {/* Student + topic info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', color: '#0f172a' }}>
                                            {doc.studentName}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '480px' }}>
                                            {doc.topicTitle}
                                        </p>
                                        <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                            {t('antiplagiarism.attempt')} №{doc.attemptNumber}
                                            {doc.submittedDate && (
                                                <> · {new Date(doc.submittedDate).toLocaleDateString(locale)}</>
                                            )}
                                        </p>
                                    </div>

                                    {/* Action area */}
                                    {doc.status === 'pending' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                                                {t('antiplagiarism.percentageInputLabel')}
                                            </span>
                                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    placeholder="—"
                                                    value={pctStr}
                                                    onChange={e => setPercentages(prev => ({ ...prev, [doc.id]: e.target.value }))}
                                                    style={{
                                                        width: '68px',
                                                        padding: '0.35rem 1.5rem 0.35rem 0.5rem',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '6px',
                                                        fontSize: '0.875rem',
                                                        textAlign: 'center',
                                                    }}
                                                />
                                                <span style={{ position: 'absolute', right: '0.4rem', color: '#94a3b8', fontSize: '0.8rem', pointerEvents: 'none' }}>%</span>
                                            </div>
                                            <button
                                                className="btn-primary"
                                                style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                                disabled={!isValid || isSubmitting}
                                                onClick={() => handleSubmitResult(doc)}
                                            >
                                                {isSubmitting ? '…' : t('antiplagiarism.submitResult')}
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                                            <span style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                color: doc.status === 'passed' ? '#10b981' : '#ef4444',
                                                lineHeight: 1,
                                            }}>
                                                {doc.resultValue}%
                                            </span>
                                            <p style={{ fontSize: '0.72rem', color: doc.status === 'passed' ? '#10b981' : '#ef4444', marginTop: '0.25rem' }}>
                                                {doc.status === 'passed' ? t('antiplagiarism.resultPassed') : t('antiplagiarism.resultFailed')}
                                                {threshold != null && (
                                                    <span style={{ color: '#94a3b8', marginLeft: '0.3rem' }}>
                                                        ({t('antiplagiarism.thresholdInfo')}: {threshold}%)
                                                    </span>
                                                )}
                                            </p>
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

export default AntiPlagiarismDashboard;
