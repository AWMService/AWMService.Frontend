import React from "react";
import "./DirectionModal.css";

const DirectionModal = ({ direction, onClose, onUpdateStatus }) => {
    if (!direction) return null;

    const isPending = direction.status === "На рассмотрении";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Рассмотрение направления</h2>
                <p className="modal-subtitle">
                    Детальная информация о направлении для принятия решения по утверждению
                </p>

                <div className="modal-info">
                    <p><strong>Статус:</strong> {direction.status}</p>
                    <p><strong>Тип работы:</strong> {direction.type}</p>
                    <p><strong>Научный руководитель (НР):</strong> {direction.supervisor}</p>
                    <p><strong>Специализация:</strong> {direction.specialization}</p>
                    <p><strong>Описание направления:</strong> {direction.description}</p>
                    <p><strong>Дата подачи:</strong> {direction.submittedAt}</p>
                </div>

                <div className="modal-actions">
                    {isPending ? (
                        <>
                            <button
                                className="reject-btn"
                                onClick={() => onUpdateStatus(direction.id, "Отклонено")}
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
