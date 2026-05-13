import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLocalizedValue } from "@awm/shared";
import StudentJournalDrawer from "../../components/StudentJournalDrawer/StudentJournalDrawer.jsx";
import "./StudentList.css";

const mockDocs = [
    {
        name: {
            kk: "Түсіндірме_жазба_v1.pdf",
            ru: "Пояснительная_записка_v1.pdf",
            en: "Explanatory_Note_v1.pdf",
        },
        size: "2.4 MB",
    },
    {
        name: {
            kk: "Қорғау_презентациясы.pptx",
            ru: "Презентация_финал.pptx",
            en: "Final_Presentation.pptx",
        },
        size: "12 MB",
    },
    {
        name: {
            kk: "Жетекші_пікірі.pdf",
            ru: "Отзыв_руководителя.pdf",
            en: "Supervisor_Review.pdf",
        },
        size: "0.5 MB",
    },
];

const criteriaList = [
    {
        id: "c1",
        label: {
            kk: "Мақсатқа жету, тапсырмаларды орындау",
            ru: "Достижение цели, выполнение задач",
            en: "Goal achievement, task completion",
        },
        max: 25,
    },
    {
        id: "c2",
        label: {
            kk: "Қорытындылардың қисындылығы және негізділігі",
            ru: "Логичность и обоснованность выводов",
            en: "Logical and well-grounded conclusions",
        },
        max: 10,
    },
    {
        id: "c3",
        label: {
            kk: "Өзекті тәсілдерді қолдану",
            ru: "Использование актуальных подходов",
            en: "Use of current approaches",
        },
        max: 10,
    },
    {
        id: "c4",
        label: {
            kk: "Нәтижелерді практикалық қолдану",
            ru: "Практическое применение результатов",
            en: "Practical application of results",
        },
        max: 10,
    },
    {
        id: "c5",
        label: {
            kk: "Өзектілік, тиімділік",
            ru: "Релевантность, эффективность",
            en: "Relevance, efficiency",
        },
        max: 15,
    },
    {
        id: "c6",
        label: {
            kk: "Команданы үйлестіру деңгейі",
            ru: "Уровень координации команды",
            en: "Team coordination level",
        },
        max: 5,
    },
    {
        id: "c7",
        label: {
            kk: "Демо-материалдың сапасы",
            ru: "Качество демо-материала",
            en: "Demo material quality",
        },
        max: 5,
    },
    {
        id: "c8",
        label: {
            kk: "Жеке үлес",
            ru: "Индивидуальный вклад",
            en: "Individual contribution",
        },
        max: 20,
    },
];

export default function StudentList() {
    const { t } = useTranslation();
    const { commissionId } = useParams();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [scores, setScores] = useState({});
    const [status, setStatus] = useState("editing");

    const currentStageKey = "defense";

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

    const topics = useMemo(
        () =>
            Array.from({ length: 24 }, (_, i) => ({
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
                            kk: `Студент ${i + 1}A`,
                            ru: `Студент ${i + 1}А`,
                            en: `Student ${i + 1}A`,
                        },
                        readiness: Math.floor(Math.random() * 100),
                    },
                    {
                        id: i * 10 + 2,
                        name: {
                            kk: `Студент ${i + 1}B`,
                            ru: `Студент ${i + 1}Б`,
                            en: `Student ${i + 1}B`,
                        },
                        readiness: Math.floor(Math.random() * 100),
                    },
                ],
            })),
        []
    );

    const handleScoreChange = (id, val, max) => {
        if (status !== "editing") return;
        const num = Math.min(Math.max(0, Number(val) || 0), max);
        setScores((prev) => ({ ...prev, [id]: num }));
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
