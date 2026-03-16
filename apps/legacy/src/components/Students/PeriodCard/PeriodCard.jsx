import React from 'react';
import './PeriodCard.css';
import calendarIcon from '../../../assets/icons/pre-defense/calendar-icon.svg';

export const PeriodCard = ({ period }) => {
    return (
        <div className="card">
            <h4>Период проверки</h4>
            <div className="period-dates">
                <div className="date-row">
                    <img src={calendarIcon} alt="" className="icon-xs"/>
                    <span className="label">Начало:</span>
                    <span className="value">{period.start}</span>
                </div>
                <div className="date-row">
                    <img src={calendarIcon} alt="" className="icon-xs"/>
                    <span className="label">Конец:</span>
                    <span className="value">{period.end}</span>
                </div>
            </div>
        </div>
    );
};