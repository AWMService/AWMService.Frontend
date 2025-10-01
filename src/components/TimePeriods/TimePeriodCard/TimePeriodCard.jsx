import React from "react";
import Button from "../Button/Button";
import "./TimePeriodCard.css";

export default function TimePeriodCard({ period, onEdit, onDelete }) {
    return (
        <div className="period-card">
            <h3>{period.name}</h3>
            <p>Начало: {period.startDate}</p>
            <p>Окончание: {period.endDate}</p>
            <div className="card-buttons">
                <Button onClick={() => onEdit(period)}>Редактировать</Button>
                <Button className="danger" onClick={() => onDelete(period.id)}>
                    Удалить
                </Button>
            </div>
        </div>
    );
}
