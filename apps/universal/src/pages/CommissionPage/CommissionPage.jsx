import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRole, ROLES, getIntlLocale, getLocalizedValue } from '@awm/shared';
import './CommissionPage.css';

const mockCommissions = [
    {
        id: 1,
        name: {
            kk: 'ИС-21 комиссиясы',
            ru: 'Комиссия ИС-21',
            en: 'IS-21 Commission',
        },
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
        name: {
            kk: 'ИС-20 комиссиясы',
            ru: 'Комиссия ИС-20',
            en: 'IS-20 Commission',
        },
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
        name: {
            kk: 'ПИ-21 комиссиясы',
            ru: 'Комиссия ПИ-21',
            en: 'PI-21 Commission',
        },
        date: '2025-06-10',
        time: '10:00',
        room: 'ГУК 720',
        studentsCount: 10,
        status: 'completed',
        chairman: 'Иванов И.И.',
        secretary: 'Петрова А.С.',
    },
];

const mockProtocolStudents = [
    {
        id: 1,
        name: 'Ахметов Б.К.',
        thesis: {
            kk: 'Тапсырмаларды басқару жүйесін әзірлеу',
            ru: 'Разработка системы управления задачами',
            en: 'Development of a task management system',
        },
        avgScore: 87.4,
        decision: 'credit'
    },
    {
        id: 2,
        name: 'Байжанова А.Т.',
        thesis: {
            kk: 'Денсаулықты бақылауға арналған мобильді қосымша',
            ru: 'Мобильное приложение для мониторинга здоровья',
            en: 'Mobile application for health monitoring',
        },
        avgScore: 92.1,
        decision: 'credit'
    },
    {
        id: 3,
        name: 'Волков Д.С.',
        thesis: {
            kk: 'Әлеуметтік желілер деректерін талдау',
            ru: 'Анализ данных социальных сетей',
            en: 'Analysis of social network data',
        },
        avgScore: 78.6,
        decision: 'credit'
    },
    {
        id: 4,
        name: 'Григорьева Е.А.',
        thesis: {
            kk: 'Электрондық оқыту платформасы',
            ru: 'Платформа электронного обучения',
            en: 'E-learning platform',
        },
        avgScore: 54.2,
        decision: 'noCredit'
    },
    {
        id: 5,
        name: 'Досымов Н.К.',
        thesis: {
            kk: 'Беттерді тану жүйесі',
            ru: 'Система распознавания лиц',
            en: 'Face recognition system',
        },
        avgScore: 83.0,
        decision: 'credit'
    },
    {
        id: 6,
        name: 'Ермекова С.Б.',
        thesis: {
            kk: 'Логистикалық бағыттарды оңтайландыру',
            ru: 'Оптимизация логистических маршрутов',
            en: 'Optimization of logistics routes',
        },
        avgScore: 90.5,
        decision: 'credit'
    },
    {
        id: 7,
        name: 'Жумабеков И.М.',
        thesis: {
            kk: 'ЖИ негізіндегі чат-бот',
            ru: 'Чат-бот на основе ИИ',
            en: 'AI-based chatbot',
        },
        avgScore: 71.8,
        decision: 'credit'
    },
    {
        id: 8,
        name: 'Зайцева О.В.',
        thesis: {
            kk: 'Жобаларды басқаруға арналған веб-портал',
            ru: 'Веб-портал для управления проектами',
            en: 'Web portal for project management',
        },
        avgScore: 88.3,
        decision: 'credit'
    },
];

function CommissionPage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const { currentRole } = useRole();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [protocolModal, setProtocolModal] = useState(null);

    const filteredCommissions = mockCommissions.filter(c => {
        if (activeTab === 'upcoming') return c.status === 'upcoming';
        if (activeTab === 'completed') return c.status === 'completed';
        return true;
    });

    const isChairman = currentRole === ROLES.CHAIRMAN;
    const isSecretary = currentRole === ROLES.SECRETARY;

    const handleGenerateProtocol = (commission) => {
        setProtocolModal(commission);
    };

    const handleDownloadPdf = () => {
        alert(t('messages.pdfDownloadMock'));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString(locale);
    };

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
                    {t('commission.upcoming')} ({mockCommissions.filter(c => c.status === 'upcoming').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    {t('commission.completedSessions')} ({mockCommissions.filter(c => c.status === 'completed').length})
                </button>
            </div>

            <div className="commissions-list">
                {filteredCommissions.map(commission => (
                    <div key={commission.id} className="commission-card">
                        <div className="commission-card-header">
                            <h3>{getLocalizedValue(commission.name, i18n.language)}</h3>
                            <span className={`status-badge ${commission.status}`}>
                                {commission.status === 'upcoming' ? t('commission.statusUpcoming') : t('commission.statusCompleted')}
                            </span>
                        </div>
                        
                        <div className="commission-details">
                            <div className="detail-item">
                                <span className="detail-label">{t('commission.date')}</span>
                                <span className="detail-value">{formatDate(commission.date)}</span>
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
                                <button
                                    className="action-btn secondary"
                                    onClick={() => handleGenerateProtocol(commission)}
                                >
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

            {protocolModal && (
                <div className="protocol-modal-overlay" onClick={() => setProtocolModal(null)}>
                    <div className="protocol-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="protocol-modal-header">
                            <h2>{t('commission.protocolPreview')}</h2>
                            <button className="protocol-close-btn" onClick={() => setProtocolModal(null)}>×</button>
                        </div>

                        <div className="protocol-modal-meta">
                            <p><strong>{getLocalizedValue(protocolModal.name, i18n.language)}</strong></p>
                            <p>{t('commission.date')}: {formatDate(protocolModal.date)} | {t('commission.time')}: {protocolModal.time} | {t('commission.room')}: {protocolModal.room}</p>
                            <p>{t('commission.chairman')}: {protocolModal.chairman} | {t('commission.secretary')}: {protocolModal.secretary}</p>
                        </div>

                        <div className="protocol-table-wrapper">
                            <table className="protocol-table">
                                <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>{t('commission.studentFullName')}</th>
                                        <th>{t('commission.thesisTitle')}</th>
                                        <th>{t('commission.averageScore')}</th>
                                        <th>{t('commission.decision')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockProtocolStudents.map((s, idx) => (
                                        <tr key={s.id} className={idx % 2 === 0 ? 'protocol-row-even' : ''}>
                                            <td>{idx + 1}</td>
                                            <td>{s.name}</td>
                                            <td>{getLocalizedValue(s.thesis, i18n.language)}</td>
                                            <td className="protocol-score">{s.avgScore}</td>
                                            <td>
                                                <span className={`protocol-decision ${s.decision}`}>
                                                    {s.decision === 'credit' ? t('status.credit') : t('status.noCredit')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="protocol-modal-footer">
                            <button className="action-btn secondary" onClick={() => setProtocolModal(null)}>
                                {t('common.close')}
                            </button>
                            <button className="action-btn primary" onClick={handleDownloadPdf}>
                                {t('commission.downloadPdf')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommissionPage;
