import React from "react";
import { useTranslation } from "react-i18next";
import "./DirectionStatusBadge.css";

const statusKeyMap = {
    "Утверждено": "status.approved",
    "На рассмотрении": "status.underReview",
    "Отклонено": "status.rejected",
};

const DirectionStatusBadge = ({ status }) => {
    const { t } = useTranslation();

    const statusClass = {
        "Утверждено": "badge-active",
        "На рассмотрении": "badge-pending",
        "Отклонено": "badge-closed",
    }[status] || "badge-default";

    const translatedStatus = statusKeyMap[status] ? t(statusKeyMap[status]) : status;

    return <span className={`status-badge ${statusClass}`}>{translatedStatus}</span>;
};

export default DirectionStatusBadge;
