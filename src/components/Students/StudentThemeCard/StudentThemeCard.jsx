import React from 'react';
import './StudentThemeCard.css';

export function StudentThemeCard({ theme, onApply, onCancel, onReapply }) {
  const { title, description, supervisor, availableSlots, direction, status, rejectionReason } = theme;

  const renderStatusBadge = () => {
    if (status === 'applied') {
      return <span className="status-badge status-pending">На рассмотрении</span>;
    }
    if (status === 'rejected') {
      return <span className="status-badge status-rejected">Отклонена</span>;
    }
    return null;
  };

  const renderActions = () => {
    switch (status) {
      case 'applied':
        return <button className="cancel-button" onClick={() => onCancel(theme.id)}>Отменить заявку</button>;
      case 'rejected':
        return <button className="apply-button" onClick={() => onReapply(theme.id)}>Подать заявку повторно</button>;
      default:
        return <button className="apply-button" onClick={() => onApply(theme.id)}>Подать заявку</button>;
    }
  };

  return (
    <div className="student-theme-card">
      {renderStatusBadge()}
      <div className="card-main-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-tags">
          <span className="tag tag-supervisor">{supervisor}</span>
          <span className="tag tag-slots">Доступные места: {availableSlots}</span>
          <span className="tag tag-direction">{direction}</span>
        </div>
        {status === 'rejected' && rejectionReason && (
          <div className="rejection-reason-box">
            <strong>Причина отклонения:</strong> {rejectionReason}
          </div>
        )}
      </div>
      <div className="card-actions">
        {renderActions()}
      </div>
    </div>
  );
}
