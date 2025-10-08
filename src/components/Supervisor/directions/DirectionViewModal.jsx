import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import "./DirectionViewModal.css";

export default function DirectionViewModal({ onClose, direction }) {
    const [titleTab, setTitleTab] = useState("en");
    const [descTab, setDescTab] = useState("kk");

    useEffect(() => {
        if (direction) {
            // выбор языка для заголовка
            if (direction.title?.en) setTitleTab("en");
            else if (direction.title?.ru) setTitleTab("ru");
            else setTitleTab("kk");

            // выбор языка для описания
            if (direction.description?.kk) setDescTab("kk");
            else if (direction.description?.ru) setDescTab("ru");
            else setDescTab("en");
        }
    }, [direction]);

    if (!direction) return null;

    const formatDate = (iso) => {
        if (!iso) return "-";
        try {
            return new Date(iso).toLocaleDateString("ru-RU");
        } catch {
            return iso ?? "-";
        }
    };

    return (
        <div className="dvm-overlay" role="dialog" aria-modal="true">
            <div className="dvm-modal">
                {/* Header */}
                <div className="dvm-header">
                    <h2>Просмотр направления</h2>
                    <div className="dvm-header-right">
                        <div className="dvm-status">
                            {direction.status === "approved"
                                ? "Утверждено"
                                : direction.status ?? "-"}
                        </div>
                        <button
                            className="dvm-close"
                            onClick={onClose}
                            aria-label="Закрыть"
                        >
                            <X />
                        </button>
                    </div>
                </div>

                {/* Даты */}
                <div className="dvm-dates">
                    <div className="dvm-date-item">
                        <Calendar />
                        <div>
                            <div className="dvm-date-label">Дата добавления:</div>
                            <div className="dvm-date-value">
                                {formatDate(direction.createdAt)}
                            </div>
                        </div>
                    </div>

                    <div className="dvm-date-item">
                        <Calendar />
                        <div>
                            <div className="dvm-date-label">Дата утверждения:</div>
                            <div className="dvm-date-value">
                                {formatDate(direction.approvedAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Название */}
                <div className="dvm-section">
                    <h3 className="dvm-section-title">
                        <span className="dvm-icon">📘</span> Название направления
                    </h3>

                    <div className="dvm-tabs">
                        <button
                            className={`dvm-tab ${titleTab === "kk" ? "active" : ""}`}
                            onClick={() => setTitleTab("kk")}
                        >
                            Қазақша
                        </button>
                        <button
                            className={`dvm-tab ${titleTab === "ru" ? "active" : ""}`}
                            onClick={() => setTitleTab("ru")}
                        >
                            Русский
                        </button>
                        <button
                            className={`dvm-tab ${titleTab === "en" ? "active" : ""}`}
                            onClick={() => setTitleTab("en")}
                        >
                            English
                        </button>
                    </div>

                    <div className="dvm-box">
                        {titleTab === "kk" && (
                            <div className="dvm-text">{direction.title?.kk ?? "-"}</div>
                        )}
                        {titleTab === "ru" && (
                            <div className="dvm-text">{direction.title?.ru ?? "-"}</div>
                        )}
                        {titleTab === "en" && (
                            <div className="dvm-text">{direction.title?.en ?? "-"}</div>
                        )}
                    </div>
                </div>

                {/* Описание */}
                <div className="dvm-section">
                    <h3 className="dvm-section-title">Описание направления</h3>

                    <div className="dvm-tabs">
                        <button
                            className={`dvm-tab ${descTab === "kk" ? "active" : ""}`}
                            onClick={() => setDescTab("kk")}
                        >
                            Қазақша
                        </button>
                        <button
                            className={`dvm-tab ${descTab === "ru" ? "active" : ""}`}
                            onClick={() => setDescTab("ru")}
                        >
                            Русский
                        </button>
                        <button
                            className={`dvm-tab ${descTab === "en" ? "active" : ""}`}
                            onClick={() => setDescTab("en")}
                        >
                            English
                        </button>
                    </div>

                    <div className="dvm-box dvm-box--large">
                        {descTab === "kk" && (
                            <div className="dvm-text">
                                {direction.description?.kk ?? "-"}
                            </div>
                        )}
                        {descTab === "ru" && (
                            <div className="dvm-text">
                                {direction.description?.ru ?? "-"}
                            </div>
                        )}
                        {descTab === "en" && (
                            <div className="dvm-text">
                                {direction.description?.en ?? "-"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
