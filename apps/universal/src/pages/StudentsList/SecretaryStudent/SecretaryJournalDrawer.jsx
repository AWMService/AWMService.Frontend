import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedValue, useEvaluationCriteria, useGradesBySchedule, useStartReconciliation, useGenerateProtocol, useFinalizeProtocol, useAuth, useDownloadProtocolPdf, useGraduateWorks } from "@awm/shared";

export default function SecretaryJournalDrawer({ open, onClose, student, isPresent = true, preDefenseNumber = null }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [decision, setDecision] = useState("Допущен");
    const [gradeLetter, setGradeLetter] = useState("Отлично");
    const [comments, setComments] = useState("");

    // PZ-1 is informational — decision is always "Допущен" regardless of scores
    const isInformationalPreDefense = preDefenseNumber === 1;
    // GAK commission has no pre-defense number
    const isGAK = preDefenseNumber === null;

    const scheduleId = student?.scheduleId;
    const isFinalized = !!student?.protocolId;
    const protocolId = student?.protocolId;

    // Fetch real data
    const workTypeId = student?.workTypeId || 1; // DP by default for pre-defense
    const defenseStageType = preDefenseNumber ? 1 : 2;
    const { data: criteria = [] } = useEvaluationCriteria(workTypeId, user?.orgUnitId, null, defenseStageType);
    const { data: grades = [] } = useGradesBySchedule(scheduleId);

    const startReconciliationMutation = useStartReconciliation();
    const generateProtocolMutation = useGenerateProtocol();
    const finalizeProtocolMutation = useFinalizeProtocol();
    const downloadPdfMutation = useDownloadProtocolPdf();
    const graduateWorksMutation = useGraduateWorks();

    const handleRevealClick = () => setShowConfirmModal(true);

    const confirmRevealScores = async () => {
        try {
            await startReconciliationMutation.mutateAsync(scheduleId);
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Failed to reveal scores', error);
        }
    };

    const handleGraduate = async () => {
        if (!student?.workId) return;
        try {
            await graduateWorksMutation.mutateAsync([student.workId]);
            onClose();
        } catch (error) {
            console.error('Failed to graduate student', error);
        }
    };

    // Calculate members from grades using criteria weights
    const members = Array.from(new Set(grades.map(g => g.assignmentId))).map(assignmentId => {
        const memberGrades = grades.filter(g => g.assignmentId === assignmentId);
        const memberName = memberGrades[0]?.memberName || "Unknown";
        const totalScore = memberGrades.reduce((sum, g) => {
            const c = criteria.find(x => x.id === g.criteriaId);
            const weight = c?.weight != null ? c.weight : 1.0;
            return sum + (g.score * weight);
        }, 0);
        return {
            id: assignmentId,
            name: memberName,
            status: "submitted",
            score: parseFloat(totalScore.toFixed(1))
        };
    });

    const calculatedAverage = members.length
        ? (members.reduce((a, b) => a + b.score, 0) / members.length).toFixed(1)
        : 0;

    const averageScore = student?.averageScore || calculatedAverage;

    const handleFinalLock = async () => {
        try {
            let effectiveDecision;
            let effectiveGradeLetter;

            if (isGAK) {
                effectiveGradeLetter = gradeLetter;
                effectiveDecision = gradeLetter === "Неудовлетворительно" ? "Не допущен" : "Допущен";
            } else {
                effectiveDecision = isInformationalPreDefense ? "Допущен" : decision;
                effectiveGradeLetter = undefined;
            }

            let pId = protocolId;

            if (!pId) {
                // 1. Create protocol
                const generatedId = await generateProtocolMutation.mutateAsync({
                    scheduleId: scheduleId,
                    finalScoreNumeric: parseFloat(averageScore),
                    decision: effectiveDecision,
                    finalGradeLetter: effectiveGradeLetter,
                    comments: comments,
                });
                pId = generatedId;
            }

            if (pId) {
                // 2. Finalize protocol (pass attendance status)
                await finalizeProtocolMutation.mutateAsync({ id: pId, isStudentPresent: isPresent });
                onClose();
            }
        } catch (error) {
            console.error('Failed to finalize protocol', error);
        }
    };

    const status = isFinalized ? "completed" : (student?.globalStatus || "gathering");

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
                                <li key={m.id} className="sec-member-item">
                                    <div className="sec-member-details">
                                        <span className="sec-member-name">{m.name}</span>
                                        <span className="sec-m-status submitted">{t('status.submitted')}</span>
                                    </div>
                                    <div className="sec-member-score">
                                        {m.score}
                                    </div>
                                </li>
                            ))}
                            {members.length === 0 && <p className="sec-empty-msg">{t('messages.waitingGrades')}</p>}
                        </ul>
                    </div>

                    <hr className="s-divider" />

                    {/* Таблица согласования */}
                    {status !== "gathering" && (
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {criteria.map((criterion, idx) => {
                                            const criterionGrades = grades.filter(g => g.criteriaId === criterion.id);
                                            const avg = criterionGrades.length 
                                                ? (criterionGrades.reduce((s, g) => s + g.score, 0) / criterionGrades.length).toFixed(1)
                                                : 0;

                                             return (
                                                <tr key={criterion.id} className={idx % 2 === 0 ? 'sec-row-even' : ''}>
                                                    <td className="sec-criterion-name">
                                                        {criterion.criteriaName}
                                                        <span className="sec-max-score">({t('journal.maxScore')} {criterion.maxScore})</span>
                                                    </td>
                                                    {members.map(m => {
                                                        const g = grades.find(g => g.assignmentId === m.id && g.criteriaId === criterion.id);
                                                        return (
                                                            <td key={m.id} className="sec-criterion-score">
                                                                {g?.score ?? '-'}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="sec-criterion-avg">{avg}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <hr className="s-divider" />

                    {/* Предупреждение о неявке */}
                    {!isPresent && !isFinalized && (
                        <div style={{
                            backgroundColor: "#fef3c7",
                            border: "1px solid #f59e0b",
                            borderRadius: "6px",
                            padding: "10px 12px",
                            marginBottom: "12px",
                            fontSize: "13px",
                            color: "#92400e"
                        }}>
                            {t('journal.absentWarning', 'Студент отмечен как отсутствующий — протокол будет закрыт как неявка')}
                        </div>
                    )}

                    {/* Итоговая оценка ГАК (Отлично / Хорошо / Удовлетворительно / Неудовлетворительно) */}
                    {!isFinalized && status === "reviewing" && isGAK && (
                        <div className="sec-decision-section" style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                                {t('journal.overallGrade', 'Итоговая оценка ГАК')}:
                            </label>
                            <select
                                value={gradeLetter}
                                onChange={(e) => setGradeLetter(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #d1d5db",
                                    backgroundColor: "#fff",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            >
                                <option value="Отлично">{t('journal.gradeExcellent', 'Отлично')}</option>
                                <option value="Хорошо">{t('journal.gradeGood', 'Хорошо')}</option>
                                <option value="Удовлетворительно">{t('journal.gradeSatisfactory', 'Удовлетворительно')}</option>
                                <option value="Неудовлетворительно">{t('journal.gradeUnsatisfactory', 'Неудовлетворительно')}</option>
                            </select>
                        </div>
                    )}

                    {/* Решение комиссии — только для ПЗ-2 и ПЗ-3 (не ГАК) */}
                    {!isFinalized && status === "reviewing" && !isInformationalPreDefense && !isGAK && (
                        <div className="sec-decision-section" style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                                {t('journal.commissionDecision', 'Решение комиссии')}:
                            </label>
                            <select
                                value={decision}
                                onChange={(e) => setDecision(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #d1d5db",
                                    backgroundColor: "#fff",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            >
                                <option value="Допущен">{t('journal.admitted', 'Допущен')}</option>
                                <option value="Не допущен">{t('journal.notAdmitted', 'Не допущен')}</option>
                            </select>
                        </div>
                    )}

                    {/* Комментарии */}
                    {!isFinalized && status === "reviewing" && (
                        <div className="sec-decision-section" style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                                {t('journal.comments', 'Комментарии к протоколу')}:
                            </label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #d1d5db",
                                    backgroundColor: "#fff",
                                    fontSize: "14px",
                                    outline: "none",
                                    minHeight: "80px",
                                    resize: "vertical"
                                }}
                                placeholder={t('journal.commentsPlaceholder', 'Оставьте комментарий...')}
                            />
                        </div>
                    )}

                    {/* Итоговый балл */}
                    <div className={`sec-summary-box ${status === 'completed' ? 'locked' : ''}`}>
                        <span>
                            {status === 'completed' ? t('journal.gradeInProtocol') : t('journal.currentAverage')}
                        </span>
                        <strong>{averageScore}</strong>
                    </div>
                </div>

                <div className="s-drawer-footer">
                    <div className="s-actions" style={{ width: "100%" }}>
                        {!isFinalized && status === "gathering" && (
                            <button
                                className="s-btn-primary"
                                style={{ width: "100%" }}
                                onClick={handleRevealClick}
                                disabled={members.length === 0 || startReconciliationMutation.isPending}
                            >
                                {startReconciliationMutation.isPending ? t('common.loading') : t('messages.gradesRevealed')}
                            </button>
                        )}

                        {!isFinalized && status === "reviewing" && (
                            <button 
                                className="s-btn-primary sec-btn-success" 
                                style={{ width: "100%" }}
                                onClick={handleFinalLock}
                                disabled={generateProtocolMutation.isPending || finalizeProtocolMutation.isPending}
                            >
                                {t('journal.approveGrade')}
                            </button>
                        )}

                        {(isFinalized || status === "completed") && (
                            <div style={{ display: "flex", gap: "10px", width: "100%", flexDirection: "column" }}>
                                <div className="s-locked-badge" style={{ marginBottom: "5px" }}>{t('status.protocolApproved')}</div>
                                {protocolId && (
                                    <button 
                                        className="s-btn-secondary" 
                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", cursor: "pointer", border: "1px solid #ccc", background: "#f9f9f9" }}
                                        onClick={() => downloadPdfMutation.mutate(protocolId)}
                                        disabled={downloadPdfMutation.isPending}
                                    >
                                        {downloadPdfMutation.isPending ? t('common.loading') : t('common.downloadPdf', 'Скачать PDF')}
                                    </button>
                                )}
                                {isGAK && student?.globalStatus !== 'graduated' && (
                                    <button 
                                        className="s-btn-primary" 
                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", cursor: "pointer", backgroundColor: "#10b981", border: "none", color: "white" }}
                                        onClick={handleGraduate}
                                        disabled={graduateWorksMutation.isPending}
                                    >
                                        {graduateWorksMutation.isPending ? t('common.loading') : t('journal.markAsGraduated', 'Перевести в выпускники')}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {showConfirmModal && (
                <div className="sec-modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="sec-modal-content" onClick={e => e.stopPropagation()}>
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
