import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MapPin, ChevronDown, ChevronUp,
    ShieldCheck, ArrowLeft
} from 'lucide-react';
import './TimePeriodSchedulePage.css';

/* ===== ДАННЫЕ (MOCK) ===== */
const mockSchedule = {
    title: "График защит",
    commissions: [
        {
            id: "c1",
            name: "ГЭК №1 (ПИ)",
            chairman: "д.т.н. Соколов А.П.",
            secretary: "Петрова В.Д.",
            members: ["Иванов И.И.", "Сидоров С.С."],
            sessions: [
                {
                    id: "s1",
                    date: "2026-06-10",
                    time: "09:00",
                    room: "402",
                    type: "Защита",
                    students: [
                        "Иванов И.И.", "Петров П.П.", "Сидоров С.С.", "Кузнецов К.К.", "Смирнов А.А.",
                        "Попов В.В.", "Васильев Г.Г.", "Соколов Д.Д.", "Михайлов Е.Е.", "Новиков Ж.Ж.",
                        "Федоров З.З.", "Морозов И.И.", "Волков К.К.", "Алексеев Л.Л.", "Лебедев М.М.",
                        "Семенов Н.Н.", "Егоров О.О.", "Павлов П.П.", "Козлов Р.Р.", "Степанов С.С.",
                        "Николаев Т.Т.", "Орлов У.У.", "Андреев Ф.Ф."
                    ]
                },
                {
                    id: "s2",
                    date: "2026-06-10",
                    time: "14:00",
                    room: "402",
                    type: "Защита",
                    students: [
                        "Григорьев А.А.", "Яковлев Б.Б.", "Романов В.В.", "Воробьев Г.Г.", "Сергеев Д.Д.",
                        "Зайцев Е.Е.", "Борисов Ж.Ж.", "Комаров З.З.", "Киселев И.И.", "Макаров К.К.",
                        "Громов Л.Л.", "Денисов М.М.", "Гаврилов Н.Н.", "Титов О.О.", "Белов П.П.",
                        "Тарасов Р.Р.", "Жуков С.С.", "Баранов Т.Т.", "Фролов У.У.", "Шестаков Ф.Ф.",
                        "Горбунов Х.Х.", "Панин Ц.Ц."
                    ]
                },
            ],
        },
    ],
};

export default function TimePeriodSchedulePage() {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState('2026-06-10');
    const [expandedCards, setExpandedCards] = useState({});

    const toggleCard = (sessionId) => {
        setExpandedCards(prev => ({
            ...prev,
            [sessionId]: !prev[sessionId]
        }));
    };

    const uniqueDates = useMemo(() => {
        const dates = new Set();
        mockSchedule.commissions.forEach(c => {
            c.sessions.forEach(s => dates.add(s.date));
        });
        return Array.from(dates).sort();
    }, []);

    const dailyEvents = useMemo(() => {
        const events = [];
        mockSchedule.commissions.forEach(commission => {
            commission.sessions.forEach(session => {
                if (session.date === selectedDate) {
                    events.push({
                        ...session,
                        commissionName: commission.name,
                        chairman: commission.chairman,
                        secretary: commission.secretary,
                        members: commission.members
                    });
                }
            });
        });
        return events.sort((a, b) => a.time.localeCompare(b.time));
    }, [selectedDate]);

    return (
        <div className="dept-schedule-page">
            <div className="bg-sphere sphere-1"></div>
            <div className="bg-sphere sphere-2"></div>
            <div className="bg-sphere sphere-3"></div>

            <div className="schedule-header-fixed">
                <div className="header-top">
                    <div className="header-content-row">
                        <div className="header-titles">
                            <h1>{mockSchedule.title}</h1>
                            <p className="subtitle">{t('commission.overallSchedule')}</p>
                        </div>
                    </div>
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
                {dailyEvents.length > 0 ? (
                    dailyEvents.map((event, index) => (
                        <div key={event.id} className="timeline-item">
                            <div className="timeline-time">
                                <span className="time-main">{event.time}</span>
                                <div className="timeline-dot"></div>
                                {index !== dailyEvents.length - 1 && <div className="timeline-line"></div>}
                            </div>

                            <div className="card-wrapper">
                                <div className={`sharp-card ${expandedCards[event.id] ? 'expanded' : ''}`}>
                                    <div className={`card-accent ${event.type === 'Защита' ? 'final' : 'pre'}`}></div>
                                    <div className="card-main-content">
                                        <div className="card-header">
                                            <div className="commission-badge">
                                                <ShieldCheck size={14} />
                                                {event.commissionName}
                                            </div>
                                            <div className="room-badge">
                                                <MapPin size={14} /> {event.room}
                                            </div>
                                        </div>

                                        <div className="students-section">
                                            <div className="section-label">{t('commission.students')} ({event.students.length}):</div>
                                            {/* Добавлен контейнер со скроллом */}
                                            <div className="students-scroll-area">
                                                <div className="students-grid">
                                                    {event.students.map((student, idx) => (
                                                        <div key={idx} className="student-chip-compact">
                                                            <span className="student-num">{idx + 1}</span>
                                                            <span className="student-name">{student}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="commission-details">
                                            <button className="details-toggle" onClick={() => toggleCard(event.id)}>
                                                <span>{t('department.commissionComposition')}</span>
                                                {expandedCards[event.id] ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                            </button>

                                            {expandedCards[event.id] && (
                                                <div className="details-content">
                                                    <div className="detail-row">
                                                        <span className="label">{t('commission.chairmanLabel')}</span>
                                                        <span className="value">{event.chairman}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="label">{t('commission.secretaryLabel')}</span>
                                                        <span className="value">{event.secretary}</span>
                                                    </div>
                                                    <div className="detail-row members-block">
                                                        <span className="label">{t('commission.membersLabel')}</span>
                                                        <ul className="members-list-inline">
                                                            {event.members.map((m, i) => <li key={i}>{m}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <p>{t('commission.noCommissionsDay')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}