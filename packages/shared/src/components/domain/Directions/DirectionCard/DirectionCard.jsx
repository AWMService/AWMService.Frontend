import React from "react";
import { useTranslation } from "react-i18next";
import "./DirectionCard.css";
import DirectionStatusBadge from "../DirectionStatusBadge/DirectionStatusBadge.jsx";
const DirectionCard = ({ direction, onView, language = "ru" }) => {
    const { t } = useTranslation();
    return (
        <div className="direction-card">
            <div className="direction-header">
                <h2 className="direction-title">{direction.title[language]}</h2>
                <DirectionStatusBadge status={direction.status} />
            </div>
            <p className="direction-desc">{direction.description[language]}</p>
            <div className="direction-footer">
                <div className="direction-supervisor">{direction.supervisor}</div>
                <div className="direction-date">{t('department.submitted')}{direction.submittedAt}</div>
            </div>
            <button className="view-btn" onClick={() => onView(direction)}>
                {t('department.viewDetails')}
            </button>
        </div>
    );
};
export default DirectionCard;
