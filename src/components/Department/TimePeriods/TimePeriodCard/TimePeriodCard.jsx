import React from "react";
import { useNavigate } from "react-router-dom";
import "./TimePeriodCard.css";

export default function TimePeriodCard({ period, onDelete }) {
    const navigate = useNavigate();

    const handleSetupClick = () => {
        navigate(`/department/time-periods/${period.id}/setup`);
    };

    return (
        <div className="tp-card">
            {/* ===== Header ===== */}
            <div className="tp-card__header">
                <div>
                    <h3 className="tp-card__title">
                        {period.name || period.title}
                    </h3>
                    <p className="tp-card__dates">
                        Начало: <strong>{period.startDate}</strong> · Окончание:{" "}
                        <strong>{period.endDate}</strong>
                    </p>
                </div>

                <div className="tp-card__header-actions">
                    <span className="tp-card__status">Предстоящий</span>

                    <button
                        className="tp-card__icon-btn tp-card__icon-btn--danger"
                        title="Удалить период"
                        onClick={onDelete}
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ===== Progress ===== */}
            <div className="tp-card__progress-wrapper">
                <div className="tp-card__progress-bar">
                    <div
                        className="tp-card__progress-fill"
                        style={{ width: `${period.progress}%` }}
                    />
                </div>
                <span className="tp-card__progress-text">{period.progress}%</span>
            </div>

            {/* ===== Summary ===== */}
            <div className="tp-card__summary">
                <span>Комиссии: {period.commissions}</span>
                <span>Студенты: {period.students}</span>
                <span>Даты: {period.dates}</span>
            </div>

            {/* ===== Actions ===== */}
            <div className="tp-card__actions">
                <button
                    className="tp-card__action-btn"
                    onClick={handleSetupClick}
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                    Настроить
                </button>

                <button
                    className="tp-card__action-btn"
                    onClick={() =>
                        navigate(`/department/time-periods/${period.id}/schedule`)
                    }
                >
                    <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Расписание
                </button>

            </div>
        </div>
    );
}