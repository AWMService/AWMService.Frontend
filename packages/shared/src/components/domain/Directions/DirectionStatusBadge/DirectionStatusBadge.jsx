import React from "react";
import { useTranslation } from "react-i18next";
import "./DirectionStatusBadge.css";

const DirectionStatusBadge = ({ status }) => {
    const { t } = useTranslation();
    const statusClass = {
        "approved": "badge-active",
        "pending": "badge-pending",
        "rejected": "badge-closed",
        "closed": "badge-closed",
        "revision": "badge-default",
        "draft": "badge-default",
    }[status] || "badge-default";

    const key = {
        "approved": "status.approved",
        "pending": "status.underReview",
        "rejected": "status.rejected",
        "revision": "status.revision",
        "draft": "status.draft",
        "closed": "status.closed",
    }[status] || status;

    return <span className={`status-badge ${statusClass}`}>{t(key)}</span>;
};
export default DirectionStatusBadge;
