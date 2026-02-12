import React from 'react';
import './ScheduleCard.css';
import calendarIcon from '../../../assets/icons/pre-defense/calendar-icon.svg';
import clockIcon from '../../../assets/icons/pre-defense/clock-icon.svg';
import markerIcon from '../../../assets/icons/pre-defense/marker-icon.svg';

export const ScheduleCard = ({ title, schedule }) => {
    return (
        <div className="card side-card">
            <div className="card-header small-header">
                <h4 className="card-heading">{title}</h4>
            </div>
            <div className="card-body compact-body">
                <div className="schedule-row">
                    <img src={calendarIcon} alt="" className="mini-icon" />
                    <span className="schedule-text">{schedule.date}</span>
                </div>
                <div className="schedule-row">
                    <img src={clockIcon} alt="" className="mini-icon" />
                    <span className="schedule-text">{schedule.time}</span>
                </div>
                <div className="schedule-row">
                    <img src={markerIcon} alt="" className="mini-icon" />
                    <span className="schedule-text">{schedule.location}</span>
                </div>
            </div>
        </div>
    );
};