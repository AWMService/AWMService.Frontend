import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './UsersPage.css';

// Mock data
const mockUsers = [
    { id: 1, name: 'Иванов Иван Иванович', email: 'ivanov@example.com', roles: ['admin'], status: 'active', lastLogin: '2025-05-20' },
    { id: 2, name: 'Петров Пётр Петрович', email: 'petrov@example.com', roles: ['supervisor', 'reviewer'], status: 'active', lastLogin: '2025-05-19' },
    { id: 3, name: 'Сидорова Анна Сергеевна', email: 'sidorova@example.com', roles: ['department'], status: 'active', lastLogin: '2025-05-18' },
    { id: 4, name: 'Козлов Михаил Александрович', email: 'kozlov@example.com', roles: ['normocontrol'], status: 'inactive', lastLogin: '2025-04-01' },
    { id: 5, name: 'Новикова Елена Дмитриевна', email: 'novikova@example.com', roles: ['student'], status: 'active', lastLogin: '2025-05-20' },
    { id: 6, name: 'Морозов Дмитрий Владимирович', email: 'morozov@example.com', roles: ['chairman', 'supervisor'], status: 'active', lastLogin: '2025-05-17' },
];

function UsersPage() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        return status === 'active' 
            ? { label: t('admin.active'), class: 'status-active' }
            : { label: t('admin.inactive'), class: 'status-inactive' };
    };

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.users')}</h1>
                    <p className="page-subtitle">{filteredUsers.length} {t('admin.users').toLowerCase()}</p>
                </div>
                <button className="btn-primary">
                    + {t('admin.createUser')}
                </button>
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
                    <div className="col-actions">{t('common.actions')}</div>
                </div>

                {filteredUsers.map(user => {
                    const statusBadge = getStatusBadge(user.status);
                    return (
                        <div key={user.id} className="table-row">
                            <div className="col-name">
                                <div className="user-avatar">{user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                                <span>{user.name}</span>
                            </div>
                            <div className="col-email">{user.email}</div>
                            <div className="col-roles">
                                {user.roles.map(role => (
                                    <span key={role} className="role-badge">
                                        {t(`roles.${role}`)}
                                    </span>
                                ))}
                            </div>
                            <div className="col-status">
                                <span className={`status-badge ${statusBadge.class}`}>
                                    {statusBadge.label}
                                </span>
                            </div>
                            <div className="col-login">{user.lastLogin}</div>
                            <div className="col-actions">
                                <button className="action-btn">{t('common.edit')}</button>
                                <button className="action-btn danger">{t('common.delete')}</button>
                            </div>
                        </div>
                    );
                })}

                {filteredUsers.length === 0 && (
                    <div className="empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsersPage;
