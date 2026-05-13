import React from 'react';
import { useTranslation } from 'react-i18next';
import './StudentApplicationCard.css';

export function StudentApplicationCard({ application }) {
    const { t } = useTranslation();

    const statusMap = {
        pending: { text: t('student.pending'), className: 'status-pending' },
        approved: { text: t('student.approved'), className: 'status-approved' },
        rejected: { text: t('student.rejected'), className: 'status-rejected' },
    };

    const status = statusMap[application.status] || statusMap.pending;
    return (
        <div className="student-application-card">
            <div className="app-card-content">
                <h3 className="app-card-title">{application.title}</h3>
                <p className="app-card-supervisor">{t('student.scientificSupervisor')} {application.supervisor}</p>
            </div>
            <div className="app-card-status">
                <span className={`status-badge ${status.className}`}>{status.text}</span>
                <button className="cancel-button">{t('common.cancel')}</button>
            </div>
        </div>
    );
}
