import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConfirmModal, adminApi, useAuth, normalizeRole } from '@awm/shared';
import UserFormModal from '../../components/UserFormModal/UserFormModal';
import './UsersPage.css';

function UsersPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);

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

    // Mutations
    const createMutation = useMutation({
        mutationFn: adminApi.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            setIsFormOpen(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => adminApi.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            setIsFormOpen(false);
            setEditingUser(null);
        }
    });

    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, isActive }) => adminApi.toggleUserStatus(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            setDeleteUser(null);
        }
    });

    const getStatusBadge = (isActive) => {
        return isActive 
            ? { label: t('admin.active'), class: 'status-active' }
            : { label: t('admin.inactive'), class: 'status-inactive' };
    };

    const handleCreate = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEdit = (u) => {
        setEditingUser(u);
        setIsFormOpen(true);
    };

    const handleSave = (formData) => {
        if (editingUser) {
            updateMutation.mutate({ 
                id: editingUser.userId, 
                data: {
                    email: formData.email,
                    roleId: formData.roleId,
                    orgUnitId: formData.orgUnitId,
                    instituteId: formData.instituteId
                }
            });
        } else {
            createMutation.mutate({
                ...formData,
                universityId
            });
        }
    };

    const handleDeleteConfirm = () => {
        toggleStatusMutation.mutate({ id: deleteUser.userId, isActive: false });
    };

    if (error) return <div className="error-state">{t('common.error')}: {error.message}</div>;

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.users')}</h1>
                    <p className="page-subtitle">{users.length} {t('admin.users').toLowerCase()}</p>
                </div>
                <button className="btn-primary" onClick={handleCreate}>
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
                                <div className="col-actions">
                                    <button className="action-btn" onClick={() => handleEdit(u)}>{t('common.edit')}</button>
                                    {u.isActive && (
                                        <button className="action-btn danger" onClick={() => setDeleteUser(u)}>{t('common.delete')}</button>
                                    )}
                                </div>
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

            <UserFormModal
                isOpen={isFormOpen}
                user={editingUser}
                onClose={() => { setIsFormOpen(false); setEditingUser(null); }}
                onSave={handleSave}
                isLoading={createMutation.isLoading || updateMutation.isLoading}
            />

            <ConfirmModal
                isOpen={!!deleteUser}
                title={t('admin.deleteUser')}
                message={deleteUser ? `${deleteUser.login} (${deleteUser.email})` : ''}
                variant="danger"
                confirmText={t('common.delete')}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteUser(null)}
            />
        </div>
    );
}

export default UsersPage;

