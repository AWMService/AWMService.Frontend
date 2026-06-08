import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRole, ROLES, getIntlLocale, getLocalizedValue, useAuth, useCommissions, useGenerateProtocol, useDownloadProtocolPdf } from '@awm/shared';
import './CommissionPage.css';

function CommissionPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const locale = getIntlLocale(i18n.language);
    const { currentRole } = useRole();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [protocolModal, setProtocolModal] = useState(null);

    const orgUnitId = user?.orgUnitId;
    const semesterId = user?.currentSemesterId;

    const { data: commissions = [], isLoading } = useCommissions(orgUnitId, semesterId);

    const generateProtocolMutation = useGenerateProtocol();

    const downloadProtocolMutation = useDownloadProtocolPdf();

    const filteredCommissions = commissions.filter(c => {
        // Mock status logic: if commission has no upcoming schedule, treat as completed
        const hasUpcoming = c.hasUpcomingSchedule !== false;
        if (activeTab === 'upcoming') return hasUpcoming;
        if (activeTab === 'completed') return !hasUpcoming;
        return true;
    });

    const isChairman = currentRole === ROLES.CHAIRMAN;
    const isSecretary = currentRole === ROLES.SECRETARY;



    const handleConfirmGenerateProtocol = async () => {
        if (!protocolModal) return;
        try {
            const newProtocolId = await generateProtocolMutation.mutateAsync({
                commissionId: protocolModal.id,
                // Add other required fields based on backend contract
            });
            setProtocolModal(null);
            
            // Download the newly generated protocol PDF
            if (newProtocolId) {
                downloadProtocolMutation.mutate(newProtocolId);
            }
        } catch (error) {
            console.error('Failed to generate protocol', error);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString(locale);
    };

    if (isLoading) {
        return (
            <div className="commission-page">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

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
                    {t('commission.upcoming')} ({commissions.filter(c => c.hasUpcomingSchedule !== false).length})
                </button>
                <button 
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    {t('commission.completedSessions')} ({commissions.filter(c => c.hasUpcomingSchedule === false).length})
                </button>
            </div>

            <div className="commissions-list">
                {filteredCommissions.map(commission => (
                    <div key={commission.id} className="commission-card">
                        <div className="commission-card-header">
                            <h3>{getLocalizedValue(commission.name, i18n.language)}</h3>
                            <span className={`status-badge ${commission.hasUpcomingSchedule !== false ? 'upcoming' : 'completed'}`}>
                                {commission.hasUpcomingSchedule !== false ? t('commission.statusUpcoming') : t('commission.statusCompleted')}
                            </span>
                        </div>
                        
                        <div className="commission-details">
                            <div className="detail-item">
                                <span className="detail-label">{t('commission.date')}</span>
                                <span className="detail-value">{formatDate(commission.nextDate)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">{t('commission.time')}</span>
                                <span className="detail-value">{commission.nextTime || '—'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">{t('commission.room')}</span>
                                <span className="detail-value">{commission.room || '—'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">{t('commission.students')}</span>
                                <span className="detail-value">{commission.studentsCount || 0}</span>
                            </div>
                        </div>

                        <div className="commission-members">
                            <div className="member">
                                <span className="member-role">{t('commission.chairman')}:</span>
                                <span className="member-name">{commission.members?.find(m => m.roleType === 2)?.fullName || '—'}</span>
                            </div>
                            <div className="member">
                                <span className="member-role">{t('commission.secretary')}:</span>
                                <span className="member-name">{commission.members?.find(m => m.roleType === 3)?.fullName || '—'}</span>
                            </div>
                        </div>

                        <div className="commission-actions">
                            <button 
                                className="action-btn primary"
                                onClick={() => navigate(`/schedule/${commission.id}`)}
                            >
                                {t('commission.students')}
                            </button>
                            {(isSecretary || isChairman) && (
                                <button
                                    className="action-btn secondary"
                                    onClick={() => navigate(`/secretary/${commission.id}`)}
                                >
                                    {t('nav.secretary')}
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
                            <p>{t('commission.date')}: {formatDate(protocolModal.nextDate)} | {t('commission.time')}: {protocolModal.nextTime || '—'} | {t('commission.room')}: {protocolModal.room || '—'}</p>
                            <p>{t('commission.chairman')}: {protocolModal.members?.find(m => m.roleType === 2)?.fullName || '—'} | {t('commission.secretary')}: {protocolModal.members?.find(m => m.roleType === 3)?.fullName || '—'}</p>
                        </div>

                            <div className="protocol-preview-placeholder">
                                <p>{t('commission.protocolWillBeGeneratedAndDownloaded')}</p>
                            </div>

                        <div className="protocol-modal-footer">
                            <button className="action-btn secondary" onClick={() => setProtocolModal(null)}>
                                {t('common.close')}
                            </button>
                            <button 
                                className="action-btn primary" 
                                onClick={handleConfirmGenerateProtocol}
                                disabled={generateProtocolMutation.isPending}
                            >
                                {generateProtocolMutation.isPending ? t('common.loading') : t('commission.generateProtocol')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommissionPage;



