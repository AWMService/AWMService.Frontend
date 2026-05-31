import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLocalizedValue, useDefenseSchedule, useRole, ROLES, useDownloadScheduleReport } from "@awm/shared";
import SecretaryJournalDrawer from "./SecretaryJournalDrawer";
import { Download } from "lucide-react";
import "./Secretary.css";

export default function SecretaryStudentList() {
    const { t } = useTranslation();
    const { commissionId } = useParams();


    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [attendance, setAttendance] = useState({});

    // Fetch real schedule data
    const { data: schedule = [], isLoading: isScheduleLoading } = useDefenseSchedule(Number(commissionId));
    
    // Download report mutation
    const downloadReportMutation = useDownloadScheduleReport();

    // Extract commission pre-defense number from first slot (all slots share the same commission)
    const preDefenseNumber = schedule.length > 0 ? (schedule[0]?.preDefenseNumber ?? null) : null;

    // Convert schedule slots to the "topics" format used by UI
    const topics = useMemo(() => {
        if (!schedule) return [];
        // Group slots by topic if they belong to the same work, or just show as individual cards
        return schedule.filter(slot => slot.studentWorkId).map((slot, i) => ({
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
                    globalStatus: slot.isReconciliationStarted ? "reviewing" : "gathering",
                    averageScore: slot.averageScore,
                    scheduleId: slot.id,
                    protocolId: slot.protocolId
                }
            ],
        }));
    }, [schedule]);

    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isDrawerOpen]);

    const toggleAttendance = (e, studentId) => {
        e.stopPropagation();
        setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
    };

    const openDrawer = (student, topic) => {
        setSelectedStudent({ ...student, topicTitle: topic.title });
        setIsDrawerOpen(true);
    };

    const getStatusLabel = (status, isFinalized) => {
        if (isFinalized) {
            return { text: t('status.protocolClosed'), class: "sec-status-locked" };
        }
        switch (status) {
            case "gathering":
                return { text: t('status.gatheringGrades'), class: "sec-status-warning" };
            case "reviewing":
                return { text: t('status.discussionEdits'), class: "sec-status-warning" };
            case "ready_to_lock":
                return { text: t('status.awaitingApproval'), class: "sec-status-success" };
            default:
                return { text: "", class: "" };
        }
    };

    const { currentRole } = useRole();
    const isSecretary = currentRole === ROLES.SECRETARY;

    if (isScheduleLoading) return <div className="s-page-container"><p>{t('common.loading')}</p></div>;

    // ... (rest of the code)

    return (
        <div className={`s-page-container ${isDrawerOpen ? "s-drawer-open" : ""}`}>
            <div className="s-main-content">
                <div className="sec-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="s-title">
                        {isSecretary ? t('nav.secretary') : t('roles.chairman')} - {t('commission.commissions')} №{commissionId}
                    </h1>
                    {isSecretary && (
                        <button 
                            className="btn-create-new" 
                            onClick={() => downloadReportMutation.mutate(Number(commissionId))}
                            disabled={downloadReportMutation.isPending}
                        >
                            <Download size={18} />
                            <span>{t('commission.downloadProtocol', 'Сформировать ведомость')}</span>
                        </button>
                    )}
                </div>

                <div className="s-topics-grid">
                    {topics.map(topic => (
                        <div key={topic.id} className="s-topic-card">
                            <div className="s-direction-badge">{getLocalizedValue(topic.direction)}</div>
                            <h3 className="s-topic-title">{getLocalizedValue(topic.title)}</h3>

                            {topic.students.map(s => {
                                const isFinalized = !!s.protocolId;
                                const statusBadge = getStatusLabel(s.globalStatus, isFinalized);
                                const isPresent = attendance[s.id] !== false;

                                return (
                                    <div
                                        key={s.id}
                                        className={`s-student-item sec-student-item ${!isPresent ? 'sec-student-absent' : ''} ${isFinalized ? 'sec-student-finalized' : ''}`}
                                        onClick={() => openDrawer(s, topic)}
                                    >
                                        <label
                                            className="sec-attendance-check"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isPresent}
                                                onChange={(e) => toggleAttendance(e, s.id)}
                                                disabled={isFinalized}
                                            />
                                            <span className="sec-attendance-label">
                                                {isPresent ? t('commission.present') : t('commission.absent')}
                                            </span>
                                        </label>

                                        <div className="sec-student-info">
                                            <span className="sec-student-name">{getLocalizedValue(s.name)}</span>

                                            <div className="sec-score-summary">
                                                {s.averageScore ? (
                                                    <>
                                                        <span className="sec-avg-score">
                                                            {t('commission.averageScore')}: {s.averageScore}
                                                        </span>
                                                        <span className="sec-score-status sec-score-complete">
                                                            {t('commission.scoresComplete')}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="sec-score-status sec-score-waiting">
                                                        {t('commission.waitingScores')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <span className={`sec-status-tag ${statusBadge.class}`}>
                                            {statusBadge.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    {topics.length === 0 && (
                        <div className="s-empty-state">
                            <p>{t('common.noData')}</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedStudent && (
                <SecretaryJournalDrawer
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    student={selectedStudent}
                    isPresent={attendance[selectedStudent.id] !== false}
                    preDefenseNumber={preDefenseNumber}
                />
            )}
        </div>
    );
}
