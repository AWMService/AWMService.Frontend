import React from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "@awm/shared";
import "../../pages/StudentsList/StudentList.css";

const FileIcon = () => <span style={{ marginRight: 8 }} />;

export default function StudentJournalDrawer({
    open,
    onClose,
    selectedStudent,
    mockDocs = [],
    criteriaList,
    scores,
    status,
    totalScore,
    onScoreChange,
    onSend,
    onFinalize,
    onEdit,
    onSimulateSecretary
}) {
    const { t } = useTranslation();

    return (
        <aside className={`s-journal-drawer ${open ? "s-open" : ""}`}>
            <div className="s-drawer-header">
                <button className="s-close-btn" onClick={onClose}>×</button>
                <h2 className="s-drawer-title">{t('journal.evaluationTable')}</h2>

                {selectedStudent && (
                    <div className="s-student-info">
                        <div className="s-student-name-large">{getLocalizedValue(selectedStudent.name)}</div>
                        <div className="s-topic-sub">{getLocalizedValue(selectedStudent.topicTitle)}</div>
                    </div>
                )}
            </div>

            <div className="s-drawer-body">
                <div className="s-docs-section">
                    <h4>{t('common.attachedMaterials')}</h4>
                    <div className="s-docs-list">
                        {mockDocs.map((doc, i) => (
                            <div key={i} className="s-doc-item">
                                <FileIcon />
                                <div className="s-doc-info">
                                    <span className="s-doc-name">{getLocalizedValue(doc.name)}</span>
                                    <span className="s-doc-size">{doc.size}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="s-divider" />

                <table className="s-evaluation-table">
                    <thead>
                        <tr>
                            <th>{t('journal.criteria')}</th>
                            <th style={{ width: 60 }}>{t('journal.maxScore')}</th>
                            <th style={{ width: 80 }}>{t('journal.grade')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {criteriaList.map(c => (
                            <tr key={c.id}>
                                <td className="s-criteria-label">{getLocalizedValue(c.label)}</td>
                                <td className="s-max-points">{c.max}</td>
                                <td>
                                    <input
                                        className={`s-score-input ${status === "waiting" || status === "locked" ? "disabled" : ""
                                            }`}
                                        type="number"
                                        value={scores[c.id] || ""}
                                        onChange={e => onScoreChange(c.id, e.target.value, c.max)}
                                        disabled={status === "waiting" || status === "locked"}
                                        placeholder="0"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(status === "editing" || status === "waiting") && (
                    <div className="s-scores-hidden-banner">
                        <span className="s-scores-hidden-icon">ℹ️</span>
                        <span className="s-scores-hidden-text">
                            {t('universal.scoresHiddenUntilReconciliation')}
                        </span>
                    </div>
                )}

                {status === "waiting" && (
                    <div
                        className="s-status-message"
                        onClick={onSimulateSecretary}
                    >
                        {t('messages.waitingOtherMembers')}
                    </div>
                )}

                {status === "finalizing" && (
                    <div className="s-comparison-box">
                        <span>{t('journal.averageScore')}</span>
                        <strong>{(totalScore * 0.95).toFixed(1)}</strong>
                    </div>
                )}
            </div>

            <div className="s-drawer-footer">
                <div className="s-footer-total">
                    <span>{t('journal.totalScore')}</span>
                    <span className="s-total-big">
                        {totalScore} <span className="s-total-max">{t('journal.totalMax')}</span>
                    </span>
                </div>

                <div className="s-actions">
                    {status === "editing" && (
                        <button className="s-btn-primary" onClick={onSend}>
                            {t('status.submitGrade')}
                        </button>
                    )}

                    {status === "waiting" && (
                        <button className="s-btn-secondary" disabled>
                            {t('status.submitted')}
                        </button>
                    )}

                    {status === "finalizing" && (
                        <div className="s-action-group">
                            <button className="s-btn-secondary" onClick={onEdit}>
                                {t('status.editGrade')}
                            </button>
                            <button className="s-btn-primary" onClick={onFinalize}>
                                {t('status.confirmFinal')}
                            </button>
                        </div>
                    )}

                    {status === "locked" && (
                        <div className="s-locked-badge">{t('status.gradeLocked')}</div>
                    )}
                </div>
            </div>
        </aside>
    );
}
