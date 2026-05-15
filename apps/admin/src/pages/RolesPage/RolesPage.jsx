import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { adminApi, useAuth } from '@awm/shared';
import './RolesPage.css';

function RolesPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const universityId = user?.universityId || 1;

    // Fetch roles
    const { data: roles = [], isLoading, error } = useQuery({
        queryKey: ['admin-roles', universityId],
        queryFn: () => adminApi.fetchRoles(universityId),
        enabled: !!universityId
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
                        <div key={role.roleId} className="role-card">
                            <div className="role-card-header">
                                <div className="role-icon">
                                    <span className="material-icons">shield</span>
                                </div>
                                <div className="role-info">
                                    <h3>{role.displayName}</h3>
                                    <span className="role-system-name">{role.systemName}</span>
                                </div>
                            </div>
                            
                            <div className="role-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{role.usersCount}</span>
                                    <span className="stat-label">{t('admin.users')}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{role.scopeLevel}</span>
                                    <span className="stat-label">{t('admin.scope')}</span>
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
