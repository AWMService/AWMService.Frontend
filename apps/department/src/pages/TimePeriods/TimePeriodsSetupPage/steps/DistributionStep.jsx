import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getIntlLocale } from "@awm/shared";
import { Calendar, Clock, Users, ArrowRight, UserCheck, AlertCircle, Sparkles, HelpCircle } from "lucide-react";
import "./DistributionStep.css";


function CommissionScheduleColumn({ commission }) {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);

    return (
        <div className="premium-commission-column">
            <h4 className="column-title">{commission.name}</h4>
            
            <div className="sessions-list">
                {commission.sessions.map(session => (
                    <Droppable
                        key={session.sessionId}
                        droppableId={`${commission.id}|${session.sessionId}`}
                    >
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`kanban-slot-card ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                            >
                                <div className="slot-header">
                                    <div className="slot-time-info">
                                        <Calendar size={13} />
                                        <span>
                                            {new Date(session.date).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                                        </span>
                                        <span className="dot-divider">·</span>
                                        <Clock size={13} />
                                        <span>{session.time}</span>
                                    </div>
                                    <span className="slot-students-count">
                                        {session.students.length}
                                    </span>
                                </div>

                                {session.students.length === 0 && (
                                    <div className="slot-empty-state">
                                        <HelpCircle size={16} />
                                        <span>{t('department.dragStudentsHere', 'Перетащите студентов сюда')}</span>
                                    </div>
                                )}

                                <div className="students-container">
                                    {session.students.map((student, index) => {
                                        
                                        const initials = student.name
                                            ? student.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                                            : "ST";

                                        return (
                                            <Draggable
                                                key={student.id}
                                                draggableId={student.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`premium-student-draggable ${snapshot.isDragging ? 'dragging' : ''}`}
                                                    >
                                                        <div className="student-avatar" style={{
                                                            background: student.teamId 
                                                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                                                                : 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
                                                        }}>
                                                            {initials}
                                                        </div>
                                                        <div className="student-info">
                                                            <div className="student-name">{student.name}</div>
                                                            <div className="student-meta">
                                                                {student.specialityCode && (
                                                                    <span className="student-spec-tag">{student.specialityCode}</span>
                                                                )}
                                                                {student.teamId && (
                                                                    <span className="team-indicator-tag">{t('common.team', 'Команда')}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                </div>

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </div>
    );
}

export default function DistributionStep({ commissions, setCommissions, autoDistribute, onNext, students = [], onMoveStudent }) {
    const { t } = useTranslation();
    const [showSchedule, setShowSchedule] = useState(false);
    const [isDistributing, setIsDistributing] = useState(false);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const [sourceCommId, sourceSessId] = source.droppableId.split('|');
        const [destCommId, destSessId] = destination.droppableId.split('|');

        const sourceComm = commissions.find(c => c.id === sourceCommId);
        const sourceSession = sourceComm.sessions.find(s => s.sessionId === sourceSessId);
        const student = sourceSession.students[source.index];

        if (!student || !student.scheduleId) return;

        
        setCommissions(prev => {
            const next = [...prev];
            const sComm = next.find(c => c.id === sourceCommId);
            const dComm = next.find(c => c.id === destCommId);
            
            const sSession = sComm.sessions.find(s => s.sessionId === sourceSessId);
            const dSession = dComm.sessions.find(s => s.sessionId === destSessId);

            const st = sSession.students[source.index];
            sSession.students.splice(source.index, 1);
            dSession.students.splice(destination.index, 0, st);

            return next;
        });

        
        const destComm = commissions.find(c => c.id === destCommId);
        const destDate = destSessId.split('T')[0];
        const destTime = destSessId.split('T')[1];

        if (onMoveStudent) {
            onMoveStudent(student.scheduleId, destComm.dbId, destDate, destTime);
        }
    };

    const handleAutoDistribute = async () => {
        setIsDistributing(true);
        try {
            await autoDistribute();
            setShowSchedule(true);
        } catch (error) {
            console.error("Auto distribute failed", error);
        } finally {
            setIsDistributing(false);
        }
    };

    if (!showSchedule) {
        return (
            <div className="dist-step-container">
                <div className="dist-glow-sphere"></div>
                <div className="dist-card">
                    <div className="dist-icon-wrapper">
                        <Users className="dist-icon" size={40} />
                    </div>
                    <h2 className="dist-title">{t('department.planningDistribution', 'Распределение студентов')}</h2>
                    <p className="dist-description">
                        {t('department.distributionIntro', 'Нажмите кнопку ниже, чтобы автоматически распределить всех студентов по комиссиям и временным интервалам. Вы также сможете вручную скорректировать расписание.')}
                    </p>
                    
                    <div className="dist-stats">
                        <div className="dist-stat-item">
                            <span className="dist-stat-value">{commissions.length}</span>
                            <span className="dist-stat-label">{t('department.commissions', 'Комиссии')}</span>
                        </div>
                        <div className="dist-stat-item">
                            <span className="dist-stat-value">{students.length}</span>
                            <span className="dist-stat-label">{t('commission.students', 'Студенты')}</span>
                        </div>
                    </div>
                    
                    <div className="dist-actions">
                        <button 
                            className="dist-btn dist-btn--primary glow-button-pulse" 
                            onClick={handleAutoDistribute}
                            disabled={isDistributing}
                        >
                            <Sparkles size={18} style={{ marginRight: '8px' }} />
                            {isDistributing ? t('common.loading', 'Распределение...') : t('department.autoDistribute', 'Запустить автораспределение')}
                        </button>
                        <button className="dist-btn dist-btn--secondary" onClick={() => setShowSchedule(true)}>
                            {t('department.manualSetup', 'Ручная настройка')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="scheduling-board">
            <div className="board-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                    <h3 style={{ margin: 0 }}>{t('commission.scheduleTitle', 'Интерактивная доска распределения')}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                        {t('department.dragDescription', 'Перетаскивайте студентов между временными слотами и комиссиями для точной настройки расписания')}
                    </p>
                </div>
                <div className="board-actions">
                    <button className="btn-outline ripple-effect" onClick={handleAutoDistribute} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={14} /> {t('department.autoDistribute', 'Сбросить и перераспределить')}
                    </button>
                    <button className="btn-primary ripple-effect" onClick={onNext} style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {t('department.nextStage', 'Далее')} <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="commissions-row" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px' }}>
                    {commissions.map(c => (
                        <CommissionScheduleColumn key={c.id} commission={c} />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}


function RefreshCw({ size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
        </svg>
    );
}
