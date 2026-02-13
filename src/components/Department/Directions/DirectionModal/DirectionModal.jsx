import React, { useState } from "react";
import "./DirectionModal.css";

const DirectionModal = ({ direction, onClose, onUpdateStatus }) => {
    const [showRejection, setShowRejection] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [language, setLanguage] = useState("ru");

    if (!direction) return null;

    const isPending = direction.status === "На рассмотрении";
    const isRejected = direction.status === "Отклонено";

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            return; // Дополнительная защита
        }

        onUpdateStatus(direction.id, "Отклонено", rejectionReason);
        handleClose();
    };

    const handleClose = () => {
        setShowRejection(false);
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
                {/* HEADER */}
                <div className="dm-header">
                    <div
                        className={`dm-status ${
                            isPending
                                ? "dm-status--pending"
                                : isRejected
                                    ? "dm-status--rejected"
                                    : "dm-status--approved"
                        }`}
                    >
                        {direction.status}
                    </div>

                    <div className="dm-lang-switch">
                        {["ru", "kz", "en"].map((lang) => (
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
                        Информация о направлении дипломной работы
                    </p>

                    <div className="dm-body">
                        <div className="dm-info-grid">
                            <div className="dm-info-item">
                                <span className="dm-info-item__label">Тип работы</span>
                                <span className="dm-info-item__value">{direction.type}</span>
                            </div>
                            <div className="dm-info-item">
                                <span className="dm-info-item__label">
                                    Научный руководитель
                                </span>
                                <span className="dm-info-item__value">
                                    {direction.supervisor}
                                </span>
                            </div>
                            <div className="dm-info-item">
                                <span className="dm-info-item__label">Дата подачи</span>
                                <span className="dm-info-item__value">
                                    {direction.submittedAt}
                                </span>
                            </div>
                        </div>

                        <div className="dm-section">
                            <span className="dm-section__title">
                                Описание направления
                            </span>
                            <div className="dm-description-box">
                                <p>{getDescription()}</p>
                            </div>
                        </div>

                        {/* ПРИЧИНА ОТКАЗА (ПОСЛЕ ОТКЛОНЕНИЯ) */}
                        {isRejected && direction.rejectionReason && (
                            <div className="dm-rejected-info">
                                <span className="dm-rejected-info__label">
                                    Причина отказа
                                </span>
                                <p className="dm-rejected-info__text">
                                    {direction.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="dm-footer">
                        {isPending ? (
                            !showRejection ? (
                                <div className="dm-footer__actions">
                                    <button
                                        className="dm-btn dm-btn--reject"
                                        onClick={() =>
                                            setShowRejection(true)
                                        }
                                    >
                                        Отклонить
                                    </button>
                                    <button
                                        className="dm-btn dm-btn--approve"
                                        onClick={() =>
                                            onUpdateStatus(
                                                direction.id,
                                                "Утверждено"
                                            )
                                        }
                                    >
                                        Утвердить
                                    </button>
                                </div>
                            ) : (
                                <div className="dm-rejection-form">
                                    <h3 className="dm-rejection-form__title">
                                        Причина отклонения
                                    </h3>
                                    <textarea
                                        className="dm-rejection-form__textarea"
                                        placeholder="Подробно опишите, что нужно исправить..."
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
                                                setShowRejection(false);
                                                setRejectionReason("");
                                            }}
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            className="dm-btn dm-btn--confirm-reject"
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
                                className="dm-btn dm-btn--close"
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

export default DirectionModal;