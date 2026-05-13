import React from "react";
import "./DirectionCard.css";
import DirectionStatusBadge from "../DirectionStatusBadge/DirectionStatusBadge.jsx";
const DirectionCard = ({ direction, onView, language = "ru" }) => {
    return (
        <div className="direction-card">
            <div className="direction-header">
                <h2 className="direction-title">{direction.title[language]}</h2>
                <DirectionStatusBadge status={direction.status} />
            </div>

            <p className="direction-desc">{direction.description[language]}</p>

            <div className="direction-footer">
                <div className="direction-supervisor">{direction.supervisor}</div>
                <div className="direction-date">Подано: {direction.submittedAt}</div>
            </div>

            <button className="view-btn" onClick={() => onView(direction)}>
                Смотреть
            </button>
        </div>
    );
};

export default DirectionCard;
