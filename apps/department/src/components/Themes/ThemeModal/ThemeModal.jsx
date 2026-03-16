import React, { useState } from "react";
import "./ThemeModal.css";

const ThemeModal = ({ theme, onClose, onUpdateStatus }) => {
    const [showRejection, setShowRejection] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [language, setLanguage] = useState("ru");

    if (!theme) return null;

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

    const getTitle = () => theme.title[language];
    const getDescription = () => theme.description[language];

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
                        {theme.status}
                    </div>

                    <div className="tm-lang-switch">
                        {["ru", "kz", "en"].map((lang) => (
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
                        Информация по теме дипломной работы
                    </p>

                    <div className="tm-body">
                        <div className="tm-info-grid">
                            <div className="tm-info-item">
                                <span className="tm-info-item__label">Тип работы</span>
                                <span className="tm-info-item__value">{theme.type}</span>
                            </div>
                            <div className="tm-info-item">
                                <span className="tm-info-item__label">
                                    Научный руководитель
                                </span>
                                <span className="tm-info-item__value">
                                    {theme.supervisor}
                                </span>
                            </div>
                            <div className="tm-info-item">
                                <span className="tm-info-item__label">Дата подачи</span>
                                <span className="tm-info-item__value">
                                    {theme.submittedAt}
                                </span>
                            </div>
                        </div>

                        <div className="tm-section">
                            <span className="tm-section__title">
                                Описание темы
                            </span>
                            <div className="tm-section__text">
                                <p>{getDescription()}</p>
                            </div>
                        </div>

                        {/* ПРИЧИНА ОТКАЗА (READ ONLY) */}
                        {isRejected && theme.rejectionReason && (
                            <div className="tm-rejected-info">
                                <span className="tm-rejected-info__label">
                                    Причина отказа
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
                                        Отклонить
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
                                        Утвердить
                                    </button>
                                </div>
                            ) : (
                                <div className="tm-rejection-form">
                                    <h3 className="tm-rejection-form__title">
                                        Причина отклонения
                                    </h3>
                                    <textarea
                                        className="tm-rejection-form__textarea"
                                        placeholder="Подробно опишите, что нужно исправить..."
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
                                            Отмена
                                        </button>
                                        <button
                                            className="tm-btn tm-btn--confirm-reject"
                                            onClick={handleReject}
                                            disabled={!rejectionReason.trim()}
                                        >
                                            Подтвердить отказ
                                        </button>
                                    </div>
                                </div>
                            )
                        ) : (
                            <button
                                className="tm-btn tm-btn--close"
                                onClick={handleClose}
                            >
                                Закрыть
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeModal;