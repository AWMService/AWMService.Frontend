import React from "react";
import "../../../pages/Supervisor/StudentsList/StudentList.css";

const FileIcon = () => <span style={{ marginRight: 8 }} />;

export default function StudentJournalDrawer({
                                                 open,
                                                 onClose,
                                                 selectedStudent,
                                                 mockDocs,
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
    return (
        <aside className={`s-journal-drawer ${open ? "s-open" : ""}`}>
            <div className="s-drawer-header">
                <button className="s-close-btn" onClick={onClose}>×</button>
                <h2 className="s-drawer-title">Журнал оценки</h2>

                {selectedStudent && (
                    <div className="s-student-info">
                        <div className="s-student-name-large">{selectedStudent.name}</div>
                        <div className="s-topic-sub">{selectedStudent.topicTitle}</div>
                    </div>
                )}
            </div>

            <div className="s-drawer-body">
                <div className="s-docs-section">
                    <h4>Прикрепленные материалы</h4>
                    <div className="s-docs-list">
                        {mockDocs.map((doc, i) => (
                            <div key={i} className="s-doc-item">
                                <FileIcon />
                                <div className="s-doc-info">
                                    <span className="s-doc-name">{doc.name}</span>
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
                        <th>Критерий</th>
                        <th style={{ width: 60 }}>Макс.</th>
                        <th style={{ width: 80 }}>Балл</th>
                    </tr>
                    </thead>
                    <tbody>
                    {criteriaList.map(c => (
                        <tr key={c.id}>
                            <td className="s-criteria-label">{c.label}</td>
                            <td className="s-max-points">{c.max}</td>
                            <td>
                                <input
                                    className={`s-score-input ${
                                        status === "waiting" || status === "locked" ? "disabled" : ""
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

                {status === "waiting" && (
                    <div
                        className="s-status-message"
                        onClick={onSimulateSecretary}
                    >
                        Ожидание других членов комиссии...
                    </div>
                )}

                {status === "finalizing" && (
                    <div className="s-comparison-box">
                        <span>Средний балл комиссии:</span>
                        <strong>{(totalScore * 0.95).toFixed(1)}</strong>
                    </div>
                )}
            </div>

            <div className="s-drawer-footer">
                <div className="s-footer-total">
                    <span>Итоговый балл:</span>
                    <span className="s-total-big">
                        {totalScore} <span className="s-total-max">/ 100</span>
                    </span>
                </div>

                <div className="s-actions">
                    {status === "editing" && (
                        <button className="s-btn-primary" onClick={onSend}>
                            Отправить оценку
                        </button>
                    )}

                    {status === "waiting" && (
                        <button className="s-btn-secondary" disabled>
                            Отправлено
                        </button>
                    )}

                    {status === "finalizing" && (
                        <div className="s-action-group">
                            <button className="s-btn-secondary" onClick={onEdit}>
                                Исправить
                            </button>
                            <button className="s-btn-primary" onClick={onFinalize}>
                                Подтвердить (Финал)
                            </button>
                        </div>
                    )}

                    {status === "locked" && (
                        <div className="s-locked-badge">Оценка закреплена</div>
                    )}
                </div>
            </div>
        </aside>
    );
}
