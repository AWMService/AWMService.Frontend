import React from "react";
import { useTranslation } from "react-i18next";
import "./FinalizationStep.css";

export default function FinalizationStep({ commissions, onFinish }) {
    const { t } = useTranslation();

    return (
        <div className="final-step-container">
            <div className="final-glow-sphere"></div>
            
            <div className="final-card">
                <div className="final-icon-wrapper">
                    <svg className="final-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>

                <h2 className="final-title">{t('department.finalization', 'Настройка завершена!')}</h2>
                <p className="final-description">
                    Все этапы настройки периода успешно выполнены. 
                    Комиссии зарегистрированы в базе данных, а студенты были распределены по соответствующим сессиям.
                </p>

                <div className="final-summary-box">
                    <div className="final-summary-item">
                        <span className="final-summary-value">{commissions.length}</span>
                        <span className="final-summary-label">{t('department.commissions', 'Комиссии')}</span>
                    </div>
                </div>

                <button
                    className="final-btn"
                    onClick={onFinish}
                >
                    {t('department.approvePeriod', 'Утвердить и завершить')}
                </button>
            </div>
        </div>
    );
}
