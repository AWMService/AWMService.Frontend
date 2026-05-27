import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useAuth,
    useReviewStatus,
    useReviewers,
    useAssignReviewer,
} from '@awm/shared';
import './ReviewerAssignmentPage.css';
import usersIcon from '../../assets/icons/users-icon.svg';

const TABS = ['all', 'notAssigned', 'assigned', 'reviewReceived'];

function getReviewStatus(work) {
    if (work.isReviewerReviewSubmitted) return 'reviewReceived';
    if (work.reviewerName && work.reviewerName !== 'Not Assigned') return 'assigned';
    return 'notAssigned';
}

function AssignReviewerModal({ workId, onClose, onSuccess }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [selectedReviewer, setSelectedReviewer] = useState(null);

    const { data: reviewers = [], isLoading } = useReviewers(search);
    const assignMutation = useAssignReviewer(workId);

    const handleConfirm = async () => {
        if (!selectedReviewer) return;
        try {
            await assignMutation.mutateAsync(selectedReviewer.id);
            onSuccess();
        } catch (err) {
            console.error('Failed to assign reviewer', err);
        }
    };

    return (
        <div className="ra-modal-overlay" onClick={onClose}>
            <div className="ra-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ra-modal-header">
                    <h3 className="ra-modal-title">{t('department.assignReviewer')}</h3>
                    <button className="ra-modal-close" onClick={onClose}>✕</button>
                </div>

                <input
                    className="ra-search-input"
                    type="text"
                    placeholder={t('department.searchReviewer')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />

                <div className="ra-reviewer-list">
                    {isLoading && <p className="ra-loading">{t('common.loading')}</p>}
                    {!isLoading && reviewers.length === 0 && (
                        <p className="ra-empty">{t('department.noReviewersFound')}</p>
                    )}
                    {reviewers.map((r) => (
                        <div
                            key={r.id}
                            className={`ra-reviewer-item${selectedReviewer?.id === r.id ? ' ra-reviewer-item--selected' : ''}${!r.userId ? ' ra-reviewer-item--disabled' : ''}`}
                            onClick={() => r.userId && setSelectedReviewer(r)}
                            title={!r.userId ? t('department.reviewerNoAccount') : ''}
                        >
                            <div className="ra-reviewer-avatar">{r.fullName.charAt(0)}</div>
                            <div className="ra-reviewer-info">
                                <span className="ra-reviewer-name">{r.fullName}</span>
                                <span className="ra-reviewer-meta">
                                    {r.organization && <span>{r.organization}</span>}
                                    {r.position && <span> · {r.position}</span>}
                                </span>
                                {!r.userId && (
                                    <span className="ra-reviewer-no-account">{t('department.reviewerNoAccount')}</span>
                                )}
                            </div>
                            {selectedReviewer?.id === r.id && <span className="ra-check">✓</span>}
                        </div>
                    ))}
                </div>

                <div className="ra-modal-footer">
                    <button className="ra-btn-cancel" onClick={onClose}>
                        {t('common.cancel')}
                    </button>
                    <button
                        className="ra-btn-confirm"
                        disabled={!selectedReviewer || assignMutation.isPending}
                        onClick={handleConfirm}
                    >
                        {assignMutation.isPending ? t('common.saving') : t('common.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ReviewerAssignmentPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: works = [], isLoading, refetch } = useReviewStatus(orgUnitId, semesterId);

    const [activeTab, setActiveTab] = useState('all');
    const [assignModalWorkId, setAssignModalWorkId] = useState(null);

    const kpi = useMemo(() => {
        let notAssigned = 0, assigned = 0, reviewReceived = 0;
        works.forEach((w) => {
            const s = getReviewStatus(w);
            if (s === 'notAssigned') notAssigned++;
            else if (s === 'assigned') assigned++;
            else reviewReceived++;
        });
        return { total: works.length, notAssigned, assigned, reviewReceived };
    }, [works]);

    const filtered = useMemo(() => {
        if (activeTab === 'all') return works;
        return works.filter((w) => getReviewStatus(w) === activeTab);
    }, [works, activeTab]);

    const statusBadge = (work) => {
        const s = getReviewStatus(work);
        const map = {
            notAssigned: { cls: 'ra-badge--red', label: t('department.notAssigned') },
            assigned: { cls: 'ra-badge--yellow', label: t('department.assigned') },
            reviewReceived: { cls: 'ra-badge--green', label: t('department.reviewReceived') },
        };
        const m = map[s];
        return <span className={`ra-badge ${m.cls}`}>{m.label}</span>;
    };

    return (
        <div className="ra-page">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-info">
                    <div className="page-header-icon-bg">
                        <img src={usersIcon} alt="" className="page-header-icon" />
                    </div>
                    <div>
                        <h1 className="page-title">{t('department.reviewerAssignmentTitle')}</h1>
                        <p className="page-subtitle">{t('department.reviewerAssignmentSubtitle')}</p>
                    </div>
                </div>
            </div>

            {/* KPI */}
            <div className="ra-kpi-row">
                <div className="ra-kpi-card">
                    <span className="ra-kpi-label">{t('department.total')}</span>
                    <span className="ra-kpi-value">{kpi.total}</span>
                </div>
                <div className="ra-kpi-card ra-kpi-card--red">
                    <span className="ra-kpi-label">{t('department.notAssigned')}</span>
                    <span className="ra-kpi-value ra-kpi-value--red">{kpi.notAssigned}</span>
                </div>
                <div className="ra-kpi-card ra-kpi-card--yellow">
                    <span className="ra-kpi-label">{t('department.assigned')}</span>
                    <span className="ra-kpi-value ra-kpi-value--yellow">{kpi.assigned}</span>
                </div>
                <div className="ra-kpi-card ra-kpi-card--green">
                    <span className="ra-kpi-label">{t('department.reviewReceived')}</span>
                    <span className="ra-kpi-value ra-kpi-value--green">{kpi.reviewReceived}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="ra-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        className={`ra-tab${activeTab === tab ? ' ra-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {t(`department.tab_${tab}`)}
                    </button>
                ))}
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="ra-loading-state">{t('common.loading')}</div>
            ) : filtered.length === 0 ? (
                <div className="ra-empty-state">{t('department.noWorksFound')}</div>
            ) : (
                <div className="ra-table-wrapper">
                    <table className="ra-table">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>{t('department.student')}</th>
                                <th>{t('department.topic')}</th>
                                <th>{t('department.supervisor')}</th>
                                <th>{t('reviewer.reviewer')}</th>
                                <th>{t('department.supervisorReview')}</th>
                                <th>{t('department.status')}</th>
                                <th>{t('department.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((work, idx) => {
                                const isReviewReceived = work.isReviewerReviewSubmitted;
                                return (
                                    <tr key={work.workId}>
                                        <td className="ra-td-num">{idx + 1}</td>
                                        <td className="ra-td-name">{work.studentName}</td>
                                        <td className="ra-td-topic" title={work.topicTitle}>{work.topicTitle}</td>
                                        <td className="ra-td-supervisor">{work.supervisorName}</td>
                                        <td className="ra-td-reviewer">
                                            {work.reviewerEntityId ? (
                                                <span className="ra-reviewer-assigned">{work.reviewerName}</span>
                                            ) : (
                                                <span className="ra-reviewer-none">—</span>
                                            )}
                                        </td>
                                        <td className="ra-td-center">
                                            {work.isSupervisorReviewSubmitted ? '✅' : '⏳'}
                                        </td>
                                        <td>{statusBadge(work)}</td>
                                        <td>
                                            <button
                                                className="ra-btn-assign"
                                                disabled={isReviewReceived}
                                                onClick={() => setAssignModalWorkId(work.workId)}
                                            >
                                                {work.reviewerEntityId
                                                    ? t('department.reassign')
                                                    : t('department.assign')}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Assign Modal */}
            {assignModalWorkId !== null && (
                <AssignReviewerModal
                    workId={assignModalWorkId}
                    onClose={() => setAssignModalWorkId(null)}
                    onSuccess={() => {
                        setAssignModalWorkId(null);
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
