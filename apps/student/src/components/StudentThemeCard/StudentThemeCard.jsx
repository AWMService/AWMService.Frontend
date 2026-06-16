import React from 'react';
import { useTranslation } from 'react-i18next';
import './StudentThemeCard.css';

export function StudentThemeCard({ theme, isAlreadyAssigned, onApply, onCancel, onReapply }) {
    const { t } = useTranslation();
    const { title, description, supervisor, availableSlots, direction, status, isAssigned, rejectionReason } = theme;

    const renderStatusLabel = () => {
        if (status === 'applied') return <span className="status-text text-pending">● {t('student.pending')}</span>;
        if (status === 'approved') return <span className="status-text text-approved">● {t('student.approved')}</span>;
        if (status === 'rejected') return <span className="status-text text-rejected">● {t('student.rejected')}</span>;
        return null;
    };

    const renderAction = () => {
        const isFull = availableSlots === 0;

        if (isAssigned) {
            return (
                <span className="btn-compact btn-assigned">
                    {t('student.assigned', 'Закреплено')}
                </span>
            );
        }

        if (status === 'applied') {
            return (
                <button className="btn-compact btn-danger" onClick={() => onCancel(theme.id)}>
                    {t('common.cancel')}
                </button>
            );
        }
        if (status === 'rejected') {
            if (isAlreadyAssigned) {
                return (
                    <span className="btn-compact btn-disabled">
                        {t('student.alreadyAssigned', 'Уже закреплены')}
                    </span>
                );
            }
            return (
                <button className="btn-compact btn-primary" onClick={() => onReapply(theme.id)}>
                    {t('student.reapply')}
                </button>
            );
        }

        if (isAlreadyAssigned) {
            return (
                <span className="btn-compact btn-disabled">
                    {t('student.alreadyAssigned', 'Уже закреплены')}
                </span>
            );
        }

        return (
            <button
                className={`btn-compact ${isFull ? 'btn-disabled' : 'btn-outline-primary'}`}
                onClick={() => onApply(theme.id)}
                disabled={isFull}
            >
                {isFull ? t('student.occupied') : t('student.selectTheme')}
            </button>
        );
    };

    return (
        <div className={`theme-card-compact ${isAssigned ? 'assigned-border' : ''} ${status === 'rejected' ? 'rejected-border' : ''}`}>

            <div className="compact-header">
                <div className="header-left">
                    <span className="supervisor-sm">{supervisor}</span>
                    <span className="direction-badge">{direction}</span>
                </div>
                {renderStatusLabel()}
            </div>

            <div className="compact-body">
                <h4 className="title-sm">{title}</h4>
                <p className="desc-sm">{description}</p>

                {status === 'rejected' && rejectionReason && (
                    <div className="reject-note">
                        {t('student.reason')}{rejectionReason}
                    </div>
                )}
            </div>

            <div className="compact-footer">
                <div className="meta-row">
                    <span className="meta-item">{direction}</span>
                    <span className="meta-dot">•</span>
                    <span className={`meta-item ${availableSlots === 0 ? 'text-red' : ''}`}>
                    {availableSlots > 0 ? t('student.placesAvailable', { count: availableSlots }) : t('student.noPlaces')}
                </span>
                </div>
                {renderAction()}
            </div>

        </div>
    );
}
