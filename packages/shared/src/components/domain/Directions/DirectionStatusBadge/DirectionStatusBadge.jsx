import React from "react";
import { useTranslation } from "react-i18next";
import "./DirectionStatusBadge.css";

const statusToKey = {
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

    return <span className={`status-badge ${statusClass}`}>{statusToKey[status] ? t(statusToKey[status]) : status}</span>;
};

export default DirectionStatusBadge;
