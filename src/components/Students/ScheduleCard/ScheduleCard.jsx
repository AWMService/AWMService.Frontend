import React from 'react';
import './ScheduleCard.css';
import calendarIcon from '../../../assets/icons/pre-defense/calendar-icon.svg';
import clockIcon from '../../../assets/icons/pre-defense/clock-icon.svg';
import markerIcon from '../../../assets/icons/pre-defense/marker-icon.svg';

export const ScheduleCard = ({ title, schedule }) => {
    return (
        <div className="schedule-card">
            <h4>{title}</h4>
            <p><img src={calendarIcon} alt="" className="icon" /> <strong>Дата:</strong> {schedule.date}</p>
            <p><img src={clockIcon} alt="" className="icon" /> <strong>Время:</strong> {schedule.time}</p>
            <p><img src={markerIcon} alt="" className="icon" /> <strong>Аудитория:</strong> {schedule.location}</p>
        </div>
    );
};
