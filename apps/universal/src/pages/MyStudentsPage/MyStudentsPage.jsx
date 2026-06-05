import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Users } from "lucide-react"
import { getLocalizedValue, useMySupervisedWorks } from "@awm/shared"
import "./MyStudentsPage.css"
import StudentModal from "../../components/MyStudentsModal/StudentModal.jsx"

export default function MyStudentsPage() {
    const { t } = useTranslation()
    const { data: works = [], isLoading } = useMySupervisedWorks()
    const [selectedStudent, setSelectedStudent] = useState(null)

    const getCardStatusClass = (stageKey) => {
        if (stageKey === "awaitingDepartmentApproval") return "sp-pill-orange";
        if (stageKey === "preDefense") return "sp-pill-purple";
        if (stageKey === "defense") return "sp-pill-green";
        return "sp-pill-gray";
    }

    if (isLoading) {
        return (
            <div className="sp-page-root">
                <p>{t('common.loading')}</p>
            </div>
        )
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
                {works.length === 0 && (
                    <div className="sp-empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                )}

                {works.map(work => (
                    <div key={work.workId} className="sp-item-card">
                        <div className="sp-card-top">
                            <span className={`sp-status-badge ${getCardStatusClass(work.stageKey)}`}>
                                {t(`student.${work.stageKey}`)}
                            </span>
                            <div className="sp-users-count">
                                <Users size={14} /> {work.students?.length || 0}
                            </div>
                        </div>

                        <h3 className="sp-card-title">{getLocalizedValue(work.topicTitle)}</h3>
                        <p className="sp-card-dir">{getLocalizedValue(work.directionTitle)}</p>

                        <div className="sp-card-names">
                            {work.students?.map((s) => (
                                <div key={s.studentId} className="sp-name-row">{getLocalizedValue(s.name)}</div>
                            ))}
                        </div>

                        <button className="sp-open-btn" onClick={() => setSelectedStudent(work)}>
                            {t('common.openCard')}
                        </button>
                    </div>
                ))}
            </div>

            {selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    setStudent={setSelectedStudent}
                    setStudents={() => {}}
                />
            )}
        </div>
    )
}
