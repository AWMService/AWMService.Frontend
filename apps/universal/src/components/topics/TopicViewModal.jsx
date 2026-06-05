import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale, getLocalizedValue, normalizeLanguage } from "@awm/shared";
import { X, Calendar, BookOpen, Layers, Users, User, Info, Check, AlertCircle } from "lucide-react";
import "./TopicViewModal.css";

export default function TopicViewModal({
                                           open,
                                           onClose,
                                           topic,
                                       onApproveStudent,
                                       onRejectStudent
                                   }) {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const currentLanguage = normalizeLanguage(i18n.language);
    const [titleTab, setTitleTab] = useState(currentLanguage);
    const [descTab, setDescTab] = useState(currentLanguage);

    // Логика отказа
    const [rejectingId, setRejectingId] = useState(null); // ID заявки, которую отклоняем
    const [rejectReason, setRejectReason] = useState(""); // Текст причины
    const [rejectError, setRejectError] = useState(false);

    useEffect(() => {
        if (!topic) return;
        const availableTitles = topic.title || {};
        const availableDescriptions = topic.description || {};
        setTitleTab(
            availableTitles[currentLanguage]
                ? currentLanguage
                : ["kk", "kz", "ru", "en"].find((lang) => availableTitles[lang]) || "en"
        );
        setDescTab(
            availableDescriptions[currentLanguage]
                ? currentLanguage
                : ["kk", "kz", "ru", "en"].find((lang) => availableDescriptions[lang]) || "en"
        );

        // Сброс состояния при открытии новой темы
        setRejectingId(null);
        setRejectReason("");
        setRejectError(false);
    }, [topic, currentLanguage]);

    if (!open || !topic) return null;

    const statusLabels = {
        draft: t('status.draft'),
        pending: t('status.underReview'),
        approved: t('status.approved'),
        rejected: t('status.rejected'),
    };

    const workTypeLabels = {
        diploma_project: t('supervisor.diplomaProject'),
        diploma_work: t('supervisor.diplomaWork'),
        course_work: t('supervisor.courseWork'),
    };

    // Списки
    const students = topic.students || []; // Уже принятые
    // Предполагаем, что заявки приходят в topic.requests.
    // Если структура другая, поменяйте это поле.
    const requests = topic.requests || [];

    const maxParticipants = topic.maxParticipants || 1;
    const remainingSlots = maxParticipants - students.length;

    const formatDate = (iso) => {
        if (!iso) return "—";
        try {
            return new Date(iso).toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return iso;
        }
    };

    // Обработчики кнопок
    const handleStartReject = (reqId) => {
        setRejectingId(reqId);
        setRejectReason("");
        setRejectError(false);
    };

    const handleCancelReject = () => {
        setRejectingId(null);
        setRejectReason("");
        setRejectError(false);
    };

    const handleSubmitReject = (reqId) => {
        if (!rejectReason.trim()) {
            setRejectError(true);
            return;
        }
        if (onRejectStudent) {
            onRejectStudent(reqId, rejectReason);
        }
        handleCancelReject();
    };

    return (
        <div className="tv-overlay" onClick={onClose}>
            <div className="tv-modal" onClick={(e) => e.stopPropagation()}>
                <div className="tv-header">
                    <div className="tv-header-info">
                        <h2>{t('supervisor.topicDetails')}</h2>
                        <span className={`tv-status-badge st-${topic.status}`}>
                            {statusLabels[topic.status] || topic.status}
                        </span>
                    </div>
                    <button className="tv-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="tv-body">
                    {/* Инфо-сетка */}
                    <div className="tv-info-grid">
                        <div className="tv-info-item">
                            <Layers size={16} />
                            <div className="tv-info-content">
                                <label>{t('supervisor.workType')}</label>
                                <span>{workTypeLabels[topic.workType] || topic.workType}</span>
                            </div>
                        </div>
                        <div className="tv-info-item">
                            <Users size={16} />
                            <div className="tv-info-content">
                                <label>{t('supervisor.maxStudents')}</label>
                                <span>{maxParticipants}</span>
                            </div>
                        </div>
                        <div className="tv-info-item">
                            <Calendar size={16} />
                            <div className="tv-info-content">
                                <label>{t('supervisor.createdDate')}</label>
                                <span>{formatDate(topic.createdAt)}</span>
                            </div>
                        </div>
                        <div className="tv-info-item">
                            <Info size={16} />
                            <div className="tv-info-content">
                                <label>{t('nav.directions')}</label>
                                <span>{getLocalizedValue(topic.directionTitle, currentLanguage) || t('common.noData')}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- НОВАЯ СЕКЦИЯ: ЗАЯВКИ (ТОЛЬКО ЕСЛИ ЕСТЬ) --- */}
                    {requests.length > 0 && (
                        <div className="tv-section requests-section">
                            <div className="tv-section-header">
                                <div className="tv-section-title">
                                    <AlertCircle size={18} className="text-orange" />
                                    <h3>{t('supervisor.requestsUnderReview')}</h3>
                                </div>
                                <span className="tv-badge-count">{requests.length}</span>
                            </div>
                            <div className="tv-requests-list">
                                {requests.map((req) => (
                                    <div key={req.id} className={`tv-request-card ${rejectingId === req.id ? 'rejecting' : ''}`}>
                                        <div className="tv-req-header">
                                            <div className="tv-student-info">
                                                <div className="tv-student-avatar req-avatar">
                                                    <User size={14} />
                                                </div>
                                                <div className="tv-req-details">
                                                    <span className="tv-student-name">{req.student?.fullName || t('roles.student')}</span>
                                                    {req.student?.speciality && (
                                                        <span className="tv-student-speciality">{req.student.speciality}</span>
                                                    )}
                                                    <span className="tv-req-date">{t('department.submitted')} {formatDate(req.createdAt)}</span>
                                                </div>
                                            </div>

                                            {/* Кнопки действий (скрываем, если открыта форма отказа) */}
                                            {rejectingId !== req.id && (
                                                <div className="tv-req-actions">
                                                    <button
                                                        className="tv-action-btn btn-approve"
                                                        title={t('status.approved')}
                                                        onClick={() => onApproveStudent && onApproveStudent(req.id)}
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className="tv-action-btn btn-reject"
                                                        title={t('status.rejected')}
                                                        onClick={() => handleStartReject(req.id)}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Форма отказа */}
                                        {rejectingId === req.id && (
                                            <div className="tv-reject-form">
                                                <textarea
                                                    placeholder={t('supervisor.rejectionReason')}
                                                    value={rejectReason}
                                                    onChange={(e) => {
                                                        setRejectReason(e.target.value);
                                                        if (e.target.value.trim()) setRejectError(false);
                                                    }}
                                                    autoFocus
                                                />
                                                {rejectError && (
                                                    <p className="tv-empty-text">{t('common.requiredFields')}</p>
                                                )}
                                                <div className="tv-reject-actions">
                                                    <button className="tv-btn-small btn-cancel" onClick={handleCancelReject}>
                                                        {t('common.cancel')}
                                                    </button>
                                                    <button className="tv-btn-small btn-confirm-reject" onClick={() => handleSubmitReject(req.id)}>
                                                        {t('status.rejected')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* СЕКЦИЯ ПРИНЯТЫХ СТУДЕНТОВ */}
                    <div className="tv-section">
                        <div className="tv-section-header">
                            <div className="tv-section-title">
                                <Users size={18} />
                                <h3>{t('supervisor.groupComposition')}</h3>
                            </div>
                            {remainingSlots > 0 && (
                                <span className="tv-remaining-slots">
                                    {t('supervisor.remainingSlots', { count: remainingSlots })}
                                </span>
                            )}
                        </div>
                        <div className="tv-students-container">
                            {students.length > 0 ? (
                                <div className="tv-students-list">
                                    {students.map((student, idx) => (
                                        <div key={student.id || idx} className="tv-student-card">
                                            <div className="tv-student-avatar">
                                                <User size={14} />
                                            </div>
                                            <div className="tv-student-info">
                                                <span className="tv-student-name">{student.fullName}</span>
                                                {student.speciality && (
                                                    <span className="tv-student-speciality">{student.speciality}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="tv-empty-box">
                                    {t('supervisor.noApprovedStudents')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Название */}
                    <div className="tv-section">
                        <div className="tv-section-header">
                            <div className="tv-section-title">
                                <BookOpen size={18} />
                                <h3>{t('supervisor.topicTitle')}</h3>
                            </div>
                            <div className="tv-tabs-mini">
                                {["kk", "ru", "en"].map((lang) => (
                                    <button
                                        key={lang}
                                        className={`tv-tab-btn ${titleTab === lang ? "active" : ""}`}
                                        onClick={() => setTitleTab(lang)}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    <div className="tv-text-box">
                            {topic.title?.[titleTab] || <span className="tv-empty-text">{t('common.noData')}</span>}
                        </div>
                    </div>

                    {/* Описание */}
                    <div className="tv-section">
                        <div className="tv-section-header">
                            <div className="tv-section-title">
                                <Info size={18} />
                                <h3>{t('supervisor.descriptionTasks')}</h3>
                            </div>
                            <div className="tv-tabs-mini">
                                {["kk", "ru", "en"].map((lang) => (
                                    <button
                                        key={lang}
                                        className={`tv-tab-btn ${descTab === lang ? "active" : ""}`}
                                        onClick={() => setDescTab(lang)}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="tv-text-box desc-area">
                            {topic.description?.[descTab] || <span className="tv-empty-text">{t('supervisor.noDescription')}</span>}
                        </div>
                    </div>
                </div>

                <div className="tv-footer">
                    <button className="tv-btn-primary" onClick={onClose}>
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
