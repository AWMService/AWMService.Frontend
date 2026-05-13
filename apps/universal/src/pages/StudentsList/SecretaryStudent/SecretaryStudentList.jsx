import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLocalizedValue } from "@awm/shared";
import SecretaryJournalDrawer from "./SecretaryJournalDrawer";
import "./Secretary.css";

export default function SecretaryStudentList() {
    const { t } = useTranslation();
    const { commissionId } = useParams();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [attendance, setAttendance] = useState({});
    const [isFinalized, setIsFinalized] = useState(false);
    const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
    const [showFinalizeSuccess, setShowFinalizeSuccess] = useState(false);

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

    // Stable mock data generated once
    const topics = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        title: {
            kk: `Дипломдық жұмыс тақырыбы №${i + 1}`,
            ru: `Тема диплома №${i + 1}`,
            en: `Thesis Topic No. ${i + 1}`,
        },
        direction: {
            kk: "Ақпараттық технологиялар",
            ru: "Информационные технологии",
            en: "Information Technology",
        },
        students: [
            {
                id: i * 10 + 1,
                name: {
                    kk: `Студент ${i + 1}А`,
                    ru: `Студент ${i + 1}А`,
                    en: `Student ${i + 1}A`,
                },
                globalStatus: ["gathering", "ready_to_reveal", "reviewing", "ready_to_lock"][i % 4],
                averageScore: i % 3 !== 0 ? (70 + (i * 3.7) % 25).toFixed(1) : null
            },
            {
                id: i * 10 + 2,
                name: {
                    kk: `Студент ${i + 1}Б`,
                    ru: `Студент ${i + 1}Б`,
                    en: `Student ${i + 1}B`,
                },
                globalStatus: ["gathering", "ready_to_reveal", "reviewing", "ready_to_lock"][(i + 1) % 4],
                averageScore: i % 5 !== 0 ? (72 + (i * 2.3) % 23).toFixed(1) : null
            }
        ]
    })), []);

    // Initialize attendance (all present by default)
    useEffect(() => {
        const initial = {};
        topics.forEach(topic => {
            topic.students.forEach(s => {
                initial[s.id] = true;
            });
        });
        setAttendance(initial);
    }, [topics]);

    const allStudents = useMemo(() =>
        topics.flatMap(topic => topic.students),
    [topics]);

    const allScoresFilled = useMemo(() =>
        allStudents.every(s => s.averageScore !== null),
    [allStudents]);

    const toggleAttendance = (e, studentId) => {
        e.stopPropagation();
        if (isFinalized) return;
        setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
    };

    const handleFinalize = () => {
        setShowFinalizeConfirm(false);
        setIsFinalized(true);
        setShowFinalizeSuccess(true);
        setTimeout(() => setShowFinalizeSuccess(false), 3000);
    };

    const openDrawer = (student, topic) => {
        setSelectedStudent({ ...student, topicTitle: topic.title });
        setIsDrawerOpen(true);
    };

    const getStatusLabel = (status) => {
        if (isFinalized) {
            return { text: t('status.protocolClosed'), class: "sec-status-locked" };
        }
        switch (status) {
            case "gathering":
                return { text: t('status.gatheringGrades'), class: "sec-status-warning" };
            case "ready_to_reveal":
                return { text: t('status.awaitingPublication'), class: "sec-status-info" };
            case "reviewing":
                return { text: t('status.discussionEdits'), class: "sec-status-warning" };
            case "ready_to_lock":
                return { text: t('status.awaitingApproval'), class: "sec-status-success" };
            case "completed":
                return { text: t('status.protocolClosed'), class: "sec-status-locked" };
            default:
                return { text: "", class: "" };
        }
    };

    return (
        <div className={`s-page-container ${isDrawerOpen ? "s-drawer-open" : ""}`}>
            <div className="s-main-content">
                <div className="sec-page-header">
                    <h1 className="s-title">
                        {t('nav.secretary')} - {t('commission.commissions')} №{commissionId || "1"}
                    </h1>

                    <div className="sec-header-actions">
                        {!isFinalized ? (
                            <button
                                className="sec-finalize-btn"
                                disabled={!allScoresFilled}
                                onClick={() => setShowFinalizeConfirm(true)}
                                title={!allScoresFilled ? t('commission.waitingScores') : ''}
                            >
                                {t('commission.finalizeSession')}
                            </button>
                        ) : (
                            <span className="sec-finalized-badge">
                                ✓ {t('commission.sessionFinalized')}
                            </span>
                        )}
                    </div>
                </div>

                {showFinalizeSuccess && (
                    <div className="sec-success-message">
                        ✓ {t('commission.sessionFinalized')}
                    </div>
                )}

                <div className="s-topics-grid">
                    {topics.map(topic => (
                        <div key={topic.id} className="s-topic-card">
                            <div className="s-direction-badge">{getLocalizedValue(topic.direction)}</div>
                            <h3 className="s-topic-title">{getLocalizedValue(topic.title)}</h3>

                            {topic.students.map(s => {
                                const statusBadge = getStatusLabel(s.globalStatus);
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
                </div>
            </div>

            {selectedStudent && (
                <SecretaryJournalDrawer
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    student={selectedStudent}
                    isFinalized={isFinalized}
                />
            )}

            {showFinalizeConfirm && (
                <div className="sec-modal-overlay">
                    <div className="sec-modal-content">
                        <h3>{t('commission.finalizeSession')}</h3>
                        <p>{t('commission.confirmFinalize')}</p>
                        <div className="sec-modal-actions">
                            <button className="s-btn-secondary" onClick={() => setShowFinalizeConfirm(false)}>
                                {t('common.cancel')}
                            </button>
                            <button className="s-btn-primary sec-btn-finalize" onClick={handleFinalize}>
                                {t('common.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
