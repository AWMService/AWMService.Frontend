import React from 'react';
import './StudentThemeCard.css';

export function StudentThemeCard({ theme, onApply, onCancel, onReapply }) {
    const { title, description, supervisor, availableSlots, direction, status, rejectionReason } = theme;

    // Мини-бэджик статуса (только текст и цвет)
    const renderStatusLabel = () => {
        if (status === 'applied') return <span className="status-text text-pending">● На рассмотрении</span>;
        if (status === 'rejected') return <span className="status-text text-rejected">● Отклонено</span>;
        return null;
    };

    const renderAction = () => {
        const isFull = availableSlots === 0;

        if (status === 'applied') {
            return (
                <button className="btn-compact btn-danger" onClick={() => onCancel(theme.id)}>
                    Отменить
                </button>
            );
        }
        if (status === 'rejected') {
            return (
                <button className="btn-compact btn-primary" onClick={() => onReapply(theme.id)}>
                    Повторить
                </button>
            );
        }

        return (
            <button
                className={`btn-compact ${isFull ? 'btn-disabled' : 'btn-outline-primary'}`}
                onClick={() => onApply(theme.id)}
                disabled={isFull}
            >
                {isFull ? 'Занято' : 'Выбрать'}
            </button>
        );
    };

    return (
        <div className={`theme-card-compact ${status === 'rejected' ? 'rejected-border' : ''}`}>

            {/* ВЕРХ: Руководитель + Статус */}
            <div className="compact-header">
                <span className="supervisor-sm">{supervisor}</span>
                {renderStatusLabel()}
            </div>

            {/* ЦЕНТР: Заголовок + Описание */}
            <div className="compact-body">
                <h4 className="title-sm">{title}</h4>
                <p className="desc-sm">{description}</p>

                {status === 'rejected' && rejectionReason && (
                    <div className="reject-note">
                        Причина: {rejectionReason}
                    </div>
                )}
            </div>

            {/* НИЗ: Инфо + Кнопка */}
            <div className="compact-footer">
                <div className="meta-row">
                    <span className="meta-item">{direction}</span>
                    <span className="meta-dot">•</span>
                    <span className={`meta-item ${availableSlots === 0 ? 'text-red' : ''}`}>
                    {availableSlots > 0 ? `${availableSlots} места` : 'Мест нет'}
                </span>
                </div>
                {renderAction()}
            </div>

        </div>
    );
}