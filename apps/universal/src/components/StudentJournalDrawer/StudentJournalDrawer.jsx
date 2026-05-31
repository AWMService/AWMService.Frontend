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
    onSimulateSecretary,
    readinessPercent,
    onReadinessChange,
    decisionType,
    onDecisionTypeChange,
    decisionComment,
    onDecisionCommentChange,
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

                {/* Protocol fields: Readiness % and Decision */}
                <div className="s-protocol-fields">
                    <div className="s-protocol-field">
                        <label className="s-field-label">{t('journal.readinessPercent', '% готовности ДП')}</label>
                        <input
                            type="number"
                            className="s-readiness-input"
                            value={readinessPercent ?? ''}
                            onChange={(e) => onReadinessChange?.(parseInt(e.target.value) || 0)}
                            disabled={status === 'locked'}
                            min="0"
                            max="100"
                            placeholder="0"
                        />
                    </div>
                    <div className="s-protocol-field">
                        <label className="s-field-label">{t('journal.decision', 'Решение')}</label>
                        <select
                            className="s-decision-select"
                            value={decisionType ?? ''}
                            onChange={(e) => onDecisionTypeChange?.(e.target.value ? parseInt(e.target.value) : null)}
                            disabled={status === 'locked'}
                        >
                            <option value="">{t('journal.selectDecision', '— Выберите —')}</option>
                            <option value="1">{t('journal.admitted', 'Допущен')}</option>
                            <option value="2">{t('journal.notAdmitted', 'Не допущен')}</option>
                            <option value="3">{t('journal.needsRevision', 'Доработать')}</option>
                        </select>
                    </div>
                    {(decisionType === 3 || decisionType === 2) && (
                        <div className="s-protocol-field s-protocol-field--full">
                            <label className="s-field-label">{t('journal.decisionComment', 'Комментарий к решению')}</label>
                            <textarea
                                className="s-decision-comment"
                                value={decisionComment ?? ''}
                                onChange={(e) => onDecisionCommentChange?.(e.target.value)}
                                disabled={status === 'locked'}
                                placeholder={t('journal.decisionCommentPlaceholder', 'Укажите необходимые доработки...')}
                                rows={3}
                            />
                        </div>
                    )}
                </div>
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
