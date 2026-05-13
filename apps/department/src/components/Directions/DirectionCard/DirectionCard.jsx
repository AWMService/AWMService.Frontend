import React from "react";
import { useTranslation } from "react-i18next";
import { normalizeLanguage, getLocalizedValue } from "@awm/shared";
import "./DirectionCard.css";
import DirectionStatusBadge from "../DirectionStatusBadge/DirectionStatusBadge.jsx";
const DirectionCard = ({ direction, onView, language }) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = normalizeLanguage(language || i18n.language);

    return (
        <div className="direction-card">
            <div className="direction-header">
                <h2 className="direction-title">
                    {getLocalizedValue(direction.title, currentLanguage)}
                </h2>
                <DirectionStatusBadge status={direction.status} />
            </div>

            <p className="direction-desc">
                {getLocalizedValue(direction.description, currentLanguage)}
            </p>

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
