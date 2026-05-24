import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ROLE_META, adminApi, orgApi, useAuth } from '@awm/shared';
import './UserFormModal.css';

function UserFormModal({ isOpen, user, onClose, onSave, isLoading: isSaving }) {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const [form, setForm] = useState({ login: '', name: '', email: '', password: '', roleId: '', departmentId: '', status: 'active' });
    const [errors, setErrors] = useState({});

    const universityId = currentUser?.universityId || 1;

    // Fetch roles and departments
    const { data: roles = [] } = useQuery({
        queryKey: ['admin-roles', universityId],
        queryFn: () => adminApi.fetchRoles(universityId),
        enabled: isOpen
    });

    const { data: departments = [] } = useQuery({
        queryKey: ['admin-departments', universityId],
        queryFn: () => orgApi.fetchDepartments(universityId),
        enabled: isOpen
    });

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setForm({
                    login: user.login || '',
                    name: user.name || user.login || '',
                    email: user.email || '',
                    password: '', // Don't show password on edit
                    roleId: user.roleId || '',
                    departmentId: user.orgUnitId || user.departmentId || '',
                    status: user.isActive ? 'active' : 'inactive',
                });
            } else {
                setForm({ login: '', name: '', email: '', password: '', roleId: '', departmentId: '', status: 'active' });
            }
            setErrors({});
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const next = {};
        if (!user && !form.login.trim()) next.login = t('validation.required') || 'Required';
        if (!form.email.trim()) next.email = t('validation.required') || 'Required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = t('validation.email') || 'Invalid email';
        if (!user && !form.password.trim()) next.password = t('validation.required') || 'Required';
        if (!form.roleId) next.roleId = t('validation.required') || 'Required';
        
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave({ ...form, roleId: Number(form.roleId), departmentId: form.departmentId ? Number(form.departmentId) : null });
    };

    return (
        <div className="user-form-backdrop" onClick={onClose}>
            <div className="user-form-dialog" onClick={(e) => e.stopPropagation()}>
                <h2>{user ? t('admin.editUser') : t('admin.createUser')}</h2>
                <form className="user-form" onSubmit={handleSubmit}>
                    {!user && (
                        <div className="form-field">
                            <label>{t('common.login')}</label>
                            <input
                                type="text"
                                value={form.login}
                                onChange={(e) => handleChange('login', e.target.value)}
                                className={errors.login ? 'field-error' : ''}
                            />
                            {errors.login && <span className="error-text">{errors.login}</span>}
                        </div>
                    )}

                    <div className="form-field">
                        <label>{t('common.email')}</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={errors.email ? 'field-error' : ''}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    {!user && (
                        <div className="form-field">
                            <label>{t('common.password')}</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                className={errors.password ? 'field-error' : ''}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>
                    )}

                    <div className="form-field">
                        <label>{t('nav.roles')}</label>
                        <select
                            value={form.roleId}
                            onChange={(e) => handleChange('roleId', e.target.value)}
                            className={errors.roleId ? 'field-error' : ''}
                        >
                            <option value="">{t('common.select')}</option>
                            {roles.map(r => (
                                <option key={r.roleId} value={r.roleId}>
                                    {r.displayName}
                                </option>
                            ))}
                        </select>
                        {errors.roleId && <span className="error-text">{errors.roleId}</span>}
                    </div>

                    <div className="form-field">
                        <label>{t('nav.departments')}</label>
                        <select
                            value={form.departmentId}
                            onChange={(e) => handleChange('departmentId', e.target.value)}
                        >
                            <option value="">{t('common.select')}</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={isSaving}>
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="btn-save" disabled={isSaving}>
                            {isSaving ? t('common.saving') : t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserFormModal;
