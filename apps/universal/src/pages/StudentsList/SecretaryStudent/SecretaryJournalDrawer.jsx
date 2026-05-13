import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "@awm/shared";

const CRITERIA = [
    {
        id: 1,
        name: {
            kk: "Тақырыптың өзектілігі",
            ru: "Актуальность темы",
            en: "Relevance of the topic",
        },
        maxScore: 20,
    },
    {
        id: 2,
        name: {
            kk: "Зерттеу сапасы",
            ru: "Качество исследования",
            en: "Quality of the research",
        },
        maxScore: 25,
    },
    {
        id: 3,
        name: {
            kk: "Практикалық маңыздылығы",
            ru: "Практическая значимость",
            en: "Practical significance",
        },
        maxScore: 20,
    },
    {
        id: 4,
        name: {
            kk: "Баяндама сапасы",
            ru: "Качество доклада",
            en: "Presentation quality",
        },
        maxScore: 15,
    },
    {
        id: 5,
        name: {
            kk: "Сұрақтарға жауаптар",
            ru: "Ответы на вопросы",
            en: "Answers to questions",
        },
        maxScore: 20,
    },
];

function generateCriteriaScores(memberId) {
    return CRITERIA.map(c => ({
        criterionId: c.id,
        score: Math.round(c.maxScore * (0.6 + ((memberId * c.id * 7) % 40) / 100))
    }));
}

export default function SecretaryJournalDrawer({ open, onClose, student, isFinalized = false }) {
    const { t } = useTranslation();
    const [status, setStatus] = useState(student?.globalStatus || "gathering");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [reviewRequested, setReviewRequested] = useState({});

    const [members, setMembers] = useState([
        { id: 1, name: "Иванов И.И.", roleKey: "chairman", status: "submitted", score: 88 },
        { id: 2, name: "Смирнова А.В.", roleKey: "member", status: "submitted", score: 82 },
        { id: 3, name: "Оспанов Д.К.", roleKey: "member", status: "submitted", score: 85 },
        { id: 4, name: "Ким Е.В.", roleKey: "member", status: "submitted", score: 90 },
        { id: 5, name: "Алиев М.М.", roleKey: "member", status: "submitted", score: 78 },
    ]);

    // Per-criterion scores for reconciliation
    const [criteriaScores] = useState(() =>
        members.map(m => ({
            memberId: m.id,
            scores: generateCriteriaScores(m.id)
        }))
    );

    useEffect(() => {
        if (student) setStatus(isFinalized ? "completed" : student.globalStatus);
    }, [student, isFinalized]);

    const handleRevealClick = () => setShowConfirmModal(true);

    const confirmRevealScores = () => {
        setShowConfirmModal(false);
        setStatus("reviewing");
    };

    const simulateMembersFinalizing = () => {
        const updatedMembers = members.map(m => {
            let newScore = m.score;
            if (m.id === 2) newScore = 85;
            if (m.id === 5) newScore = 80;
            return { ...m, score: newScore, status: "locked" };
        });
        setMembers(updatedMembers);
        setStatus("ready_to_lock");
    };

    const handleFinalLock = () => {
        setStatus("completed");
    };

    const handleRequestReview = (criterionId) => {
        setReviewRequested(prev => ({ ...prev, [criterionId]: true }));
    };

    // Check if scores for a criterion diverge too much (> 30% of max)
    const hasDivergence = (criterionId) => {
        const criterion = CRITERIA.find(c => c.id === criterionId);
        const scores = criteriaScores.map(ms =>
            ms.scores.find(s => s.criterionId === criterionId)?.score ?? 0
        );
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        return (max - min) > criterion.maxScore * 0.3;
    };

    const getCriterionAverage = (criterionId) => {
        const scores = criteriaScores.map(ms =>
            ms.scores.find(s => s.criterionId === criterionId)?.score ?? 0
        );
        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    };

    const submittedScores = members.filter(m => m.score !== null).map(m => m.score);
    const averageScore = submittedScores.length
        ? (submittedScores.reduce((a, b) => a + b, 0) / submittedScores.length).toFixed(1)
        : 0;

    return (
        <>
            <aside className={`s-journal-drawer ${open ? "s-open" : ""}`}>
                <div className="s-drawer-header">
                    <button className="s-close-btn" onClick={onClose}>×</button>
                    <h2 className="s-drawer-title">{t('commission.commissionManagement')}</h2>
                    {student && (
                        <div className="s-student-info">
                            <div className="s-student-name-large">{getLocalizedValue(student.name)}</div>
                            <div className="s-topic-sub">{getLocalizedValue(student.topicTitle)}</div>
                        </div>
                    )}
                </div>

                <div className="s-drawer-body">
                    {/* Список комиссии */}
                    <div className="sec-members-section">
                        <h4>{t('commission.commissionList')}</h4>
                        <ul className="sec-members-list">
                            {members.map(m => (
                                <li key={m.id} className={`sec-member-item ${m.status === 'locked' ? 'finalized' : ''}`}>
                                    <div className="sec-member-details">
                                        <span className="sec-member-name">
                                            {m.name} <span className="sec-role-tag">{t(`commission.${m.roleKey}`)}</span>
                                        </span>
                                        {m.status === "editing" && <span className="sec-m-status editing">{t('status.inProgress')}</span>}
                                        {m.status === "submitted" && <span className="sec-m-status submitted">{t('status.submitted')}</span>}
                                        {m.status === "locked" && <span className="sec-m-status locked">{t('status.confirmFinal')}</span>}
                                    </div>
                                    <div className="sec-member-score">
                                        {m.score !== null ? m.score : "-"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <hr className="s-divider" />

                    {/* Reconciliation: criteria × members score table */}
                    <div className="sec-reconciliation-section">
                        <h4>{t('commission.criteria')}</h4>
                        <div className="sec-reconciliation-table-wrapper">
                            <table className="sec-reconciliation-table">
                                <thead>
                                    <tr>
                                        <th>{t('journal.criteria')}</th>
                                        {members.map(m => (
                                            <th key={m.id}>{m.name.split(' ')[0]}</th>
                                        ))}
                                        <th>{t('commission.average')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CRITERIA.map((criterion, idx) => {
                                        const divergent = hasDivergence(criterion.id);
                                        const requested = reviewRequested[criterion.id];
                                        return (
                                            <tr key={criterion.id} className={idx % 2 === 0 ? 'sec-row-even' : ''}>
                                                <td className="sec-criterion-name">
                                                    {getLocalizedValue(criterion.name)}
                                                    <span className="sec-max-score">({t('journal.maxScore')} {criterion.maxScore})</span>
                                                </td>
                                                {criteriaScores.map(ms => {
                                                    const s = ms.scores.find(s => s.criterionId === criterion.id);
                                                    return (
                                                        <td key={ms.memberId} className="sec-criterion-score">
                                                            {s?.score ?? '-'}
                                                        </td>
                                                    );
                                                })}
                                                <td className="sec-criterion-avg">
                                                    {getCriterionAverage(criterion.id)}
                                                </td>
                                                <td className="sec-criterion-action">
                                                    {divergent && !requested && !isFinalized && status !== "completed" && (
                                                        <button
                                                            className="sec-review-btn"
                                                            onClick={() => handleRequestReview(criterion.id)}
                                                            title={t('commission.scoreDivergence')}
                                                        >
                                                            {t('commission.requestReview')}
                                                        </button>
                                                    )}
                                                    {requested && (
                                                        <span className="sec-review-sent">✓</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <hr className="s-divider" />

                    {/* Итоговый балл */}
                    <div className={`sec-summary-box ${status === 'completed' ? 'locked' : ''}`}>
                        <span>
                            {status === 'completed' ? t('journal.gradeInProtocol') : t('journal.currentAverage')}
                        </span>
                        <strong>{averageScore}</strong>
                    </div>

                    {status === "gathering" && (
                        <div className="s-status-message">
                            {t('messages.waitingGrades')}
                        </div>
                    )}

                    {status === "reviewing" && (
                        <div
                            className="s-status-message sec-msg-blue clickable-simulate"
                            onClick={simulateMembersFinalizing}
                            title={t('messages.simulateMembersConfirm')}
                        >
                            <span style={{cursor: "pointer", textDecoration: "underline"}}>
                                {t('messages.gradesRevealed')}
                            </span>
                        </div>
                    )}

                    {status === "ready_to_lock" && (
                        <div className="s-status-message sec-msg-success">
                            {t('messages.allConfirmed')}
                        </div>
                    )}
                </div>

                <div className="s-drawer-footer">
                    <div className="s-actions">
                        {!isFinalized && (status === "ready_to_reveal" || status === "gathering") && (
                            <button
                                className="s-btn-primary"
                                onClick={handleRevealClick}
                                disabled={members.some(m => m.status !== 'submitted')}
                            >
                                {members.some(m => m.status !== 'submitted') ? t('messages.waitingOtherMembers') : t('messages.gradesRevealed')}
                            </button>
                        )}

                        {!isFinalized && status === "reviewing" && (
                            <button className="s-btn-secondary" disabled>
                                {t('messages.discussionActive')}
                            </button>
                        )}

                        {!isFinalized && status === "ready_to_lock" && (
                            <button className="s-btn-primary sec-btn-success" onClick={handleFinalLock}>
                                {t('journal.approveGrade')}
                            </button>
                        )}

                        {(isFinalized || status === "completed") && (
                            <div className="s-locked-badge">{t('status.protocolApproved')}</div>
                        )}
                    </div>
                </div>
            </aside>

            {showConfirmModal && (
                <div className="sec-modal-overlay">
                    <div className="sec-modal-content">
                        <h3>{t('messages.gradesRevealed')}</h3>
                        <p>{t('commission.overallSchedule')}</p>
                        <div className="sec-modal-actions">
                            <button className="s-btn-secondary" onClick={() => setShowConfirmModal(false)}>{t('common.cancel')}</button>
                            <button className="s-btn-primary" onClick={confirmRevealScores}>{t('common.yes')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
