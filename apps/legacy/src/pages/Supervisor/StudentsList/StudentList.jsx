import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StudentJournalDrawer from "../../../components/Supervisor/StudentJournalDrawer/StudentJournalDrawer.jsx";
import "./StudentList.css";

export default function StudentList() {
    const { commissionId } = useParams();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [scores, setScores] = useState({});
    const [status, setStatus] = useState("editing");

    const currentStage = "defense";

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

    const mockDocs = [
        { name: "Пояснительная_записка.pdf", size: "2.4 MB" },
        { name: "Презентация_финал.pptx", size: "12 MB" },
        { name: "Отзыв_руководителя.pdf", size: "0.5 MB" }
    ];

    const criteriaList = [
        { id: "c1", label: "Достижение цели, выполнение задач", max: 25 },
        { id: "c2", label: "Логичность и обоснованность выводов", max: 10 },
        { id: "c3", label: "Использование актуальных подходов", max: 10 },
        { id: "c4", label: "Практическое применение результатов", max: 10 },
        { id: "c5", label: "Релевантность, эффективность", max: 15 },
        { id: "c6", label: "Уровень координации команды", max: 5 },
        { id: "c7", label: "Качество демо-материала", max: 5 },
        { id: "c8", label: "Индивидуальный вклад", max: 20 }
    ];

    // Генерация 24 карточек тем
    const topics = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        title: `Тема диплома №${i + 1}`,
        direction: "Информационные технологии",
        students: [
            { id: i * 10 + 1, name: `Студент ${i + 1}А`, readiness: Math.floor(Math.random() * 100) },
            { id: i * 10 + 2, name: `Студент ${i + 1}Б`, readiness: Math.floor(Math.random() * 100) }
        ]
    }));

    const handleScoreChange = (id, val, max) => {
        if (status !== "editing") return;
        const num = Math.min(Math.max(0, Number(val) || 0), max);
        setScores(prev => ({ ...prev, [id]: num }));
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const openJournal = (student, topic) => {
        setSelectedStudent({ ...student, topicTitle: topic.title });
        setScores({});
        setStatus("editing");
        setIsJournalOpen(true);
    };

    return (
        <div className={`s-page-container ${isJournalOpen ? "s-drawer-open" : ""}`}>
            <div className="s-main-content">
                <h1 className="s-title">
                    Комиссия №{commissionId} ({currentStage === "pre1" ? "Предзащита" : "Защита"})
                </h1>

                <div className="s-topics-grid">
                    {topics.map(topic => (
                        <div key={topic.id} className="s-topic-card">
                            <div className="s-direction-badge">{topic.direction}</div>
                            <h3 className="s-topic-title">{topic.title}</h3>

                            {topic.students.map(s => (
                                <div
                                    key={s.id}
                                    className="s-student-item"
                                    onClick={() => openJournal(s, topic)}
                                >
                                    <span>{s.name}</span>
                                    <span className="s-readiness-tag">
                                        {s.readiness}% готовности
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <StudentJournalDrawer
                open={isJournalOpen}
                onClose={() => setIsJournalOpen(false)}
                selectedStudent={selectedStudent}
                mockDocs={mockDocs}
                criteriaList={criteriaList}
                scores={scores}
                status={status}
                totalScore={totalScore}
                onScoreChange={handleScoreChange}
                onSend={() => setStatus("waiting")}
                onFinalize={() => setStatus("locked")}
                onEdit={() => setStatus("editing")}
                onSimulateSecretary={() => status === "waiting" && setStatus("finalizing")}
            />
        </div>
    );
}
