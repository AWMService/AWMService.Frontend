import React from 'react';
import './PeriodCard.css';
import calendarIcon from '../../../assets/icons/pre-defense/calendar-icon.svg';

export const PeriodCard = ({ period }) => {
    return (
        <div className="card">
            <h4>Период Проверок</h4>
            <p><img src={calendarIcon} alt="" className="icon"/> <strong>Начало:</strong> {period.start}</p>
            <p><img src={calendarIcon} alt="" className="icon"/> <strong>Конец:</strong> {period.end}</p>
        </div>
    );
};
