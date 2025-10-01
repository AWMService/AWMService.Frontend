import React from "react";
import "./DirectionCard.css";
import DirectionStatusBadge from "../DirectionStatusBadge/DirectionStatusBadge";

const DirectionCard = ({ direction, onView }) => {
    return (
        <div className="direction-card">
            <div className="direction-header">
                <h2 className="direction-title">{direction.title}</h2>
                <DirectionStatusBadge status={direction.status} />
            </div>

            <p className="direction-desc">{direction.description}</p>


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
