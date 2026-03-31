import React from 'react';
import { useTranslation } from 'react-i18next';
import { ROLE_META } from '@awm/shared';
import './RolesPage.css';

function RolesPage() {
    const { t } = useTranslation();

    const roles = Object.entries(ROLE_META).map(([key, meta]) => ({
        id: key,
        name: t(meta.labelKey),
        color: meta.color,
        usersCount: Math.floor(Math.random() * 50) + 1,
    }));

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
                        <button className="manage-btn">{t('common.edit')}</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RolesPage;
