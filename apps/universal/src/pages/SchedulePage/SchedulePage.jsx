import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, ChevronRight, UserCheck, Users, ShieldCheck } from 'lucide-react';
import './SchedulePage.css';
import { useNavigate } from "react-router-dom";
import { getIntlLocale, useAuth, useCommissions, usePreDefenseSchedule, useDefenseSchedule } from "@awm/shared";

export default function SchedulePage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedCommissionId, setSelectedCommissionId] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: commissions = [], isLoading: isCommissionsLoading } = useCommissions(orgUnitId, semesterId);

    // Auto-select first commission if none selected
    React.useEffect(() => {
        if (commissions.length > 0 && !selectedCommissionId) {
            setSelectedCommissionId(commissions[0].id);
        }
    }, [commissions, selectedCommissionId]);

    const selectedCommission = commissions.find(c => c.id === selectedCommissionId);

    const { data: preDefenseSchedule = [], isLoading: isPreDefenseLoading } = usePreDefenseSchedule(selectedCommissionId);
    const { data: defenseSchedule = [], isLoading: isDefenseLoading } = useDefenseSchedule(selectedCommissionId);

    const scheduleData = useMemo(() => {
        const combined = [
            ...preDefenseSchedule.map(s => ({ ...s, type: 'preDefense' })),
            ...defenseSchedule.map(s => ({ ...s, type: 'defense' })),
        ];
        return combined.sort((a, b) => new Date(a.date || a.defenseDate) - new Date(b.date || b.defenseDate));
    }, [preDefenseSchedule, defenseSchedule]);

    const uniqueDates = useMemo(() => {
        const dates = scheduleData.map(item => item.date || item.defenseDate);
        return [...new Set(dates)].filter(Boolean);
    }, [scheduleData]);

    // Auto-select first date if none selected
    React.useEffect(() => {
        if (uniqueDates.length > 0 && (!selectedDate || !uniqueDates.includes(selectedDate))) {
            setSelectedDate(uniqueDates[0]);
        }
    }, [uniqueDates, selectedDate]);

    const dailyEvent = scheduleData.find(event => (event.date || event.defenseDate) === selectedDate);

    if (isCommissionsLoading || isPreDefenseLoading || isDefenseLoading) {
        return (
            <div className="teacher-schedule-page">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    const stageSuffix = dailyEvent?.stage ? ` ${dailyEvent.stage}` : "";

    return (
        <div className="teacher-schedule-page">
            <div className="bg-sphere sphere-1"></div>
            <div className="bg-sphere sphere-2"></div>
            <div className="bg-sphere sphere-3"></div>

            <div className="schedule-header-fixed">
                <div className="header-top">
                    <h1>{t('commission.scheduleTitle')}</h1>
                    <p className="subtitle">{t('commission.scheduleSubtitle')}</p>
                </div>

                {commissions.length > 0 && (
                    <div className="commission-selector-row">
                        <select 
                            className="commission-select"
                            value={selectedCommissionId || ''}
                            onChange={(e) => setSelectedCommissionId(Number(e.target.value))}
                        >
                            {commissions.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="date-picker-row">
                    {uniqueDates.map(date => (
                        <button
                            key={date}
                            className={`date-tab ${selectedDate === date ? 'active' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <span className="date-tab-day">{new Date(date).getDate()}</span>
                            <span className="date-tab-month">
                                {new Date(date).toLocaleDateString(locale, { month: 'short' }).replace('.', '')}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="timeline-container">
                {dailyEvent ? (
                    <div className="timeline-item">
                        <div className="timeline-time">
                            <span className="time-main">{dailyEvent.time || dailyEvent.startTime}</span>
                            <div className="timeline-dot"></div>
                        </div>

                        <div className="card-wrapper" onClick={() => navigate(`/schedule/${selectedCommissionId}`)}>
                            <div className="sharp-card">
                                <div className={`card-accent ${dailyEvent.type === 'defense' ? 'final' : 'pre'}`}></div>

                                <div className="card-watermark">
                                    {dailyEvent.type === 'defense' ? <ShieldCheck size={100} /> : <Users size={100} />}
                                </div>

                                <div className="card-main-content">
                                    <div className="card-upper">
                                        <div className="card-tags">
                                            <span className={`tag-pill ${dailyEvent.type === 'defense' ? 'pill-final' : 'pill-pre'}`}>
                                                {dailyEvent.type === 'defense' ? t('commission.defense') : t('commission.preDefense')}{stageSuffix}
                                            </span>
                                            <span className="room-text">
                                                <MapPin size={14} /> {t('commission.roomShort')} {dailyEvent.room || dailyEvent.location}
                                            </span>
                                        </div>
                                        <ChevronRight className="mobile-arrow" size={20} />
                                    </div>

                                    <div className="commission-info">
                                        <div className="member-row chairman">
                                            <ShieldCheck size={16} className="icon-blue" />
                                            <span><strong>{t('commission.chairmanLabel')}</strong> {selectedCommission?.chairmanName || dailyEvent.chairman || '—'}</span>
                                        </div>

                                        <div className="dropdown-content">
                                            <div className="members-grid">
                                                <div className="member-row">
                                                    <UserCheck size={16} className="icon-gray" />
                                                    <span><strong>{t('commission.secretaryLabel')}</strong> {selectedCommission?.secretaryName || dailyEvent.secretary || '—'}</span>
                                                </div>
                                                <div className="members-list">
                                                    <div className="list-label"><Users size={16} /> {t('commission.membersLabel')}</div>
                                                    <ul>
                                                        {(dailyEvent.members || []).map((m, i) => <li key={i}>{m}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="click-hint">{t('commission.clickForStudents')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
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



