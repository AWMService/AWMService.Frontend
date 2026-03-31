import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRole, ROLES } from '@awm/shared';
import './CommissionPage.css';

// Mock data для комиссий
const mockCommissions = [
    {
        id: 1,
        name: 'Комиссия ИС-21',
        date: '2025-06-15',
        time: '10:00',
        room: 'ГУК 723',
        studentsCount: 8,
        status: 'upcoming',
        chairman: 'Иванов И.И.',
        secretary: 'Петрова А.С.',
    },
    {
        id: 2,
        name: 'Комиссия ИС-20',
        date: '2025-06-16',
        time: '14:00',
        room: 'ГУК 725',
        studentsCount: 6,
        status: 'upcoming',
        chairman: 'Сидоров С.С.',
        secretary: 'Козлова М.И.',
    },
    {
        id: 3,
        name: 'Комиссия ПИ-21',
        date: '2025-06-10',
        time: '10:00',
        room: 'ГУК 720',
        studentsCount: 10,
        status: 'completed',
        chairman: 'Иванов И.И.',
        secretary: 'Петрова А.С.',
    },
];

function CommissionPage() {
    const { t } = useTranslation();
    const { currentRole } = useRole();
    const [activeTab, setActiveTab] = useState('upcoming');

    const filteredCommissions = mockCommissions.filter(c => {
        if (activeTab === 'upcoming') return c.status === 'upcoming';
        if (activeTab === 'completed') return c.status === 'completed';
        return true;
    });

    const isChairman = currentRole === ROLES.CHAIRMAN;
    const isSecretary = currentRole === ROLES.SECRETARY;

    return (
        <div className="commission-page">
            <div className="page-header">
                <h1>{t('commission.commissions')}</h1>
                <p className="page-subtitle">
                    {isChairman && t('roles.chairman')}
                    {isSecretary && t('roles.secretary')}
                    {!isChairman && !isSecretary && t('roles.commissionMember')}
                </p>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Предстоящие ({mockCommissions.filter(c => c.status === 'upcoming').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Завершённые ({mockCommissions.filter(c => c.status === 'completed').length})
                </button>
            </div>

            <div className="commissions-list">
                {filteredCommissions.map(commission => (
                    <div key={commission.id} className="commission-card">
                        <div className="commission-card-header">
                            <h3>{commission.name}</h3>
                            <span className={`status-badge ${commission.status}`}>
                                {commission.status === 'upcoming' ? 'Предстоящая' : 'Завершена'}
                            </span>
                        </div>
                        
                        <div className="commission-details">
                            <div className="detail-item">
                                <span className="detail-label">{t('commission.date')}</span>
                                <span className="detail-value">{commission.date}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">{t('commission.time')}</span>
                                <span className="detail-value">{commission.time}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">{t('commission.room')}</span>
                                <span className="detail-value">{commission.room}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">{t('commission.students')}</span>
                                <span className="detail-value">{commission.studentsCount}</span>
                            </div>
                        </div>

                        <div className="commission-members">
                            <div className="member">
                                <span className="member-role">{t('commission.chairman')}:</span>
                                <span className="member-name">{commission.chairman}</span>
                            </div>
                            <div className="member">
                                <span className="member-role">{t('commission.secretary')}:</span>
                                <span className="member-name">{commission.secretary}</span>
                            </div>
                        </div>

                        <div className="commission-actions">
                            <button className="action-btn primary">
                                {t('commission.students')}
                            </button>
                            {isSecretary && commission.status === 'completed' && (
                                <button className="action-btn secondary">
                                    {t('commission.generateProtocol')}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filteredCommissions.length === 0 && (
                    <div className="empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommissionPage;
