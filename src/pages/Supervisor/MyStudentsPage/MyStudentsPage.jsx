import { useState } from "react"
import { Users, Upload, FileText } from "lucide-react"
import "./MyStudentsPage.css"

export default function MyStudentsPage() {
    const [students] = useState([
        {
            id: "1",
            topic: { title: "Разработка веб-приложения для управления задачами", direction: "Веб-технологии и облачные вычисления" },
            studentCount: 1,
            students: [{ name: "Иванов Алексей Петрович" }],
            workStage: "pre-defense",
            createdAt: "2024-01-15T10:00:00Z",
            hasReview: false,
        },
        {
            id: "2",
            topic: { title: "Система распознавания изображений", direction: "Искусственный интеллект и машинное обучение" },
            studentCount: 2,
            students: [{ name: "Петрова Мария Сергеевна" }, { name: "Сидоров Дмитрий Александрович" }],
            workStage: "development",
            createdAt: "2024-01-20T14:30:00Z",
            hasReview: true,
        },
        {
            id: "3",
            topic: { title: "Мобильное приложение для онлайн-обучения", direction: "Мобильные технологии" },
            studentCount: 1,
            students: [{ name: "Казымова Айгерим Нурлановна" }],
            workStage: "testing",
            createdAt: "2024-02-01T09:15:00Z",
            hasReview: false,
        },
    ])

    const stageLabels = {
        proposal: "Утверждение темы",
        development: "Разработка",
        testing: "Тестирование",
        "pre-defense": "Предзащита",
        defense: "Защита",
        completed: "Завершено",
    }

    const stageColors = {
        proposal: "stage-blue",
        development: "stage-yellow",
        testing: "stage-orange",
        "pre-defense": "stage-purple",
        defense: "stage-green",
        completed: "stage-gray",
    }

    return (
        <div className="supervisors-page">
            {/* Header */}
            <div className="page-header">
                <Users className="icon" />
                <div>
                    <h1 className="title">Мои студенты</h1>
                    <p className="subtitle">Статус работ студентов</p>
                </div>
            </div>

            {/* Students */}
            {students.length === 0 ? (
                <div className="empty-card">
                    <Users className="empty-icon" />
                    <h3>Студенты не назначены</h3>
                    <p>Студенты будут отображаться здесь после назначения тем</p>
                </div>
            ) : (
                <div className="students-list">
                    {students.map((student) => (
                        <div key={student.id} className="student-card">
                            {/* Тема */}
                            <div className="topic">
                                <h3>{student.topic.title}</h3>
                                <p>{student.topic.direction}</p>
                            </div>

                            {/* Кол-во студентов */}
                            <div className="count">
                                <Users className="small-icon" />
                                <span>{student.studentCount} {student.studentCount === 1 ? "студент" : "студента"}</span>
                            </div>

                            {/* ФИО студентов */}
                            <div className="names">
                                {student.students.map((s, index) => (
                                    <div key={index}>{s.name}</div>
                                ))}
                            </div>

                            {/* Этап работы */}
                            <div className={`stage ${stageColors[student.workStage]}`}>
                                {stageLabels[student.workStage]}
                            </div>

                            {/* Отзыв */}
                            <div className="review">
                                <button
                                    className="review-btn"
                                    onClick={() => alert(`Загрузить отзыв для студента ${student.id}`)}
                                >
                                    <Upload className="small-icon" />
                                    {student.hasReview ? "Обновить отзыв" : "Загрузить отзыв"}
                                </button>
                            </div>

                            {/* Мобильная инфа */}
                            <div className="mobile-info">
                                <span>Создано: {new Date(student.createdAt).toLocaleDateString("ru-RU")}</span>
                                {student.hasReview && (
                                    <span className="reviewed"><FileText className="tiny-icon" /> Отзыв загружен</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
