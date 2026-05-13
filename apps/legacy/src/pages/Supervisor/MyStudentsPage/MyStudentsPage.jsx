import React, { useState } from "react"
import { Users } from "lucide-react"
import "./MyStudentsPage.css"
import StudentModal from "../../../components/Supervisor/MyStudentsModal/StudentModal.jsx"

export default function MyStudentsPage() {
    const [students, setStudents] = useState([
        {
            id: 1,
            topic: { title: "Разработка веб-приложения для управления задачами", direction: "Веб-технологии" },
            stage: "Предзащита",
            students: [{ id: 101, name: "Иванов Алексей Петрович", score: 85 }],
            projectFiles: [
                { id: "pf1", name: "Пояснительная_записка_v1.pdf", date: "01.02.2024", uploadedBy: "Иванов А.П." },
                { id: "pf2", name: "Код_программы.zip", date: "03.02.2024", uploadedBy: "Иванов А.П." }
            ],
            supervisorFiles: [{ id: "sf1", name: "Правки_по_структуре.docx", date: "04.02.2024" }],
            notes: [
                { id: 1, text: "Нужно доработать схему базы данных", date: "04.02.2024, 14:20" },
                { id: 2, text: "Вводная часть оформлена верно", date: "05.02.2024, 10:15" }
            ]
        },
        // ... другие студенты
    ])

    const [selectedStudent, setSelectedStudent] = useState(null)

    const getCardStatusClass = (stageName) => {
        const s = stageName ? stageName.toLowerCase() : "";
        if (s.includes("предзащита")) return "sp-pill-purple";
        if (s.includes("разработка")) return "sp-pill-orange";
        if (s.includes("финал") || s.includes("защита")) return "sp-pill-green";
        return "sp-pill-gray";
    }

    return (
        <div className="sp-page-root">
            <header className="sp-page-header">
                <div className="sp-header-text">
                    <h1 className="sp-main-title">Мои студенты</h1>
                    <p className="sp-main-subtitle">Панель управления дипломными проектами</p>
                </div>
            </header>

            <div className="sp-cards-grid">
                {students.map(student => (
                    <div key={student.id} className="sp-item-card">
                        <div className="sp-card-top">
                            <span className={`sp-status-badge ${getCardStatusClass(student.stage)}`}>
                                {student.stage}
                            </span>
                            <div className="sp-users-count">
                                <Users size={14} /> {student.students.length}
                            </div>
                        </div>

                        <h3 className="sp-card-title">{student.topic.title}</h3>
                        <p className="sp-card-dir">{student.topic.direction}</p>

                        <div className="sp-card-names">
                            {student.students.map((s) => (
                                <div key={s.id} className="sp-name-row">{s.name}</div>
                            ))}
                        </div>

                        <button className="sp-open-btn" onClick={() => setSelectedStudent(student)}>
                            Открыть карточку
                        </button>
                    </div>
                ))}
            </div>

            {selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    setStudent={setSelectedStudent}
                    setStudents={setStudents}
                />
            )}
        </div>
    )
}