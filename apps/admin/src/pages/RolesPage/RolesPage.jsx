import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@awm/shared';
import shieldIcon from '../../assets/icons/shield-icon.svg';
import './RolesPage.css';

function RolesPage() {
    const { t } = useTranslation();
    
    
    const { data: roles = [], isLoading, error } = useQuery({
        queryKey: ['admin-roles'],
        queryFn: () => adminApi.fetchRoles(),
    });

    if (error) return <div className="error-state">{t('common.error')}: {error.message}</div>;

    return (
        <div className="roles-page">
            <div className="page-header">
                <div>
                    <h1>{t('nav.roles')}</h1>
                    <p className="page-subtitle">{roles.length} {t('nav.roles').toLowerCase()} {t('admin.inSystem')}</p>
                </div>
            </div>

            <div className="roles-grid">
                {isLoading ? (
                    <div className="loading-state">{t('common.loading')}...</div>
                ) : (
                    roles.map(role => (
                        <div key={role.id} className="role-card">
                            <div className="role-card-header">
                                <div className="role-icon">
                                    <img src={shieldIcon} alt="" className="role-icon-svg" />
                                </div>
                                <div className="role-info">
                                    <h3>{t(`roles.${(role.code || '').toLowerCase()}`) || role.name || role.code}</h3>
                                    <span className="role-system-name">{role.code}</span>
                                </div>
                            </div>
                            
                            <div className="role-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{role.usersCount ?? 0}</span>
                                    <span className="stat-label">{t('admin.users')}</span>
                                </div>
                            </div>

                            <div className="role-footer">
                                <button className="btn-text" disabled>{t('common.details')}</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!isLoading && roles.length === 0 && (
                <div className="empty-state">
                    <p>{t('common.noData')}</p>
                </div>
            )}
        </div>
    );
}

export default RolesPage;
