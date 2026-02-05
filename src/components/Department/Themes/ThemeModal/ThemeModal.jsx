import React, { useState } from "react";
import "./ThemeModal.css";

const ThemeModal = ({ theme, onClose, onUpdateStatus }) => {
    const [showRejection, setShowRejection] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [language, setLanguage] = useState("ru");

    if (!theme) return null;

    const isPending = theme.status === "На рассмотрении";

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert("Укажите причину отклонения.");
            return;
        }
        onUpdateStatus(theme.id, "Отклонено", rejectionReason);
        onClose();
    };

    const getTitle = () => theme.title[language];
    const getDescription = () => theme.description[language];

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
                <p className="modal-subtitle">Информация по теме дипломной работы</p>

                <div className="modal-info">
                    <p><strong>Статус:</strong> {theme.status}</p>
                    <p><strong>Тип работы:</strong> {theme.type}</p>
                    <p><strong>Научный руководитель:</strong> {theme.supervisor}</p>

                    <p><strong>Студент{theme.students?.length > 1 ? "ы" : ""}:</strong></p>

                    {theme.students && theme.students.length > 0 ? (
                        <ul className="students-list">
                            {theme.students.map((student) => (
                                <li key={student.id}>
                                    {student.fullName}
                                    {student.group && (
                                        <span className="student-group"> ({student.group})</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-students">Студент не назначен</p>
                    )}

                    <p><strong>Название темы:</strong> {getTitle()}</p>
                    <p><strong>Описание темы:</strong> {getDescription()}</p>
                    <p><strong>Дата подачи:</strong> {theme.submittedAt}</p>

                </div>

                <div className="modal-actions">
                    {isPending ? (
                        !showRejection ? (
                            <>
                                <button className="reject-btn" onClick={() => setShowRejection(true)}>Отклонить</button>
                                <button className="approve-btn" onClick={() => onUpdateStatus(theme.id, "Утверждено")}>Утвердить</button>
                            </>
                        ) : (
                            <div className="rejection-section">
                                <textarea
                                    placeholder="Укажите причину отклонения..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={4}
                                />
                                <button className="confirm-reject-btn" onClick={handleReject}>Подтвердить отклонение</button>
                                <button className="cancel-btn" onClick={() => { setShowRejection(false); setRejectionReason(""); }}>Отмена</button>
                            </div>
                        )
                    ) : (
                        <button className="close-btn" onClick={onClose}>Закрыть</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThemeModal;
