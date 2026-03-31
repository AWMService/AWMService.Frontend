import React from 'react';
import { useTranslation } from 'react-i18next';
import './PeriodCard.css';
import calendarIcon from '../../assets/icons/pre-defense/calendar-icon.svg';

export const PeriodCard = ({ period }) => {
    const { t } = useTranslation();
    return (
        <div className="card">
            <h4>{t('student.reviewPeriod')}</h4>
            <div className="period-dates">
                <div className="date-row">
                    <img src={calendarIcon} alt="" className="icon-xs"/>
                    <span className="label">{t('common.startLabel')}</span>
                    <span className="value">{period.start}</span>
                </div>
                <div className="date-row">
                    <img src={calendarIcon} alt="" className="icon-xs"/>
                    <span className="label">{t('common.endLabel')}</span>
                    <span className="value">{period.end}</span>
                </div>
            </div>
        </div>
    );
};