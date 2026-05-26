import React from "react";
import { useTranslation } from "react-i18next";
import "./DistributionStep.css";

export default function DistributionStep({ commissions, autoDistribute, onNext }) {
    const { t } = useTranslation();

    return (
        <div className="dist-step-container">
            <div className="dist-glow-sphere"></div>
            
            <div className="dist-card">
                <div className="dist-icon-wrapper">
                    <svg className="dist-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>

                <h2 className="dist-title">{t('department.planningDistribution')}</h2>
                <p className="dist-description">
                    Нажмите кнопку ниже, чтобы автоматически распределить всех студентов по комиссиям и временным интервалам. 
                    Система выполнит расчеты, создаст 30-минутные слоты и переведет статусы студентов в расписание.
                </p>

                <div className="dist-stats">
                    <div className="dist-stat-item">
                        <span className="dist-stat-value">{commissions.length}</span>
                        <span className="dist-stat-label">{t('department.commissions', 'Комиссии')}</span>
                    </div>
                </div>

                <div className="dist-actions">
                    <button
                        className="dist-btn dist-btn--primary"
                        onClick={autoDistribute}
                    >
                        {t('department.autoDistribute', 'Запустить автораспределение')}
                    </button>
                    
                    <button
                        className="dist-btn dist-btn--secondary"
                        onClick={onNext}
                    >
                        {t('department.nextStage')}
                    </button>
                </div>
            </div>
        </div>
    );
}
