import React, { useEffect, useState } from "react";
import { X, Calendar } from "lucide-react";
import "./TopicViewModal.css";

export default function TopicViewModal({ open, onClose, topic }) {
    const [titleTab, setTitleTab] = useState("ru");
    const [descTab, setDescTab] = useState("ru");

    useEffect(() => {
        if (!topic) return;

        // Выбор дефолтного языка — предпочтительно ru → kk → en
        const availableTitles = topic.title || {};
        const availableDescriptions = topic.description || {};

        setTitleTab(
            availableTitles.ru ? "ru" : availableTitles.kk ? "kk" : "en"
        );

        setDescTab(
            availableDescriptions.ru
                ? "ru"
                : availableDescriptions.kk
                    ? "kk"
                    : "en"
        );
    }, [topic]);

    if (!open || !topic) return null;

    const formatDate = (iso) => {
        if (!iso) return "-";
        try {
            return new Date(iso).toLocaleDateString("ru-RU");
        } catch {
            return iso;
        }
    };

    return (
        <div className="tv-overlay" role="dialog" aria-modal="true">
            <div className="tv-modal">
                <button className="tv-close" onClick={onClose} aria-label="Закрыть">
                    <X />
                </button>

                <header className="tv-header">
                    <h2>Просмотр темы</h2>
                    <p className="tv-sub">Детали темы дипломного проекта</p>
                </header>

                <div className="tv-body">
                    <div className="tv-required-box">
                        <div className="tv-required">
                            Статус: {topic.status ? topic.status.toUpperCase() : "-"}
                        </div>
                    </div>

                    <div className="tv-dates">
                        <div className="tv-date-item">
                            <Calendar />
                            <div>
                                <div className="tv-date-label">Дата добавления</div>
                                <div className="tv-date-value">{formatDate(topic.createdAt)}</div>
                            </div>
                        </div>

                        <div className="tv-date-item">
                            <Calendar />
                            <div>
                                <div className="tv-date-label">Дата утверждения</div>
                                <div className="tv-date-value">
                                    {topic.approvedAt
                                        ? formatDate(topic.approvedAt)
                                        : topic.status === "approved"
                                            ? "-"
                                            : "Ещё не утверждена"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tv-row">
                        <label className="tv-label">Направление</label>
                        <div className="tv-box">
                            {topic.directionTitle ?? topic.direction ?? "-"}
                        </div>
                    </div>

                    <div className="tv-row">
                        <label className="tv-label">Тип работы</label>
                        <div className="tv-box">
                            {topic.workTypeLabel ?? topic.workType ?? "-"}
                        </div>
                    </div>

                    <div className="tv-row">
                        <label className="tv-label">Количество студентов</label>
                        <div className="tv-box">
                            {topic.participantCount ?? topic.studentCount ?? "-"}
                        </div>
                    </div>

                    {/* Название темы */}
                    <div className="tv-section">
                        <h3 className="tv-section-title">Название темы</h3>
                        <div className="tv-tabs">
                            {["kk", "ru", "en"].map((lang) => (
                                <button
                                    key={lang}
                                    className={`tv-tab ${titleTab === lang ? "active" : ""}`}
                                    onClick={() => setTitleTab(lang)}
                                >
                                    {lang === "kk"
                                        ? "Қазақша"
                                        : lang === "ru"
                                            ? "Русский"
                                            : "English"}
                                </button>
                            ))}
                        </div>
                        <div className="tv-box tv-box--large">
                            {topic.title?.[titleTab] ??
                                (typeof topic.title === "string" ? topic.title : "-")}
                        </div>
                    </div>

                    {/* Описание темы */}
                    <div className="tv-section">
                        <h3 className="tv-section-title">Описание темы</h3>
                        <div className="tv-tabs">
                            {["kk", "ru", "en"].map((lang) => (
                                <button
                                    key={lang}
                                    className={`tv-tab ${descTab === lang ? "active" : ""}`}
                                    onClick={() => setDescTab(lang)}
                                >
                                    {lang === "kk"
                                        ? "Қазақша"
                                        : lang === "ru"
                                            ? "Русский"
                                            : "English"}
                                </button>
                            ))}
                        </div>
                        <div className="tv-box tv-box--large">
                            {topic.description?.[descTab] ??
                                (typeof topic.description === "string"
                                    ? topic.description
                                    : "-")}
                        </div>
                    </div>
                </div>

                <div className="tv-actions">
                    <button className="btn btn-outline" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}
