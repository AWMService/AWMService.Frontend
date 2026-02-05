import React from 'react';
import './StudentApplicationCard.css';

const statusMap = {
    pending: { text: 'На рассмотрении', className: 'status-pending' },
    approved: { text: 'Одобрена', className: 'status-approved' },
    rejected: { text: 'Отклонена', className: 'status-rejected' },
};

export function StudentApplicationCard({ application }) {
    const status = statusMap[application.status] || statusMap.pending;
    return (
        <div className="student-application-card">
            <div className="app-card-content">
                <h3 className="app-card-title">{application.title}</h3>
                <p className="app-card-supervisor">Научный руководитель: {application.supervisor}</p>
            </div>
            <div className="app-card-status">
                <span className={`status-badge ${status.className}`}>{status.text}</span>
                <button className="cancel-button">Отменить заявку</button>
            </div>
        </div>
    );
}
