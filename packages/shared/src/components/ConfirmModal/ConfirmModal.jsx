import React from 'react';
import { useTranslation } from 'react-i18next';
import './ConfirmModal.css';

export function ConfirmModal({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText,
    cancelText,
    variant = 'primary' // 'primary' | 'danger'
}) {
    const { t } = useTranslation();
    
    if (!isOpen) return null;
    
    return (
        <div className="confirm-modal-backdrop" onClick={onCancel}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="confirm-modal__title">{title}</h2>
                {message && (
                    <p className="confirm-modal__message">{message}</p>
                )}
                <div className="confirm-modal__actions">
                    <button 
                        className="button secondary-button"
                        onClick={onCancel}
                    >
                        {cancelText || t('common.cancel')}
                    </button>
                    <button 
                        className={`button ${variant === 'danger' ? 'danger-button' : 'primary-button'}`}
                        onClick={onConfirm}
                    >
                        {confirmText || t('common.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
}
