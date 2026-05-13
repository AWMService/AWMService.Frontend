import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "@awm/shared";
import "./ThemeModal.css";

const ThemeModal = ({ theme, onClose, onUpdateStatus }) => {
    const { t, i18n } = useTranslation();
    const [showRejection, setShowRejection] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [language, setLanguage] = useState(() => normalizeLanguage(i18n.language));

    useEffect(() => {
        setLanguage(normalizeLanguage(i18n.language));
    }, [i18n.language]);

    if (!theme) return null;

    const statusDisplayMap = {
        "На рассмотрении": t('status.underReview'),
        "Утверждено": t('status.approved'),
        "Отклонено": t('status.rejected'),
    };

    const isPending = theme.status === "На рассмотрении";
    const isRejected = theme.status === "Отклонено";

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            return;
        }

        onUpdateStatus(theme.id, "Отклонено", rejectionReason);
        handleClose();
    };

    const handleClose = () => {
        setShowRejection(false);
        setRejectionReason("");
        onClose();
    };

    const getTitle = () =>
        theme.title?.[language] || theme.title?.kk || theme.title?.kz || theme.title?.ru || theme.title?.en || "";
    const getDescription = () =>
        theme.description?.[language] || theme.description?.kk || theme.description?.kz || theme.description?.ru || theme.description?.en || "";

    return (
        <div className="tm-overlay" onClick={handleClose}>
            <div className="tm-content" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="tm-header">
                    <div
                        className={`tm-status ${
                            isPending
                                ? "tm-status--pending"
                                : isRejected
                                    ? "tm-status--rejected"
                                    : "tm-status--approved"
                        }`}
                    >
                        {statusDisplayMap[theme.status] || theme.status}
                    </div>

                    <div className="tm-lang-switch">
                        {["kk", "ru", "en"].map((lang) => (
                            <button
                                key={lang}
                                className={`tm-lang-btn ${
                                    language === lang ? "tm-lang-btn--active" : ""
                                }`}
                                onClick={() => setLanguage(lang)}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SCROLL */}
                <div className="tm-scroll-area">
                    <h2 className="tm-title">{getTitle()}</h2>
                    <p className="tm-subtitle">
                        {t('department.themeInfo')}
                    </p>

                    <div className="tm-body">
                        <div className="tm-info-grid">
                            <div className="tm-info-item">
                                <span className="tm-info-item__label">{t('supervisor.workType')}</span>
                                <span className="tm-info-item__value">{theme.type}</span>
                            </div>
                            <div className="tm-info-item">
                                <span className="tm-info-item__label">
                                    {t('department.scientificSupervisor')}
                                </span>
                                <span className="tm-info-item__value">
                                    {theme.supervisor}
                                </span>
                            </div>
                            <div className="tm-info-item">
                                <span className="tm-info-item__label">{t('department.submissionDate')}</span>
                                <span className="tm-info-item__value">
                                    {theme.submittedAt}
                                </span>
                            </div>
                        </div>

                        <div className="tm-section">
                            <span className="tm-section__title">
                                {t('department.themeDescription')}
                            </span>
                            <div className="tm-section__text">
                                <p>{getDescription()}</p>
                            </div>
                        </div>

                        {/* ПРИЧИНА ОТКАЗА (READ ONLY) */}
                        {isRejected && theme.rejectionReason && (
                            <div className="tm-rejected-info">
                                <span className="tm-rejected-info__label">
                                    {t('department.rejectionReason')}
                                </span>
                                <p className="tm-rejected-info__text">
                                    {theme.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="tm-footer">
                        {isPending ? (
                            !showRejection ? (
                                <div className="tm-footer__actions">
                                    <button
                                        className="tm-btn tm-btn--reject"
                                        onClick={() => setShowRejection(true)}
                                    >
                                        {t('department.reject')}
                                    </button>
                                    <button
                                        className="tm-btn tm-btn--approve"
                                        onClick={() =>
                                            onUpdateStatus(
                                                theme.id,
                                                "Утверждено"
                                            )
                                        }
                                    >
                                        {t('department.approve')}
                                    </button>
                                </div>
                            ) : (
                                <div className="tm-rejection-form">
                                    <h3 className="tm-rejection-form__title">
                                        {t('department.rejectionReasonTitle')}
                                    </h3>
                                    <textarea
                                        className="tm-rejection-form__textarea"
                                        placeholder={t('department.rejectReasonPlaceholder')}
                                        value={rejectionReason}
                                        onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                        }
                                        autoFocus
                                    />
                                    <div className="tm-rejection-form__buttons">
                                        <button
                                            className="tm-btn tm-btn--ghost"
                                            onClick={() => {
                                                setShowRejection(false);
                                                setRejectionReason("");
                                            }}
                                        >
                                            {t('common.cancel')}
                                        </button>
                                        <button
                                            className="tm-btn tm-btn--confirm-reject"
                                            onClick={handleReject}
                                            disabled={!rejectionReason.trim()}
                                        >
                                            {t('department.confirmRejection')}
                                        </button>
                                    </div>
                                </div>
                            )
                        ) : (
                            <button
                                className="tm-btn tm-btn--close"
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

export default ThemeModal;
