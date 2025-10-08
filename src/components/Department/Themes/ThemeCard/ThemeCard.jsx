import React from "react";
import "./ThemeCard.css";
import DirectionStatusBadge from "../../Directions/DirectionStatusBadge/DirectionStatusBadge.jsx";

const ThemeCard = ({ theme, onView, language = "ru" }) => {
    return (
        <div className="theme-card">
            <div className="theme-header">
                <h3 className="theme-title">{theme.title[language]}</h3>
                <DirectionStatusBadge status={theme.status} />
            </div>

            <p className="theme-desc">{theme.description[language]}</p>

            <div className="theme-footer">
                <div className="theme-supervisor">{theme.supervisor}</div>
                <div className="theme-date">Подано: {theme.submittedAt}</div>
            </div>

            <button className="theme-view-btn" onClick={() => onView(theme)}>
                Подробнее
            </button>
        </div>
    );
};

export default ThemeCard;
