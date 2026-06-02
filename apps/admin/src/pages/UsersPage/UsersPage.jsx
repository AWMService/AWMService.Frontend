import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { adminApi, useAuth, normalizeRole } from '@awm/shared';
import './UsersPage.css';

function UsersPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const universityId = user?.universityId || 1;

    // Fetch users
    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['admin-users', universityId, statusFilter, searchQuery],
        queryFn: () => adminApi.fetchUsers({ 
            universityId, 
            isActive: statusFilter === 'all' ? null : statusFilter === 'active',
            search: searchQuery 
        }),
        enabled: !!universityId
    });

    const getStatusBadge = (isActive) => {
        return isActive 
            ? { label: t('admin.active'), class: 'status-active' }
            : { label: t('admin.inactive'), class: 'status-inactive' };
    };

    if (error) return <div className="error-state">{t('common.error')}: {error.message}</div>;

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.users')}</h1>
                    <p className="page-subtitle">{users.length} {t('admin.users').toLowerCase()}</p>
                </div>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">{t('common.all')}</option>
                    <option value="active">{t('admin.active')}</option>
                    <option value="inactive">{t('admin.inactive')}</option>
                </select>
            </div>

            <div className="users-table">
                <div className="table-header">
                    <div className="col-name">{t('common.name')}</div>
                    <div className="col-email">{t('common.email')}</div>
                    <div className="col-roles">{t('nav.roles')}</div>
                    <div className="col-status">{t('common.status')}</div>
                    <div className="col-login">{t('admin.lastLogin')}</div>
                </div>

                {isLoading ? (
                    <div className="loading-state">{t('common.loading')}...</div>
                ) : (
                    users.map(u => {
                        const statusBadge = getStatusBadge(u.isActive);
                        return (
                            <div key={u.userId} className="table-row">
                                <div className="col-name">
                                    <div className="user-avatar">{u.login.substring(0, 2).toUpperCase()}</div>
                                    <span>{u.login}</span>
                                </div>
                                <div className="col-email">{u.email}</div>
                                <div className="col-roles">
                                    {u.roles.map(role => {
                                        const normalized = normalizeRole(role);
                                        return (
                                            <span key={role} className="role-badge">
                                                {t(`roles.${normalized}`)}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className="col-status">
                                    <span className={`status-badge ${statusBadge.class}`}>
                                        {statusBadge.label}
                                    </span>
                                </div>
                                <div className="col-login">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</div>
                            </div>
                        )
                    })
                )}

                {!isLoading && users.length === 0 && (
                    <div className="empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsersPage;
