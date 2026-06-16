import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { getLocalizedValue } from "@awm/shared"
import {
    X, Download, Plus, FileCheck, ClipboardList,
    MessageSquare, Calendar, User, GraduationCap,
    FileText, Upload, CheckCircle, Info, History,
    CheckCircle2, XCircle, Search, AlertCircle
} from "lucide-react"
import {
    useAttachments,
    useUploadAttachment,
    useQualityChecks,
    useScheduleByWork,
    useWorkHistory,
    useReviewsByWork,
    useCreateSupervisorReview,
    downloadAttachment
} from "@awm/shared"

export default function StudentModal({ student, setStudent }) {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState("info")

    const workId = student?.workId ?? 0
    const isVirtual = student?.isAwaitingDepartmentApproval === true
    const isRealWork = !isVirtual && workId > 0

    
    const { data: attachments = [], isLoading: attachmentsLoading } = useAttachments(isRealWork ? workId : null)
    const { data: qualityChecks = [], isLoading: checksLoading } = useQualityChecks(isRealWork ? workId : null)
    const { data: scheduleData, isLoading: scheduleLoading } = useScheduleByWork(isRealWork ? workId : null)
    const { data: history = [], isLoading: historyLoading } = useWorkHistory(isRealWork ? workId : null)
    const { data: reviews = [], isLoading: reviewsLoading } = useReviewsByWork(isRealWork ? workId : null)

    const uploadAttachmentMutation = useUploadAttachment(isRealWork ? workId : null)
    const createReviewMutation = useCreateSupervisorReview(isRealWork ? workId : null)

    
    const [reviewText, setReviewText] = useState("")
    const [reviewFile, setReviewFile] = useState(null)
    const [reviewError, setReviewError] = useState("")

    const tabs = useMemo(() => {
        const base = [
            { key: "info", label: t("supervisor.tabs.info"), icon: Info },
        ]
        if (!isVirtual) {
            base.push(
                { key: "documents", label: t("supervisor.tabs.documents"), icon: FileText },
                { key: "checks", label: t("supervisor.tabs.checks"), icon: CheckCircle2 },
                { key: "schedule", label: t("supervisor.tabs.schedule"), icon: Calendar },
                { key: "history", label: t("supervisor.tabs.history"), icon: History },
                { key: "review", label: t("supervisor.tabs.review"), icon: MessageSquare }
            )
        }
        return base
    }, [t, isVirtual])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        uploadAttachmentMutation.mutate(
            { file, attachmentType: "SupervisorReview" },
            {
                onSuccess: () => { e.target.value = "" },
                onError: () => { setReviewError(t("common.uploadError")) }
            }
        )
    }

    const handleDownload = async (attachmentId, fileName) => {
        try {
            await downloadAttachment(workId, attachmentId, fileName)
        } catch {
            setReviewError(t("common.downloadError"))
        }
    }

    const handleSubmitReview = () => {
        if (!reviewText.trim() && !reviewFile) {
            setReviewError(t("supervisor.reviewRequired"))
            return
        }
        const formData = new FormData()
        if (reviewFile) formData.append("File", reviewFile)
        formData.append("Comment", reviewText)
        createReviewMutation.mutate(formData, {
            onSuccess: () => {
                setReviewText("")
                setReviewFile(null)
                setReviewError("")
            },
            onError: () => setReviewError(t("common.saveError"))
        })
    }

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

    if (!student) return null

    const stageKey = student.stageKey || student.stage
    const stageLabel = stageKey ? t(`student.${stageKey}`) : t('common.noData')

    return (
        <div className="sm-overlay" onClick={() => setStudent(null)}>
            <div className="sm-window" onClick={e => e.stopPropagation()}>

                {}
                <div className="sm-header">
                    <div className="sm-header-info">
                        <h2 className="sm-title">{student.students.map(s => getLocalizedValue(s.name)).join(", ")}</h2>
                        <div className="sm-header-meta">
                            <span className={`sm-stage-tag ${getStageStyle(stageKey)}`}>
                                {stageLabel}
                            </span>
                            <span className="sm-dot">•</span>
                            <p className="sm-subtitle">{getLocalizedValue(student.topic?.title || student.topicTitle)}</p>
                        </div>
                    </div>
                    <button className="sm-close-btn" onClick={() => setStudent(null)}>
                        <X size={20} />
                    </button>
                </div>

                {}
                <div className="sm-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            className={`sm-tab ${activeTab === tab.key ? 'sm-tab-active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {}
                <div className="sm-tab-content">

                    {}
                    {activeTab === 'info' && (
                        <div className="sm-info-grid">
                            <div className="sm-info-card">
                                <h4 className="sm-section-label"><ClipboardList size={18} /> {t('common.documents')}</h4>
                                <div className="sm-info-row">
                                    <span className="sm-info-label">{t('student.thesisTitle')}</span>
                                    <span className="sm-info-value">{getLocalizedValue(student.topicTitle)}</span>
                                </div>
                                <div className="sm-info-row">
                                    <span className="sm-info-label">{t('student.directionLabel')}</span>
                                    <span className="sm-info-value">{getLocalizedValue(student.directionTitle)}</span>
                                </div>
                                <div className="sm-info-row">
                                    <span className="sm-info-label">{t('common.status')}</span>
                                    <span className="sm-info-value">{stageLabel}</span>
                                </div>
                            </div>
                            <div className="sm-info-card">
                                <h4 className="sm-section-label"><GraduationCap size={18} /> {t('student.participants')}</h4>
                                {student.students.map(s => (
                                    <div key={s.studentId} className="sm-grade-item" style={{border: 'none', paddingLeft: 0}}>
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
                        </div>
                    )}

                    {}
                    {activeTab === 'documents' && (
                        <div className="sm-docs-grid">
                            <section className="sm-section">
                                <h4 className="sm-section-label"><FileText size={18} /> {t('common.documents')}</h4>
                                {attachmentsLoading ? (
                                    <p className="sm-empty">{t('common.loading')}</p>
                                ) : attachments.filter(a => a.attachmentTypeId !== 6).length ? (
                                    <div className="sm-file-list">
                                        {attachments.filter(a => a.attachmentTypeId !== 6).map(file => (
                                            <div key={file.id} className="sm-file-card">
                                                <div className="sm-file-info">
                                                    <span className="sm-file-name">{file.fileName}</span>
                                                    <div className="sm-file-meta">
                                                        <span><Calendar size={10} /> {new Date(file.createdAt).toLocaleDateString()}</span>
                                                        <span className="sm-author-tag"><User size={10} /> {file.uploadedBy}</span>
                                                    </div>
                                                </div>
                                                <button className="sm-icon-action" onClick={() => handleDownload(file.id, file.fileName)}>
                                                    <Download size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="sm-empty">{t('common.filesNotUploaded')}</p>
                                )}
                            </section>

                            <section className="sm-section sm-supervisor-box">
                                <h4 className="sm-section-label"><FileCheck size={18} /> {t('supervisor.yourDocuments')}</h4>
                                {attachments.filter(a => a.attachmentTypeId === 6).length ? (
                                    <div className="sm-file-list">
                                        {attachments.filter(a => a.attachmentTypeId === 6).map(file => (
                                            <div key={file.id} className="sm-file-card sm-border-blue">
                                                <div className="sm-file-info">
                                                    <span className="sm-file-name">{file.fileName}</span>
                                                    <span className="sm-file-date"><Calendar size={10} /> {new Date(file.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <button className="sm-icon-action" onClick={() => handleDownload(file.id, file.fileName)}>
                                                    <Download size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="sm-empty">{t('common.noData')}</p>
                                )}
                                <label className="sm-add-file-btn">
                                    <Plus size={14} /> {t('supervisor.downloadFile')}
                                    <input type="file" accept=".pdf,.docx,.doc" style={{ display: 'none' }} onChange={handleFileChange} />
                                </label>
                                {uploadAttachmentMutation.isPending && <p className="sm-empty">{t('common.uploading')}</p>}
                            </section>
                        </div>
                    )}

                    {}
                    {activeTab === 'checks' && (
                        <div className="sm-checks-wrapper">
                            {checksLoading ? (
                                <p className="sm-empty">{t('common.loading')}</p>
                            ) : qualityChecks.length ? (
                                <table className="sm-checks-table">
                                    <thead>
                                        <tr>
                                            <th>{t('supervisor.qualityChecks.type')}</th>
                                            <th>{t('common.status')}</th>
                                            <th>{t('student.score')}</th>
                                            <th>{t('student.attemptNumber')}</th>
                                            <th>{t('student.expertComments')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {qualityChecks.map(check => (
                                            <tr key={check.id}>
                                                <td>{check.checkTypeName || check.checkType}</td>
                                                <td>
                                                    {check.isPassed
                                                        ? <span className="sm-check-status-pass"><CheckCircle size={12} /> {t('student.passed')}</span>
                                                        : <span className="sm-check-status-fail"><XCircle size={12} /> {t('student.notPassed')}</span>
                                                    }
                                                </td>
                                                <td>{check.resultValue ?? '-'}</td>
                                                <td>#{check.attemptNumber}</td>
                                                <td>{check.comment || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="sm-empty">{t('common.noData')}</p>
                            )}
                        </div>
                    )}

                    {}
                    {activeTab === 'schedule' && (
                        <div className="sm-schedule-wrapper">
                            {scheduleLoading ? (
                                <p className="sm-empty">{t('common.loading')}</p>
                            ) : scheduleData ? (
                                <div className="sm-schedule-card">
                                    <div className="sm-schedule-header">
                                        <Calendar size={20} />
                                        <h4>{t('supervisor.schedule.defenseInfo')}</h4>
                                    </div>
                                    <div className="sm-info-row">
                                        <span className="sm-info-label">{t('supervisor.schedule.date')}</span>
                                        <span className="sm-info-value">{scheduleData.defenseDate} {scheduleData.defenseTime}</span>
                                    </div>
                                    <div className="sm-info-row">
                                        <span className="sm-info-label">{t('supervisor.schedule.location')}</span>
                                        <span className="sm-info-value">{scheduleData.location || '-'}</span>
                                    </div>
                                    <div className="sm-info-row">
                                        <span className="sm-info-label">{t('student.commissionLabel')}</span>
                                        <span className="sm-info-value">{scheduleData.commissionName || '-'}</span>
                                    </div>
                                    {scheduleData.averageScore != null && (
                                        <div className="sm-info-row">
                                            <span className="sm-info-label">{t('student.score')}</span>
                                            <span className="sm-info-value">{scheduleData.averageScore}</span>
                                        </div>
                                    )}
                                    {scheduleData.members?.length > 0 && (
                                        <div className="sm-schedule-members">
                                            <h5>{t('student.commissionMembers')}</h5>
                                            {scheduleData.members.map((m, idx) => (
                                                <div key={idx} className="sm-member-row">
                                                    <span className="sm-member-role">{m.role}</span>
                                                    <span className="sm-member-name">{m.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="sm-empty-state">
                                    <AlertCircle size={32} />
                                    <p>{t('supervisor.schedule.notAssigned')}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {}
                    {activeTab === 'history' && (
                        <div className="sm-history-wrapper">
                            {historyLoading ? (
                                <p className="sm-empty">{t('common.loading')}</p>
                            ) : history.length ? (
                                <div className="sm-timeline">
                                    {history.map((item, idx) => (
                                        <div key={item.id} className="sm-timeline-item">
                                            <div className="sm-timeline-marker">
                                                <div className="sm-timeline-dot" />
                                                {idx < history.length - 1 && <div className="sm-timeline-line" />}
                                            </div>
                                            <div className="sm-timeline-content">
                                                <div className="sm-timeline-header">
                                                    <span className="sm-timeline-title">{item.fromStateName || t('student.topicApproved')} → {item.toStateName}</span>
                                                    <span className="sm-timeline-date">{new Date(item.transitionDate).toLocaleString()}</span>
                                                </div>
                                                {item.comment && <p className="sm-timeline-desc">{item.comment}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="sm-empty">{t('student.noTimeline')}</p>
                            )}
                        </div>
                    )}

                    {}
                    {activeTab === 'review' && (
                        <div className="sm-review-wrapper">
                            {reviewsLoading ? (
                                <p className="sm-empty">{t('common.loading')}</p>
                            ) : (
                                <>
                                    {reviews.filter(r => r.type === 'Supervisor').length > 0 && (
                                        <div className="sm-review-list">
                                            {reviews.filter(r => r.type === 'Supervisor').map(r => (
                                                <div key={r.id} className="sm-review-card">
                                                    <div className="sm-review-meta">
                                                        <span className="sm-review-author">{r.authorName}</span>
                                                        <span className="sm-review-date">{new Date(r.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <p className="sm-review-text">{r.reviewText}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="sm-review-form">
                                        <h4 className="sm-section-label"><MessageSquare size={18} /> {t('supervisor.supervisorReview')}</h4>
                                        <textarea
                                            className="sm-review-textarea"
                                            rows={5}
                                            placeholder={t("supervisor.reviewTextPlaceholder")}
                                            value={reviewText}
                                            onChange={e => setReviewText(e.target.value)}
                                        />
                                        <div className="sm-review-file-row">
                                            <label className="sm-review-file-label">
                                                <Upload size={14} />
                                                <span>{t("supervisor.reviewDocument")}</span>
                                            </label>
                                            <input
                                                type="file"
                                                accept=".pdf,.docx,.doc"
                                                className="sm-review-file-input"
                                                onChange={e => setReviewFile(e.target.files[0])}
                                            />
                                            {reviewFile && (
                                                <span className="sm-review-file-name">{reviewFile.name}</span>
                                            )}
                                        </div>
                                        {reviewError && <p className="sm-review-error">{reviewError}</p>}
                                        <div className="sm-review-buttons">
                                            <button
                                                className="sm-review-btn sm-review-btn-primary"
                                                onClick={handleSubmitReview}
                                                disabled={createReviewMutation.isPending}
                                            >
                                                {createReviewMutation.isPending ? t('common.saving') : t('supervisor.submitReview')}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
