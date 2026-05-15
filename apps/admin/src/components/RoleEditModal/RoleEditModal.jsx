import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './RoleEditModal.css';

const PERMISSIONS = [
    { id: 'manage_users', label: 'Управление пользователями' },
    { id: 'manage_departments', label: 'Управление кафедрами' },
    { id: 'manage_topics', label: 'Управление темами' },
    { id: 'view_reports', label: 'Просмотр отчётов' },
    { id: 'manage_commissions', label: 'Управление комиссиями' },
];

function RoleEditModal({ isOpen, role, onClose, onSave }) {
    const { t } = useTranslation();
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        if (isOpen && role) {
            setDescription(role.description || '');
            setPermissions(role.permissions || []);
        }
    }, [isOpen, role]);

    if (!isOpen || !role) return null;

    const togglePermission = (permId) => {
        setPermissions(prev =>
            prev.includes(permId)
                ? prev.filter(p => p !== permId)
                : [...prev, permId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ description, permissions });
    };

    return (
        <div className="role-edit-backdrop" onClick={onClose}>
            <div className="role-edit-dialog" onClick={(e) => e.stopPropagation()}>
                <h2>{t('common.edit')} — {role.name}</h2>
                <form className="role-edit-form" onSubmit={handleSubmit}>
                    <div className="role-name-display">
                        <span className="role-color-dot" style={{ background: role.color }} />
                        <span className="role-name-text">{role.name}</span>
                    </div>

                    <div className="form-field">
                        <label>{t('common.description')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('common.description')}
                        />
                    </div>

                    <div className="permissions-section">
                        <label>{t('admin.userRoles')}</label>
                        <div className="permissions-list">
                            {PERMISSIONS.map(perm => (
                                <label key={perm.id} className="permission-item">
                                    <input
                                        type="checkbox"
                                        checked={permissions.includes(perm.id)}
                                        onChange={() => togglePermission(perm.id)}
                                    />
                                    <span>{perm.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="btn-save">
                            {t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RoleEditModal;
