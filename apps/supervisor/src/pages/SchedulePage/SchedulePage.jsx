import React, { useState } from 'react';
import { MapPin, ChevronRight, UserCheck, Users, ShieldCheck } from 'lucide-react';
import './SchedulePage.css';
import { useNavigate } from "react-router-dom";

const scheduleData = [
    {
        id: 1,
        type: 'Предзащита',
        stage: 1,
        chairman: 'д.т.н. Соколов А.П.',
        secretary: 'Петрова В.Д.',
        members: ['Иванов И.И.', 'Сидоров С.С.', 'Кузнецов А.А.', 'Смирнов П.П.'],
        date: '2024-05-15',
        time: '09:00',
        room: '402'
    },
    {
        id: 2,
        type: 'Защита',
        stage: null,
        chairman: 'к.т.н. Волков С.М.',
        secretary: 'Лисицына К.А.',
        members: ['Антонов А.А.', 'Борисов Б.Б.', 'Викторов В.В.', 'Григорьев Г.Г.'],
        date: '2024-05-16',
        time: '10:30',
        room: '101'
    },
];

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState('2024-05-15');
    const navigate = useNavigate();
    const uniqueDates = [...new Set(scheduleData.map(item => item.date))];
    const dailyEvent = scheduleData.find(event => event.date === selectedDate);

    return (
        <div className="teacher-schedule-page">
            {/* Фоновые плавающие сферы */}
            <div className="bg-sphere sphere-1"></div>
            <div className="bg-sphere sphere-2"></div>
            <div className="bg-sphere sphere-3"></div>

            <div className="schedule-header-fixed">
                <div className="header-top">
                    <h1>Расписание комиссий</h1>
                    <p className="subtitle">Управление графиком защит и предзащит</p>
                </div>

                <div className="date-picker-row">
                    {uniqueDates.map(date => (
                        <button
                            key={date}
                            className={`date-tab ${selectedDate === date ? 'active' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <span className="date-tab-day">{new Date(date).getDate()}</span>
                            <span className="date-tab-month">
                                {new Date(date).toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '')}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="timeline-container">
                {dailyEvent ? (
                    <div className="timeline-item">
                        <div className="timeline-time">
                            <span className="time-main">{dailyEvent.time}</span>
                            <div className="timeline-dot"></div>
                        </div>

                        <div className="card-wrapper" onClick={() => navigate(`/supervisors/schedule/${dailyEvent.id}`)}>
                            <div className="sharp-card">
                                <div className={`card-accent ${dailyEvent.type === 'Защита' ? 'final' : 'pre'}`}></div>

                                {/* Декоративная иконка на фоне карточки */}
                                <div className="card-watermark">
                                    {dailyEvent.type === 'Защита' ? <ShieldCheck size={100} /> : <Users size={100} />}
                                </div>

                                <div className="card-main-content">
                                    <div className="card-upper">
                                        <div className="card-tags">
                                            <span className={`tag-pill ${dailyEvent.type === 'Защита' ? 'pill-final' : 'pill-pre'}`}>
                                                {dailyEvent.type} {dailyEvent.stage}
                                            </span>
                                            <span className="room-text">
                                                <MapPin size={14} /> каб. {dailyEvent.room}
                                            </span>
                                        </div>
                                        <ChevronRight className="mobile-arrow" size={20} />
                                    </div>

                                    <div className="commission-info">
                                        <div className="member-row chairman">
                                            <ShieldCheck size={16} className="icon-blue" />
                                            <span><strong>Председатель:</strong> {dailyEvent.chairman}</span>
                                        </div>

                                        <div className="dropdown-content">
                                            <div className="members-grid">
                                                <div className="member-row">
                                                    <UserCheck size={16} className="icon-gray" />
                                                    <span><strong>Секретарь:</strong> {dailyEvent.secretary}</span>
                                                </div>
                                                <div className="members-list">
                                                    <div className="list-label"><Users size={16} /> Члены комиссии:</div>
                                                    <ul>
                                                        {dailyEvent.members.map((m, i) => <li key={i}>{m}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="click-hint">Нажмите, чтобы увидеть список студентов</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <p>На выбранную дату комиссий не назначено</p>
                    </div>
                )}
            </div>
        </div>
    );
}