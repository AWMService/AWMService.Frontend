import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "@awm/shared";
import "./DirectionModal.css";

const DirectionModal = ({ direction, onClose, onUpdateStatus, isSaving = false }) => {
    const { t, i18n } = useTranslation();
    const [actionMode, setActionMode] = useState(null);
    const [comment, setComment] = useState("");
    const [language, setLanguage] = useState(() => normalizeLanguage(i18n.language));

    useEffect(() => {
        setLanguage(normalizeLanguage(i18n.language));
    }, [i18n.language]);

    if (!direction) return null;

    const statusDisplayMap = {
        draft: t('status.draft'),
        pending: t('status.underReview'),
        approved: t('status.approved'),
        rejected: t('status.rejected'),
        revision: t('status.revision'),
        "На рассмотрении": t('status.underReview'),
        "Утверждено": t('status.approved'),
        "Отклонено": t('status.rejected'),
    };

    const isPending = direction.status === "pending" || direction.status === "На рассмотрении";
    const isRejected = direction.status === "rejected" || direction.status === "Отклонено";
    const isRevision = direction.status === "revision";

    const handleConfirmAction = async () => {
        if (!actionMode || (actionMode !== "approved" && !comment.trim())) {
            return;
        }

        await onUpdateStatus(direction.id, actionMode, comment.trim());
    };

    const handleClose = () => {
        setActionMode(null);
        setComment("");
        onClose();
    };

    const getTitle = () =>
        direction.title?.[language] || direction.title?.kk || direction.title?.kz || direction.title?.ru || direction.title?.en || "";
    const getDescription = () =>
        direction.description?.[language] || direction.description?.kk || direction.description?.kz || direction.description?.ru || direction.description?.en || "";

    return (
        <div className="dm-overlay" onClick={handleClose}>
            <div
                className="dm-content"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="dm-header">
                    <div
                        className={`dm-status ${
                            isPending
                                ? "dm-status--pending"
                                : isRejected
                                    ? "dm-status--rejected"
                                    : isRevision
                                        ? "dm-status--revision"
                                    : "dm-status--approved"
                        }`}
                    >
                        {statusDisplayMap[direction.status] || direction.status}
                    </div>

                    <div className="dm-lang-switch">
                        {["kk", "ru", "en"].map((lang) => (
                            <button
                                key={lang}
                                className={`dm-lang-btn ${
                                    language === lang ? "dm-lang-btn--active" : ""
                                }`}
                                onClick={() => setLanguage(lang)}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SCROLL AREA */}
                <div className="dm-scroll-area">
                    <h2 className="dm-title">{getTitle()}</h2>
                    <p className="dm-subtitle">
                        {t('department.directionInfo')}
                    </p>

                    <div className="dm-body">
                        <div className="dm-info-grid">
                            <div className="dm-info-item">
                                <span className="dm-info-item__label">{t('supervisor.workType')}</span>
                                <span className="dm-info-item__value">{direction.type}</span>
                            </div>
                            <div className="dm-info-item">
                                <span className="dm-info-item__label">
                                    {t('department.scientificSupervisor')}
                                </span>
                                <span className="dm-info-item__value">
                                    {direction.supervisor}
                                </span>
                            </div>
                            <div className="dm-info-item">
                                <span className="dm-info-item__label">{t('department.submissionDate')}</span>
                                <span className="dm-info-item__value">
                                    {direction.submittedAt}
                                </span>
                            </div>
                        </div>

                        <div className="dm-section">
                            <span className="dm-section__title">
                                {t('department.directionDescription')}
                            </span>
                            <div className="dm-description-box">
                                <p>{getDescription()}</p>
                            </div>
                        </div>

                        {/* ПРИЧИНА ОТКАЗА (ПОСЛЕ ОТКЛОНЕНИЯ) */}
                        {(isRejected || isRevision) && (direction.rejectionReason || direction.reviewComment) && (
                            <div className="dm-rejected-info">
                                <span className="dm-rejected-info__label">
                                    {t('department.rejectionReason')}
                                </span>
                                <p className="dm-rejected-info__text">
                                    {direction.reviewComment || direction.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="dm-footer">
                        {isPending ? (
                            !actionMode ? (
                                <div className="dm-footer__actions">
                                    <button
                                        className="dm-btn dm-btn--reject"
                                        onClick={() => setActionMode("rejected")}
                                        disabled={isSaving}
                                    >
                                        {t('department.reject')}
                                    </button>
                                    <button
                                        className="dm-btn dm-btn--ghost"
                                        onClick={() => setActionMode("revision")}
                                        disabled={isSaving}
                                    >
                                        {t('status.revision')}
                                    </button>
                                    <button
                                        className="dm-btn dm-btn--approve"
                                        onClick={() => onUpdateStatus(direction.id, "approved")}
                                        disabled={isSaving}
                                    >
                                        {t('department.approve')}
                                    </button>
                                </div>
                            ) : (
                                <div className="dm-rejection-form">
                                    <h3 className="dm-rejection-form__title">
                                        {actionMode === "revision" ? t('status.revision') : t('department.rejectionReasonTitle')}
                                    </h3>
                                    <textarea
                                        className="dm-rejection-form__textarea"
                                        placeholder={t('department.rejectReasonPlaceholder')}
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                        autoFocus
                                    />
                                    <div className="dm-rejection-form__buttons">
                                        <button
                                            className="dm-btn dm-btn--ghost"
                                            onClick={() => {
                                                setActionMode(null);
                                                setComment("");
                                            }}
                                            disabled={isSaving}
                                        >
                                            {t('common.cancel')}
                                        </button>
                                        <button
                                            className="dm-btn dm-btn--confirm-reject"
                                            onClick={handleConfirmAction}
                                            disabled={!comment.trim() || isSaving}
                                        >
                                            {actionMode === "revision" ? t('common.send') : t('department.confirmRejection')}
                                        </button>
                                    </div>
                                </div>
                            )
                        ) : (
                            <button
                                className="dm-btn dm-btn--close"
                                onClick={handleClose}
                            >
                                {t('common.close')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectionModal;
