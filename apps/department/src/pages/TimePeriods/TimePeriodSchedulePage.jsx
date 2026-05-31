import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, ArrowLeft, Users, UserCheck } from 'lucide-react';
import { 
    getIntlLocale, 
    useAuth, 
    useCommissions, 
    usePreDefenseSchedule,
    useDownloadScheduleReport 
} from '@awm/shared';
import './TimePeriodSchedulePage.css';

const getCommissionTypeAndNumber = (stageId) => {
    const id = Number(stageId);
    if (id === 5) return { commissionTypeId: 1, preDefenseNumber: 1 };
    if (id === 6) return { commissionTypeId: 1, preDefenseNumber: 2 };
    if (id === 7) return { commissionTypeId: 1, preDefenseNumber: 3 };
    if (id === 8) return { commissionTypeId: 2, preDefenseNumber: null };
    return { commissionTypeId: 1, preDefenseNumber: 1 };
};

export default function TimePeriodSchedulePage() {
    const { t, i18n } = useTranslation();
    const { id } = useParams(); // Stage ID (e.g. 5, 6, 7, 8)
    const navigate = useNavigate();
    const { user } = useAuth();
    const locale = getIntlLocale(i18n.language);

    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const [selectedCommissionId, setSelectedCommissionId] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    // Fetch department commissions
    const { data: commissions = [], isLoading: isCommissionsLoading } = useCommissions(orgUnitId, semesterId);

    // Filter commissions for this specific stage
    const filteredCommissions = useMemo(() => {
        const { commissionTypeId, preDefenseNumber } = getCommissionTypeAndNumber(id);
        return commissions.filter(c => 
            c.commissionTypeId === commissionTypeId && 
            c.preDefenseNumber === preDefenseNumber
        );
    }, [commissions, id]);

    // Auto-select first commission
    React.useEffect(() => {
        if (filteredCommissions.length > 0 && !selectedCommissionId) {
            setSelectedCommissionId(filteredCommissions[0].id);
        }
    }, [filteredCommissions, selectedCommissionId]);

    const selectedCommission = filteredCommissions.find(c => c.id === selectedCommissionId);

    // Fetch schedule for the selected commission
    const { data: schedule = [], isLoading: isScheduleLoading } = usePreDefenseSchedule(selectedCommissionId);
    const { mutate: downloadScheduleReport, isPending: isDownloading } = useDownloadScheduleReport();

    // Get unique dates in schedule
    const uniqueDates = useMemo(() => {
        const dates = schedule.map(s => s.date);
        return [...new Set(dates)].filter(Boolean).sort();
    }, [schedule]);

    // Auto-select first date
    React.useEffect(() => {
        if (uniqueDates.length > 0 && (!selectedDate || !uniqueDates.includes(selectedDate))) {
            setSelectedDate(uniqueDates[0]);
        }
    }, [uniqueDates, selectedDate]);

    // Filter slots for the selected date
    const dailySlots = useMemo(() => {
        return schedule
            .filter(s => s.date === selectedDate)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [schedule, selectedDate]);

    if (isCommissionsLoading || isScheduleLoading) {
        return (
            <div className="dept-schedule-page">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    const chairman = selectedCommission?.members?.find(m => m.roleType === 1);
    const secretary = selectedCommission?.members?.find(m => m.roleType === 3);
    const membersList = selectedCommission?.members?.filter(m => m.roleType === 2) || [];

    return (
        <div className="dept-schedule-page">
            <div className="bg-sphere sphere-1"></div>
            <div className="bg-sphere sphere-2"></div>
            <div className="bg-sphere sphere-3"></div>

            <div className="schedule-header-fixed">
                <div className="header-top">
                    <button className="back-button" onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', fontWeight: '600', marginBottom: '16px' }}>
                        <ArrowLeft size={18} /> {t('common.back')}
                    </button>
                    <div className="header-content-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div className="header-titles">
                            <h1>{t('commission.scheduleTitle', 'График защит и предзащит')}</h1>
                            <p className="subtitle">{t('commission.overallSchedule', 'Расписание работы комиссии и выступлений студентов')}</p>
                        </div>
                        {selectedCommissionId && (
                            <button 
                                onClick={() => downloadScheduleReport(selectedCommissionId)}
                                disabled={isDownloading}
                                className="download-button"
                                style={{ 
                                    padding: '10px 20px', 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                                    color: '#fff', 
                                    fontWeight: '600', 
                                    cursor: 'pointer', 
                                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                📥 {isDownloading ? t('common.downloading', 'Скачивание...') : t('commission.downloadSchedule', 'Скачать PDF расписания')}
                            </button>
                        )}
                    </div>
                </div>

                {filteredCommissions.length > 1 && (
                    <div className="commission-selector-row" style={{ marginBottom: '16px' }}>
                        <select 
                            className="commission-select"
                            value={selectedCommissionId || ''}
                            onChange={(e) => {
                                setSelectedCommissionId(Number(e.target.value));
                                setSelectedDate('');
                            }}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontSize: '14px', fontWeight: '600', color: '#374151' }}
                        >
                            {filteredCommissions.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {uniqueDates.length > 0 && (
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
                )}
            </div>

            <div className="timeline-container" style={{ marginTop: '20px' }}>
                {selectedCommission && (
                    <div className="commission-meta-card" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(229, 231, 235, 0.5)', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={18} className="text-blue-500" /> {selectedCommission.name}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                                <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', display: 'block' }}>{t('commission.chairmanLabel', 'Председатель:')}</span>
                                <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{chairman?.fullName || "—"}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', display: 'block' }}>{t('commission.secretaryLabel', 'Секретарь:')}</span>
                                <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{secretary?.fullName || "—"}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', display: 'block' }}>{t('commission.membersLabel', 'Члены комиссии:')}</span>
                                <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                                    {membersList.map(m => m.fullName).join(', ') || "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {dailySlots.length > 0 ? (
                    dailySlots.map((slot, index) => (
                        <div key={slot.id || index} className="timeline-item">
                            <div className="timeline-time">
                                <span className="time-main">{slot.startTime}</span>
                                <div className="timeline-dot"></div>
                                {index !== dailySlots.length - 1 && <div className="timeline-line"></div>}
                            </div>

                            <div className="card-wrapper">
                                <div className="sharp-card expanded">
                                    <div className="card-accent final"></div>
                                    <div className="card-main-content">
                                        <div className="card-header">
                                            <div className="room-badge">
                                                <MapPin size={14} /> {slot.location}
                                            </div>
                                        </div>

                                        <div className="students-section" style={{ marginTop: '12px' }}>
                                            <div className="student-chip-compact" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'none', border: 'none', padding: 0 }}>
                                                <span className="student-name" style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{slot.studentName}</span>
                                                <span className="student-topic" style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px', fontStyle: 'italic' }}>{slot.topicTitle}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <p>{t('commission.noCommissionsDay', 'На выбранную дату расписание отсутствует')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
