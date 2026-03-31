import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import SecretaryJournalDrawer from "./SecretaryJournalDrawer";
import "./Secretary.css";

export default function SecretaryStudentList() {
    const { t } = useTranslation();
    const { commissionId } = useParams();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Блокировка прокрутки страницы при открытом drawer
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

    // Генерация большого количества тем
    const topics = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        title: `Тема диплома №${i + 1}`,
        direction: "Информационные технологии",
        students: [
            {
                id: i * 10 + 1,
                name: `Студент ${i + 1}А`,
                globalStatus: ["gathering", "ready_to_reveal", "reviewing", "ready_to_lock"][Math.floor(Math.random() * 4)],
                averageScore: Math.random() > 0.4 ? (70 + Math.random() * 25).toFixed(1) : null
            },
            {
                id: i * 10 + 2,
                name: `Студент ${i + 1}Б`,
                globalStatus: ["gathering", "ready_to_reveal", "reviewing", "ready_to_lock"][Math.floor(Math.random() * 4)],
                averageScore: Math.random() > 0.4 ? (70 + Math.random() * 25).toFixed(1) : null
            }
        ]
    }));

    const openDrawer = (student, topic) => {
        setSelectedStudent({ ...student, topicTitle: topic.title });
        setIsDrawerOpen(true);
    };

    const getStatusLabel = (status) => {
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
                <h1 className="s-title">
                    {t('nav.secretary')} - {t('commission.commissions')} №{commissionId || "1"}
                </h1>

                <div className="s-topics-grid">
                    {topics.map(topic => (
                        <div key={topic.id} className="s-topic-card">
                            <div className="s-direction-badge">{topic.direction}</div>
                            <h3 className="s-topic-title">{topic.title}</h3>

                            {topic.students.map(s => {
                                const statusBadge = getStatusLabel(s.globalStatus);

                                return (
                                    <div
                                        key={s.id}
                                        className="s-student-item sec-student-item"
                                        onClick={() => openDrawer(s, topic)}
                                    >
                                        <div className="sec-student-info">
                                            <span className="sec-student-name">{s.name}</span>

                                            {s.averageScore && (
                                                <span className="sec-avg-score">
                                                    {t('journal.currentAverage')} {s.averageScore}
                                                </span>
                                            )}
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
                />
            )}
        </div>
    );
}
