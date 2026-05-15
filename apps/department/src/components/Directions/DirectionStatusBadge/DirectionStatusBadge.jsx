import React from "react";
import { useTranslation } from "react-i18next";
import "./DirectionStatusBadge.css";

const statusKeyMap = {
    draft: "status.draft",
    pending: "status.underReview",
    approved: "status.approved",
    rejected: "status.rejected",
    revision: "status.revision",
    "Утверждено": "status.approved",
    "На рассмотрении": "status.underReview",
    "Отклонено": "status.rejected",
};

const DirectionStatusBadge = ({ status }) => {
    const { t } = useTranslation();

    const statusClass = {
        draft: "badge-default",
        pending: "badge-pending",
        approved: "badge-active",
        rejected: "badge-closed",
        revision: "badge-revision",
        "Утверждено": "badge-active",
        "На рассмотрении": "badge-pending",
        "Отклонено": "badge-closed",
    }[status] || "badge-default";

    const translatedStatus = statusKeyMap[status] ? t(statusKeyMap[status]) : status;

    return <span className={`status-badge ${statusClass}`}>{translatedStatus}</span>;
};

export default DirectionStatusBadge;
