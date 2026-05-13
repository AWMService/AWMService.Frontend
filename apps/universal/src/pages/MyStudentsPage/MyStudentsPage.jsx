import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Users } from "lucide-react"
import { getLocalizedValue } from "@awm/shared"
import "./MyStudentsPage.css"
import StudentModal from "../../components/MyStudentsModal/StudentModal.jsx"

export default function MyStudentsPage() {
    const { t } = useTranslation()
    const [students, setStudents] = useState([
        {
            id: 1,
            topic: {
                title: {
                    ru: "Разработка веб-приложения для управления задачами",
                    kk: "Тапсырмаларды басқаруға арналған веб-қосымша әзірлеу",
                    en: "Development of a web application for task management",
                },
                direction: {
                    ru: "Веб-технологии",
                    kk: "Веб-технологиялар",
                    en: "Web Technologies",
                },
            },
            stageKey: "preDefense",
            students: [
                {
                    id: 101,
                    name: {
                        ru: "Иванов Алексей Петрович",
                        kk: "Иванов Алексей Петрович",
                        en: "Alexey Ivanov",
                    },
                    score: 85,
                }
            ],
            projectFiles: [
                {
                    id: "pf1",
                    name: {
                        ru: "Пояснительная_записка_v1.pdf",
                        kk: "Түсіндірме_жазба_v1.pdf",
                        en: "Explanatory_Note_v1.pdf",
                    },
                    date: "01.02.2024",
                    uploadedBy: "Иванов А.П.",
                },
                {
                    id: "pf2",
                    name: {
                        ru: "Код_программы.zip",
                        kk: "Бағдарлама_коды.zip",
                        en: "Program_Code.zip",
                    },
                    date: "03.02.2024",
                    uploadedBy: "Иванов А.П.",
                }
            ],
            supervisorFiles: [{
                id: "sf1",
                name: {
                    ru: "Правки_по_структуре.docx",
                    kk: "Құрылым_бойынша_түзетулер.docx",
                    en: "Structure_Notes.docx",
                },
                date: "04.02.2024"
            }],
            notes: [
                {
                    id: 1,
                    text: {
                        ru: "Нужно доработать схему базы данных",
                        kk: "Деректер қорының сұлбасын жетілдіру қажет",
                        en: "The database schema needs to be refined",
                    },
                    date: "04.02.2024, 14:20"
                },
                {
                    id: 2,
                    text: {
                        ru: "Вводная часть оформлена верно",
                        kk: "Кіріспе бөлімі дұрыс рәсімделген",
                        en: "The introduction section is formatted correctly",
                    },
                    date: "05.02.2024, 10:15"
                }
            ]
        },
        // ... другие студенты
    ])

    const [selectedStudent, setSelectedStudent] = useState(null)

    const getCardStatusClass = (stageKey) => {
        if (stageKey === "preDefense") return "sp-pill-purple";
        if (stageKey === "defense") return "sp-pill-green";
        return "sp-pill-gray";
    }

    return (
        <div className="sp-page-root">
            <header className="sp-page-header">
                <div className="sp-header-text">
                    <h1 className="sp-main-title">{t('nav.myStudents')}</h1>
                    <p className="sp-main-subtitle">{t('nav.myStudentsPanel')}</p>
                </div>
            </header>

            <div className="sp-cards-grid">
                {students.map(student => (
                    <div key={student.id} className="sp-item-card">
                        <div className="sp-card-top">
                            <span className={`sp-status-badge ${getCardStatusClass(student.stageKey)}`}>
                                {t(`student.${student.stageKey}`)}
                            </span>
                            <div className="sp-users-count">
                                <Users size={14} /> {student.students.length}
                            </div>
                        </div>

                        <h3 className="sp-card-title">{getLocalizedValue(student.topic.title)}</h3>
                        <p className="sp-card-dir">{getLocalizedValue(student.topic.direction)}</p>

                        <div className="sp-card-names">
                            {student.students.map((s) => (
                                <div key={s.id} className="sp-name-row">{getLocalizedValue(s.name)}</div>
                            ))}
                        </div>

                        <button className="sp-open-btn" onClick={() => setSelectedStudent(student)}>
                            {t('common.openCard')}
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
