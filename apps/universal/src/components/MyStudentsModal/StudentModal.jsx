import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { getIntlLocale, getLocalizedValue } from "@awm/shared"
import {
    X, Download, Plus,
    FileCheck, ClipboardList,
    MessageSquare, Calendar, User,
    GraduationCap, FileText, Upload, CheckCircle
} from "lucide-react"

export default function StudentModal({ student, setStudent, setStudents }) {
    const { t, i18n } = useTranslation()
    const locale = getIntlLocale(i18n.language)
    const [tempNote, setTempNote] = useState("")
    const [reviewStatus, setReviewStatus] = useState("not_written")
    const [reviewText, setReviewText] = useState("")
    const [reviewFile, setReviewFile] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)

    const getCurrentDate = () =>
        new Date().toLocaleString(locale, {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        })

    const getCurrentDateOnly = () =>
        new Date().toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })

    const getStageStyle = (stage) => {
        const s = stage ? stage.toString().toLowerCase() : "";
        if (s === "awaitingdepartmentapproval") return "sm-badge-orange";
        if (s === "predefense" || s === "pre1") return "sm-badge-purple";
        if (s === "defense") return "sm-badge-green";
        if (s === "development") return "sm-badge-orange";
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
        const newFile = { id: Date.now(), name: fileName, date: getCurrentDateOnly() }

        setStudents(prev => prev.map(s =>
            s.id === student.id ? { ...s, supervisorFiles: [...s.supervisorFiles, newFile] } : s
        ))
        setStudent(prev => ({ ...prev, supervisorFiles: [...prev.supervisorFiles, newFile] }))
    }

    const getReviewBadge = () => {
        switch (reviewStatus) {
            case "draft":
                return { className: "sm-review-badge-yellow", label: t("supervisor.reviewDraft") }
            case "submitted":
                return { className: "sm-review-badge-green", label: t("supervisor.reviewSubmitted") }
            default:
                return { className: "sm-review-badge-gray", label: t("supervisor.reviewNotWritten") }
        }
    }

    const handleSaveDraft = () => {
        if (!reviewText.trim()) return
        setReviewStatus("draft")
    }

    const handleSubmitReview = () => {
        if (!showConfirm) {
            setShowConfirm(true)
            return
        }
        setReviewStatus("submitted")
        setShowConfirm(false)
    }

    const handleReviewFileChange = (e) => {
        const file = e.target.files[0]
        if (file) setReviewFile(file)
    }

    const reviewBadge = getReviewBadge()
    const isSubmitted = reviewStatus === "submitted"

    if (!student) return null;

    const stageKey = student.stageKey || student.stage
    const stageLabel = stageKey ? t(`student.${stageKey}`) : t('common.noData')
    const isAwaitingApproval = student.isAwaitingDepartmentApproval === true

    return (
        <div className="sm-overlay" onClick={() => setStudent(null)}>
            <div className="sm-window" onClick={e => e.stopPropagation()}>

                {/* HEADER */}
                <div className="sm-header">
                    <div className="sm-header-info">
                        <h2 className="sm-title">{student.students.map(s => getLocalizedValue(s.name)).join(", ")}</h2>
                        <div className="sm-header-meta">
                            <span className={`sm-stage-tag ${getStageStyle(stageKey)}`}>
                                {stageLabel}
                            </span>
                            <span className="sm-dot">•</span>
                            <p className="sm-subtitle">{getLocalizedValue(student.topic.title)}</p>
                        </div>
                    </div>
                    <button className="sm-close-btn" onClick={() => setStudent(null)}>
                        <X size={20} />
                    </button>
                </div>

                {/* CONTENT GRID */}
                {!isAwaitingApproval && (
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
                                                <span className="sm-file-name">{getLocalizedValue(file.name)}</span>
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
                                            <span className="sm-file-name">{getLocalizedValue(file.name)}</span>
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
                                            <div className="sm-avatar">{getLocalizedValue(s.name).charAt(0)}</div>
                                            <span className="sm-user-name">{getLocalizedValue(s.name)}</span>
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
                                        <p className="sm-note-content">{getLocalizedValue(note.text)}</p>
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
                )}

                {/* SUPERVISOR REVIEW SECTION */}
                {!isAwaitingApproval && (
                <div className={`sm-review-section ${isSubmitted ? "sm-review-submitted" : ""}`}>
                    <div className="sm-review-header">
                        <h4 className="sm-section-label">
                            <FileText size={18} /> {t("supervisor.supervisorReview")}
                        </h4>
                        <span className={`sm-review-badge ${reviewBadge.className}`}>
                            {reviewBadge.label}
                        </span>
                    </div>

                    {isSubmitted && (
                        <div className="sm-review-submitted-notice">
                            <CheckCircle size={16} />
                            <span>{t("supervisor.reviewSubmittedMessage")}</span>
                        </div>
                    )}

                    <textarea
                        className="sm-review-textarea"
                        rows={5}
                        placeholder={t("supervisor.reviewTextPlaceholder")}
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        readOnly={isSubmitted}
                    />

                    <div className="sm-review-file-row">
                        <label className="sm-review-file-label">
                            <Upload size={14} />
                            <span>{t("supervisor.reviewDocument")}</span>
                        </label>
                        {!isSubmitted && (
                            <input
                                type="file"
                                accept=".pdf,.docx,.doc"
                                className="sm-review-file-input"
                                onChange={handleReviewFileChange}
                            />
                        )}
                        {reviewFile && (
                            <span className="sm-review-file-name">{reviewFile.name}</span>
                        )}
                    </div>

                    {!isSubmitted && (
                        <div className="sm-review-actions">
                            {showConfirm && (
                                <p className="sm-review-confirm-msg">
                                    {t("supervisor.confirmSubmitReview")}
                                </p>
                            )}
                            <div className="sm-review-buttons">
                                <button
                                    className="sm-review-btn sm-review-btn-secondary"
                                    onClick={handleSaveDraft}
                                >
                                    {t("supervisor.saveDraft")}
                                </button>
                                <button
                                    className="sm-review-btn sm-review-btn-primary"
                                    onClick={handleSubmitReview}
                                >
                                    {showConfirm ? `${t("supervisor.submitReview")}?` : t("supervisor.submitReview")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
    )
}
