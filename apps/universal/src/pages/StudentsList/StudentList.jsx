import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLocalizedValue, useAuth, useDefenseSchedule, useEvaluationCriteria, useSubmitGrade, useGradesBySchedule } from "@awm/shared";
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

    const currentStageKey = "defense";

    const { data: defenseSchedule = [], isLoading: isScheduleLoading } = useDefenseSchedule(Number(commissionId));

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
                    readiness: slot.status === 'Graded' ? 100 : 0,
                    scheduleId: slot.id,
                }
            ],
        }));
    }, [defenseSchedule]);

    // Load criteria for grading
    const workTypeId = user?.workTypeId || 1;
    const orgUnitId = user?.orgUnitId;
    const { data: criteriaList = [], isLoading: isCriteriaLoading } = useEvaluationCriteria(workTypeId, orgUnitId);

    // Load existing grades for selected schedule
    const selectedScheduleId = selectedStudent?.scheduleId;
    const { data: existingGrades = [] } = useGradesBySchedule(selectedScheduleId);

    useEffect(() => {
        if (existingGrades.length > 0) {
            const gradeMap = {};
            existingGrades.forEach(g => {
                gradeMap[g.criteriaId || g.id] = g.score;
            });
            setScores(gradeMap);
        }
    }, [existingGrades]);

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

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const openJournal = (student, topic) => {
        setSelectedStudent({ ...student, topicTitle: topic.title, scheduleId: student.scheduleId });
        setScores({});
        setStatus("editing");
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
                <h1 className="s-title">
                    {t('commission.commissions')} №{commissionId} ({t(`student.${currentStageKey}`)})
                </h1>

                <div className="s-topics-grid">
                    {topics.map((topic) => (
                        <div key={topic.id} className="s-topic-card">
                            <div className="s-direction-badge">{getLocalizedValue(topic.direction)}</div>
                            <h3 className="s-topic-title">{getLocalizedValue(topic.title)}</h3>

                            {topic.students.map((s) => (
                                <div
                                    key={s.id}
                                    className="s-student-item"
                                    onClick={() => openJournal(s, topic)}
                                >
                                    <span>{getLocalizedValue(s.name)}</span>
                                    <span className="s-readiness-tag">
                                        {s.readiness}%
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
                onFinalize={() => setStatus("locked")}
                onEdit={() => setStatus("editing")}
                onSimulateSecretary={() => status === "waiting" && setStatus("finalizing")}
                isSubmitting={submitGradeMutation.isPending}
            />
        </div>
    );
}
