import React, { useEffect, useState } from "react";
import { X, Calendar, BookOpen, Layers, Users, User, Info, Check, AlertCircle } from "lucide-react";
import "./TopicViewModal.css";

const statusLabels = {
    draft: "Черновик",
    pending: "На рассмотрении",
    approved: "Утверждено",
    rejected: "Отклонено",
};

const workTypeLabels = {
    diploma_project: "Дипломный проект",
    diploma_work: "Дипломная работа",
    course_work: "Курсовая работа",
};

export default function TopicViewModal({
                                           open,
                                           onClose,
                                           topic,
                                           onApproveStudent, // Функция: (requestId) => void
                                           onRejectStudent   // Функция: (requestId, reason) => void
                                       }) {
    const [titleTab, setTitleTab] = useState("ru");
    const [descTab, setDescTab] = useState("ru");

    // Логика отказа
    const [rejectingId, setRejectingId] = useState(null); // ID заявки, которую отклоняем
    const [rejectReason, setRejectReason] = useState(""); // Текст причины

    useEffect(() => {
        if (!topic) return;
        const availableTitles = topic.title || {};
        const availableDescriptions = topic.description || {};

        setTitleTab(availableTitles.ru ? "ru" : availableTitles.kk ? "kk" : "en");
        setDescTab(availableDescriptions.ru ? "ru" : availableDescriptions.kk ? "kk" : "en");

        // Сброс состояния при открытии новой темы
        setRejectingId(null);
        setRejectReason("");
    }, [topic]);

    if (!open || !topic) return null;

    // Списки
    const students = topic.students || []; // Уже принятые
    // Предполагаем, что заявки приходят в topic.requests.
    // Если структура другая, поменяйте это поле.
    const requests = topic.requests || [];

    const maxParticipants = topic.participantCount || 1;
    const remainingSlots = maxParticipants - students.length;

    const formatDate = (iso) => {
        if (!iso) return "—";
        try {
            return new Date(iso).toLocaleDateString("ru-RU", {
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
    };

    const handleCancelReject = () => {
        setRejectingId(null);
        setRejectReason("");
    };

    const handleSubmitReject = (reqId) => {
        if (!rejectReason.trim()) {
            alert("Пожалуйста, укажите причину отказа");
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
                        <h2>Детали темы</h2>
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
                                <label>Тип работы</label>
                                <span>{workTypeLabels[topic.workType] || topic.workType}</span>
                            </div>
                        </div>
                        <div className="tv-info-item">
                            <Users size={16} />
                            <div className="tv-info-content">
                                <label>Лимит мест</label>
                                <span>{maxParticipants} чел.</span>
                            </div>
                        </div>
                        <div className="tv-info-item">
                            <Calendar size={16} />
                            <div className="tv-info-content">
                                <label>Создано</label>
                                <span>{formatDate(topic.createdAt)}</span>
                            </div>
                        </div>
                        <div className="tv-info-item">
                            <Info size={16} />
                            <div className="tv-info-content">
                                <label>Направление</label>
                                <span>{topic.directionTitle || "Не указано"}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- НОВАЯ СЕКЦИЯ: ЗАЯВКИ (ТОЛЬКО ЕСЛИ ЕСТЬ) --- */}
                    {requests.length > 0 && (
                        <div className="tv-section requests-section">
                            <div className="tv-section-header">
                                <div className="tv-section-title">
                                    <AlertCircle size={18} className="text-orange" />
                                    <h3>Заявки на рассмотрении</h3>
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
                                                    <span className="tv-student-name">{req.student?.fullName || "Студент"}</span>
                                                    <span className="tv-req-date">Подано: {formatDate(req.createdAt)}</span>
                                                </div>
                                            </div>

                                            {/* Кнопки действий (скрываем, если открыта форма отказа) */}
                                            {rejectingId !== req.id && (
                                                <div className="tv-req-actions">
                                                    <button
                                                        className="tv-action-btn btn-approve"
                                                        title="Принять"
                                                        onClick={() => onApproveStudent && onApproveStudent(req.id)}
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className="tv-action-btn btn-reject"
                                                        title="Отказать"
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
                                                    placeholder="Укажите причину отказа..."
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="tv-reject-actions">
                                                    <button className="tv-btn-small btn-cancel" onClick={handleCancelReject}>
                                                        Отмена
                                                    </button>
                                                    <button className="tv-btn-small btn-confirm-reject" onClick={() => handleSubmitReject(req.id)}>
                                                        Отказать
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
                                <h3>Состав группы</h3>
                            </div>
                            {remainingSlots > 0 && (
                                <span className="tv-remaining-slots">
                                    Осталось мест: {remainingSlots}
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
                                            <span className="tv-student-name">{student.fullName}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="tv-empty-box">
                                    В этой теме пока нет утвержденных студентов
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Название */}
                    <div className="tv-section">
                        <div className="tv-section-header">
                            <div className="tv-section-title">
                                <BookOpen size={18} />
                                <h3>Название темы</h3>
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
                            {topic.title?.[titleTab] || <span className="tv-empty-text">Нет данных</span>}
                        </div>
                    </div>

                    {/* Описание */}
                    <div className="tv-section">
                        <div className="tv-section-header">
                            <div className="tv-section-title">
                                <Info size={18} />
                                <h3>Описание и задачи</h3>
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
                            {topic.description?.[descTab] || <span className="tv-empty-text">Описание отсутствует</span>}
                        </div>
                    </div>
                </div>

                <div className="tv-footer">
                    <button className="tv-btn-primary" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}