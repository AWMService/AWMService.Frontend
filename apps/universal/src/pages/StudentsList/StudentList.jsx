import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLocalizedValue, useAuth, useDefenseSchedule, useEvaluationCriteria, useSubmitGrade, useGradesBySchedule, useDownloadScheduleReport, useAttachments, downloadAttachment, useCommissionDetail, useWorkTypes, useStartReconciliation, useGenerateProtocol, useFinalizeProtocol } from "@awm/shared";
import StudentJournalDrawer from "../../components/StudentJournalDrawer/StudentJournalDrawer.jsx";
import "./StudentList.css";

export default function StudentList() {
    const { t } = useTranslation();
    const { commissionId } = useParams();
    const { user } = useAuth();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [scores, setScores] = useState({});
    const [status, setStatus] = useState("editing");

    // Protocol state
    const [readinessPercent, setReadinessPercent] = useState(0);
    const [decisionType, setDecisionType] = useState(1);
    const [decisionComment, setDecisionComment] = useState("");

    const currentStageKey = "defense";

    const { data: defenseSchedule = [], isLoading: isScheduleLoading } = useDefenseSchedule(Number(commissionId));
    const { data: commission } = useCommissionDetail(Number(commissionId));
    const defenseStageType = commission?.commissionTypeId || 2;
    const { mutate: downloadSchedule, isPending: isDownloading } = useDownloadScheduleReport();
    const { data: workTypes = [] } = useWorkTypes();
    const [workTypeId, setWorkTypeId] = useState(1);

    useEffect(() => {
        if (workTypes.length > 0 && !workTypes.find(wt => String(wt.id) === String(workTypeId))) {
            setWorkTypeId(workTypes[0].id);
        }
    }, [workTypes, workTypeId]);

    // Build topics/students from defense schedule slots that have assigned works
    const topics = useMemo(() => {
        if (!defenseSchedule) return [];
        const slotsWithWorks = defenseSchedule.filter(slot => slot.studentWorkId);
        
        // Group by topic or keep as individual items
        return slotsWithWorks.map((slot, i) => ({
            id: slot.id || i,
            title: {
                kk: slot.topicTitleKz || slot.topicTitle || `Дипломдық жұмыс тақырыбы №${i + 1}`,
                ru: slot.topicTitleRu || slot.topicTitle || `Тема диплома №${i + 1}`,
                en: slot.topicTitleEn || slot.topicTitle || `Thesis Topic No. ${i + 1}`,
            },
            direction: {
                kk: "Ақпараттық технологиялар",
                ru: "Информационные технологии",
                en: "Information Technology",
            },
            students: [
                {
                    id: slot.studentWorkId,
                    name: {
                        kk: slot.studentName || `Студент ${i + 1}`,
                        ru: slot.studentName || `Студент ${i + 1}`,
                        en: slot.studentName || `Student ${i + 1}`,
                    },
                    readiness: slot.isProtocolFinalized ? 100 : slot.isReconciliationStarted ? 50 : 0,
                    scheduleId: slot.id,
                    isLocked: slot.isProtocolFinalized,
                    averageScore: slot.averageScore,
                    protocolId: slot.protocolId,
                    isProtocolFinalized: slot.isProtocolFinalized,
                    workTypeId: slot.workTypeId
                }
            ],
        }));
    }, [defenseSchedule]);

    // Determine the active workTypeId to fetch criteria for
    const activeWorkTypeId = selectedStudent?.workTypeId || (defenseSchedule?.length > 0 && defenseSchedule[0].workTypeId) || workTypeId;

    // Load criteria for grading based on commission stage type and selected work type
    const orgUnitId = user?.orgUnitId;
    const { data: criteriaList = [], isLoading: isCriteriaLoading } = useEvaluationCriteria(activeWorkTypeId, orgUnitId, null, defenseStageType);

    // Load existing grades for selected schedule
    const selectedScheduleId = selectedStudent?.scheduleId;
    const { data: existingGrades = [] } = useGradesBySchedule(selectedScheduleId);

    // Fetch attachments for selected student
    const { data: attachments = [] } = useAttachments(selectedStudent?.id);

    useEffect(() => {
        if (existingGrades.length > 0 && isJournalOpen) {
            const gradeMap = {};
            existingGrades.forEach(g => {
                // Filter grades only for the current user
                if (g.userId === user?.userId || g.userId === undefined) {
                    gradeMap[g.criteriaId || g.id] = g.score;
                }
            });
            setScores(gradeMap);
        }
    }, [existingGrades, isJournalOpen, user]);

    // Блокировка прокрутки страницы при открытом drawer
    useEffect(() => {
        if (isJournalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isJournalOpen]);

    const submitGradeMutation = useSubmitGrade();

    const handleScoreChange = (id, val, max) => {
        if (status !== "editing") return;
        const num = Math.min(Math.max(0, Number(val) || 0), max);
        setScores((prev) => ({ ...prev, [id]: num }));
    };

    // Calculate total score using criteria weights
    const totalScore = criteriaList.reduce((sum, criteria) => {
        const score = scores[criteria.id] || 0;
        const weight = criteria.weight != null ? criteria.weight : 1.0;
        return sum + (score * weight);
    }, 0);

    const startReconciliationMutation = useStartReconciliation();
    const generateProtocolMutation = useGenerateProtocol();
    const finalizeProtocolMutation = useFinalizeProtocol();

    const openJournal = (student, topic) => {
        setSelectedStudent({ ...student, topicTitle: topic.title, scheduleId: student.scheduleId });
        setScores({});
        setReadinessPercent(student.readiness || 0);
        setDecisionType(1);
        setDecisionComment("");
        setStatus(student.isLocked ? "locked" : student.isReconciliationStarted ? "finalizing" : "editing");
        setIsJournalOpen(true);
    };

    const handleSendGrades = async () => {
        if (!selectedScheduleId) return;
        try {
            // Submit each criteria score
            for (const [criteriaId, score] of Object.entries(scores)) {
                await submitGradeMutation.mutateAsync({
                    scheduleId: selectedScheduleId,
                    criteriaId: Number(criteriaId),
                    score: Number(score),
                });
            }
            setStatus("waiting");
        } catch (error) {
            console.error('Failed to submit grades', error);
        }
    };

    const handleReconciliation = async () => {
        if (!selectedScheduleId) return;
        try {
            await startReconciliationMutation.mutateAsync(selectedScheduleId);
            setStatus("finalizing");
        } catch (error) {
            console.error('Failed to start reconciliation', error);
        }
    };

    const handleFinalize = async () => {
        if (!selectedScheduleId) return;
        try {
            // Check if protocol is already created
            let pId = selectedStudent?.protocolId;
            if (!pId) {
                const newProtocolId = await generateProtocolMutation.mutateAsync({
                    scheduleId: selectedScheduleId,
                    decisionType: decisionType,
                    comments: decisionComment,
                    readinessPercent: readinessPercent
                });
                pId = newProtocolId;
            }
            if (pId) {
                await finalizeProtocolMutation.mutateAsync({ id: pId, isStudentPresent: true });
                setStatus("locked");
            }
        } catch (error) {
            console.error('Failed to finalize protocol', error);
        }
    };

    if (isScheduleLoading || isCriteriaLoading) {
        return (
            <div className="s-page-container">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className={`s-page-container ${isJournalOpen ? "s-drawer-open" : ""}`}>
            <div className="s-main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
                    <h1 className="s-title" style={{ margin: 0 }}>
                        {t('commission.title', `Комиссия №${commissionId}`)} 
                        {defenseStageType === 1 ? ` (${t('commission.preDefense')})` : ` (${t('commission.defense')})`}
                    </h1>
                    <button
                        onClick={() => downloadSchedule(Number(commissionId))}
                        disabled={isDownloading}
                        className="download-button"
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            color: '#fff',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px'
                        }}
                    >
                        📥 {isDownloading ? t('common.downloading', 'Скачивание...') : t('commission.downloadSchedule', 'Скачать PDF расписания')}
                    </button>
                </div>

                <div className="s-topics-grid">
                    {topics.map((topic) => (
                        <div key={topic.id} className="s-topic-card">
                            <div className="s-direction-badge">{getLocalizedValue(topic.direction)}</div>
                            <h3 className="s-topic-title">{getLocalizedValue(topic.title)}</h3>

                            {topic.students.map((s) => (
                                <div
                                    key={s.id}
                                    className={`s-student-item ${s.isLocked ? 'sec-student-finalized' : ''}`}
                                    onClick={() => openJournal(s, topic)}
                                >
                                    <span>{getLocalizedValue(s.name)}</span>
                                    <span className={`s-readiness-tag ${s.readiness === 100 ? 'sec-score-complete' : s.readiness === 50 ? 'sec-status-warning' : ''}`}>
                                        {s.isLocked ? t('status.protocolClosed') : `${s.readiness}%`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}

                    {topics.length === 0 && (
                        <div className="s-empty-state">
                            <p>{t('common.noData')}</p>
                        </div>
                    )}
                </div>
            </div>

            <StudentJournalDrawer
                open={isJournalOpen}
                onClose={() => setIsJournalOpen(false)}
                selectedStudent={selectedStudent}
                mockDocs={attachments.map(a => ({
                    id: a.id,
                    name: { ru: a.fileName, kk: a.fileName, en: a.fileName },
                    size: (a.fileSizeBytes / 1024).toFixed(1) + ' KB',
                    workId: a.workId
                }))}
                onDownloadDoc={(doc) => downloadAttachment(doc.workId, doc.id, doc.name.ru)}
                criteriaList={criteriaList.map(c => ({
                    id: String(c.id),
                    label: { ru: c.criteriaName, kk: c.criteriaName, en: c.criteriaName },
                    max: c.maxScore || 10,
                }))}
                scores={scores}
                status={status}
                totalScore={totalScore}
                onScoreChange={handleScoreChange}
                onSend={handleSendGrades}
                onFinalize={handleFinalize}
                onEdit={() => setStatus("editing")}
                onSimulateSecretary={handleReconciliation}
                isSubmitting={submitGradeMutation.isPending}
                readinessPercent={readinessPercent}
                onReadinessChange={setReadinessPercent}
                decisionType={decisionType}
                onDecisionTypeChange={setDecisionType}
                decisionComment={decisionComment}
                onDecisionCommentChange={setDecisionComment}
            />
        </div>
    );
}
