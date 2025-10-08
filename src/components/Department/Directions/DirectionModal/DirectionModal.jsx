import React, { useState } from "react";
import "./DirectionModal.css";

const DirectionModal = ({ direction, onClose, onUpdateStatus }) => {

    const [showRejection, setShowRejection] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [language, setLanguage] = useState("ru"); // ru, kz, en


    if (!direction) return null;

    const isPending = direction.status === "На рассмотрении";

    const handleReject = () => {
        if (rejectionReason.trim() === "") {
            alert("Пожалуйста, укажите причину отклонения.");
            return;
        }
        onUpdateStatus(direction.id, "Отклонено", rejectionReason);
        onClose();
    };

    const getTitle = () => direction.title[language];
    const getDescription = () => direction.description[language];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="language-switcher">
                    {["ru", "kz", "en"].map((lang) => (
                        <button
                            key={lang}
                            className={language === lang ? "active-lang" : ""}
                            onClick={() => setLanguage(lang)}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                <h2 className="modal-title">{getTitle()}</h2>
                <p className="modal-subtitle">
                    Детальная информация о направлении для принятия решения по утверждению
                </p>

                <div className="modal-info">
                    <p><strong>Статус:</strong> {direction.status}</p>
                    <p><strong>Тип работы:</strong> {direction.type}</p>
                    <p><strong>Научный руководитель (НР):</strong> {direction.supervisor}</p>
                    <p><strong>Название направления:</strong> {getTitle()}</p>
                    <p><strong>Описание направления:</strong> {getDescription()}</p>
                    <p><strong>Дата подачи:</strong> {direction.submittedAt}</p>
                </div>

                <div className="modal-actions">
                    {isPending ? (
                        !showRejection ? (
                            <>
                                <button
                                    className="reject-btn"
                                    onClick={() => setShowRejection(true)}
                                >
                                    Отклонить
                                </button>
                                <button
                                    className="approve-btn"
                                    onClick={() => onUpdateStatus(direction.id, "Утверждено")}
                                >
                                    Утвердить направление
                                </button>
                            </>
                        ) : (
                            <div className="rejection-section">
                                <textarea
                                    placeholder="Укажите причину отклонения..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={4}
                                />
                                <button className="confirm-reject-btn" onClick={handleReject}>
                                    Подтвердить отклонение
                                </button>
                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowRejection(false);
                                        setRejectionReason("");
                                    }}
                                >
                                    Отмена
                                </button>
                            </div>
                        )
                    ) : (
                        <button className="close-btn" onClick={onClose}>
                            Закрыть
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DirectionModal;
