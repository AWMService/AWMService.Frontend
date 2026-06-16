import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./DirectionModal.css";
const DirectionModal = ({ direction, onClose, onUpdateStatus }) => {
    const { t } = useTranslation();
    const [reviewMode, setReviewMode] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [language, setLanguage] = useState("ru");
    if (!direction) return null;

    const isPending = direction.status === "pending";
    const isRejected = direction.status === "rejected";

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            return;
        }

        onUpdateStatus(direction.id, "rejected", rejectionReason);
        handleClose();
    };

    const handleRevision = () => {
        if (!rejectionReason.trim()) {
            return;
        }

        onUpdateStatus(direction.id, "revision", rejectionReason);
        handleClose();
    };
    const handleClose = () => {
        setReviewMode(null);
        setRejectionReason("");
        onClose();
    };
    const getTitle = () => direction.title[language];
    const getDescription = () => direction.description[language];
    return (
        <div className="dm-overlay" onClick={handleClose}>
            <div
                className="dm-content"
                onClick={(e) => e.stopPropagation()}
            >
                { }
                <div className="dm-header">
                    <div
                        className={`dm-status ${direction.status === "pending"
                                ? "dm-status--pending"
                                : direction.status === "rejected"
                                    ? "dm-status--rejected"
                                    : direction.status === "revision"
                                        ? "dm-status--revision"
                                        : "dm-status--approved"
                            }`}
                    >
                        {t(`status.${direction.status === 'pending' ? 'underReview' : direction.status}`)}
                    </div>
                    <div className="dm-lang-switch">
                        {["kk", "ru", "en"].map((lang) => (
                            <button
                                key={lang}
                                className={`dm-lang-btn ${language === lang ? "dm-lang-btn--active" : ""
                                    }`}
                                onClick={() => setLanguage(lang)}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                { }
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

                        { }
                        {(direction.status === 'rejected' || direction.status === 'revision') && direction.rejectionReason && (
                            <div className={`dm-rejected-info ${direction.status === 'revision' ? 'dm-revision-info' : ''}`}>
                                <span className="dm-rejected-info__label">
                                    {direction.status === 'revision' ? t('department.revisionReason') : t('department.rejectionReason')}
                                </span>
                                <p className="dm-rejected-info__text">
                                    {direction.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>

                    { }
                    <div className="dm-footer">
                        {isPending ? (
                            !reviewMode ? (
                                <div className="dm-footer__actions">
                                    <button
                                        className="dm-btn dm-btn--reject"
                                        onClick={() =>
                                            setReviewMode("reject")
                                        }
                                    >
                                        {t('common.reject')}
                                    </button>
                                    <button
                                        className="dm-btn dm-btn--revision"
                                        onClick={() =>
                                            setReviewMode("revision")
                                        }
                                    >
                                        {t('department.sendForRevision')}
                                    </button>
                                    <button
                                        className="dm-btn dm-btn--approve"
                                        onClick={() =>
                                            onUpdateStatus(
                                                direction.id,
                                                "approved"
                                            )
                                        }
                                    >
                                        {t('common.approve')}
                                    </button>
                                </div>
                            ) : (
                                <div className="dm-rejection-form">
                                    <h3 className="dm-rejection-form__title">
                                        {reviewMode === "revision"
                                            ? t('department.revisionReason')
                                            : t('supervisor.rejectionReason')}
                                    </h3>
                                    <textarea
                                        className="dm-rejection-form__textarea"
                                        placeholder={
                                            reviewMode === "revision"
                                                ? t('department.revisionReasonPlaceholder')
                                                : t('department.rejectReasonPlaceholder')
                                        }
                                        value={rejectionReason}
                                        onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                        }
                                        autoFocus
                                    />
                                    <div className="dm-rejection-form__buttons">
                                        <button
                                            className="dm-btn dm-btn--ghost"
                                            onClick={() => {
                                                setReviewMode(null);
                                                setRejectionReason("");
                                            }}
                                        >
                                            {t('common.cancel')}
                                        </button>
                                        <button
                                            className={
                                                reviewMode === "revision"
                                                    ? "dm-btn dm-btn--confirm-revision"
                                                    : "dm-btn dm-btn--confirm-reject"
                                            }
                                            onClick={
                                                reviewMode === "revision"
                                                    ? handleRevision
                                                    : handleReject
                                            }
                                            disabled={!rejectionReason.trim()}
                                        >
                                            {reviewMode === "revision"
                                                ? t('department.confirmRevision')
                                                : t('common.confirmReject')}
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