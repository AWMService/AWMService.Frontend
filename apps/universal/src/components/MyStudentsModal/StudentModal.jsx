import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import {
    X, Download, Plus,
    FileCheck, ClipboardList,
    MessageSquare, Calendar, User,
    GraduationCap
} from "lucide-react"

export default function StudentModal({ student, setStudent, setStudents }) {
    const { t } = useTranslation()
    const [tempNote, setTempNote] = useState("")

    const getCurrentDate = () =>
        new Date().toLocaleString("ru-RU", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        })

    const getStageStyle = (stage) => {
        const s = stage ? stage.toLowerCase() : "";
        if (s.includes("предзащита")) return "sm-badge-purple";
        if (s.includes("финал") || s.includes("защита")) return "sm-badge-green";
        if (s.includes("разработка")) return "sm-badge-orange";
        return "sm-badge-gray";
    }

    const getScoreColor = (score) => {
        if (!score && score !== 0) return "sm-score-gray";
        if (score >= 90) return "sm-score-green";
        if (score >= 70) return "sm-score-blue";
        if (score >= 50) return "sm-score-yellow";
        return "sm-score-red";
    }

    const addNote = () => {
        if (!tempNote.trim()) return
        const newNote = { id: Date.now(), text: tempNote, date: getCurrentDate() }

        setStudents(prev => prev.map(s =>
            s.id === student.id ? { ...s, notes: [...s.notes, newNote] } : s
        ))
        setStudent(prev => ({ ...prev, notes: [...prev.notes, newNote] }))
        setTempNote("")
    }

    const handleFileUpload = () => {
        const fileName = prompt(t('student.enterFileName'))
        if (!fileName) return
        const newFile = { id: Date.now(), name: fileName, date: getCurrentDate().split(",")[0] }

        setStudents(prev => prev.map(s =>
            s.id === student.id ? { ...s, supervisorFiles: [...s.supervisorFiles, newFile] } : s
        ))
        setStudent(prev => ({ ...prev, supervisorFiles: [...prev.supervisorFiles, newFile] }))
    }

    if (!student) return null;

    return (
        <div className="sm-overlay" onClick={() => setStudent(null)}>
            <div className="sm-window" onClick={e => e.stopPropagation()}>

                {/* HEADER */}
                <div className="sm-header">
                    <div className="sm-header-info">
                        <h2 className="sm-title">{student.students.map(s => s.name).join(", ")}</h2>
                        <div className="sm-header-meta">
                            <span className={`sm-stage-tag ${getStageStyle(student.stage)}`}>
                                {student.stage || t('common.noData')}
                            </span>
                            <span className="sm-dot">•</span>
                            <p className="sm-subtitle">{student.topic.title}</p>
                        </div>
                    </div>
                    <button className="sm-close-btn" onClick={() => setStudent(null)}>
                        <X size={20} />
                    </button>
                </div>

                {/* CONTENT GRID */}
                <div className="sm-content-grid">
                    {/* LEFT COLUMN */}
                    <div className="sm-column">
                        <section className="sm-section">
                            <h4 className="sm-section-label">
                                <ClipboardList size={18} /> {t('common.documents')}
                            </h4>
                            <div className="sm-file-list">
                                {student.projectFiles.length ? (
                                    student.projectFiles.map(file => (
                                        <div key={file.id} className="sm-file-card">
                                            <div className="sm-file-info">
                                                <span className="sm-file-name">{file.name}</span>
                                                <div className="sm-file-meta">
                                                    <span><Calendar size={10} /> {file.date}</span>
                                                    <span className="sm-author-tag"><User size={10} /> {file.uploadedBy}</span>
                                                </div>
                                            </div>
                                            <button className="sm-icon-action"><Download size={14} /></button>
                                        </div>
                                    ))
                                ) : <p className="sm-empty">{t('common.filesNotUploaded')}</p>}
                            </div>
                        </section>

                        <section className="sm-section sm-mt-large">
                            <h4 className="sm-section-label">
                                <FileCheck size={18} /> {t('supervisor.yourDocuments')}
                            </h4>
                            <div className="sm-file-list sm-supervisor-box">
                                {student.supervisorFiles.map(file => (
                                    <div key={file.id} className="sm-file-card sm-border-blue">
                                        <div className="sm-file-info">
                                            <span className="sm-file-name">{file.name}</span>
                                            <span className="sm-file-date"><Calendar size={10} /> {file.date}</span>
                                        </div>
                                        <button className="sm-icon-action"><Download size={14} /></button>
                                    </div>
                                ))}
                                <button className="sm-add-file-btn" onClick={handleFileUpload}>
                                    <Plus size={14} /> {t('supervisor.downloadFile')}
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="sm-column">
                        <section className="sm-section">
                            <h4 className="sm-section-label">
                                <GraduationCap size={18} /> {t('common.stageResults')}
                            </h4>
                            <div className="sm-grades-wrapper">
                                {student.students.map((s) => (
                                    <div key={s.id} className="sm-grade-item">
                                        <div className="sm-user-profile">
                                            <div className="sm-avatar">{s.name.charAt(0)}</div>
                                            <span className="sm-user-name">{s.name}</span>
                                        </div>
                                        <div className={`sm-score-pill ${getScoreColor(s.score)}`}>
                                            <span className="sm-score-num">{s.score ?? "-"}</span>
                                            <span className="sm-score-unit">{t('journal.grade')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <h4 className="sm-section-label sm-mt-mid">
                            <MessageSquare size={18} /> {t('supervisor.supervisorFeedback')}
                        </h4>
                        <div className="sm-notes-container">
                            {student.notes.length ? (
                                student.notes.map(note => (
                                    <div key={note.id} className="sm-note-card">
                                        <p className="sm-note-content">{note.text}</p>
                                        <span className="sm-note-timestamp">{note.date}</span>
                                    </div>
                                ))
                            ) : <p className="sm-empty">{t('common.noComments')}</p>}
                        </div>

                        <div className="sm-input-group">
                            <textarea
                                className="sm-textarea"
                                placeholder={t('common.writeComment')}
                                value={tempNote}
                                onChange={e => setTempNote(e.target.value)}
                            />
                            <button className="sm-send-btn" onClick={addNote}>
                                {t('common.sendComment')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}