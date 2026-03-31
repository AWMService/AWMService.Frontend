import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ROLE_META } from '@awm/shared';
import RoleEditModal from '../../components/RoleEditModal/RoleEditModal';
import './RolesPage.css';

const STORAGE_KEY = 'awm-admin-roles-extra';

function loadRolesExtra() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
}

function RolesPage() {
    const { t } = useTranslation();
    const [rolesExtra, setRolesExtra] = useState(loadRolesExtra);
    const [editingRole, setEditingRole] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const roles = useMemo(() =>
        Object.entries(ROLE_META).map(([key, meta]) => ({
            id: key,
            name: t(meta.labelKey),
            color: meta.color,
            usersCount: Math.floor(Math.random() * 50) + 1,
            description: rolesExtra[key]?.description || '',
            permissions: rolesExtra[key]?.permissions || [],
        })),
    [t, rolesExtra]);

    const handleEdit = (role) => {
        setEditingRole(role);
        setIsEditOpen(true);
    };

    const handleSave = ({ description, permissions }) => {
        const updated = {
            ...rolesExtra,
            [editingRole.id]: { description, permissions },
        };
        setRolesExtra(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setIsEditOpen(false);
        setEditingRole(null);
    };

    return (
        <div className="roles-page">
            <div className="page-header">
                <h1>{t('nav.roles')}</h1>
                <p className="page-subtitle">{roles.length} {t('nav.roles').toLowerCase()}</p>
            </div>

            <div className="roles-grid">
                {roles.map(role => (
                    <div key={role.id} className="role-card">
                        <div 
                            className="role-indicator"
                            style={{ background: role.color }}
                        />
                        <div className="role-info">
                            <h3>{role.name}</h3>
                            <span className="users-count">{role.usersCount} {t('admin.users').toLowerCase()}</span>
                        </div>
                        <button className="manage-btn" onClick={() => handleEdit(role)}>{t('common.edit')}</button>
                    </div>
                ))}
            </div>

            <RoleEditModal
                isOpen={isEditOpen}
                role={editingRole}
                onClose={() => { setIsEditOpen(false); setEditingRole(null); }}
                onSave={handleSave}
            />
        </div>
    );
}

export default RolesPage;
