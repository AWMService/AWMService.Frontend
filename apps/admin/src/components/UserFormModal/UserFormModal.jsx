import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ROLE_META } from '@awm/shared';
import './UserFormModal.css';

const MOCK_DEPARTMENTS = ['Информационные системы', 'Программная инженерия', 'Компьютерные науки', 'Автоматизация и управление'];

function UserFormModal({ isOpen, user, onClose, onSave }) {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', roles: [], department: '', status: 'active' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setForm({
                    name: user.name || '',
                    email: user.email || '',
                    roles: user.roles || [],
                    department: user.department || '',
                    status: user.status || 'active',
                });
            } else {
                setForm({ name: '', email: '', roles: [], department: '', status: 'active' });
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
        if (!form.name.trim()) next.name = t('validation.required') || 'Required';
        if (!form.email.trim()) next.email = t('validation.required') || 'Required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = t('validation.email') || 'Invalid email';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave({ ...form });
    };

    const roleKeys = Object.keys(ROLE_META);

    return (
        <div className="user-form-backdrop" onClick={onClose}>
            <div className="user-form-dialog" onClick={(e) => e.stopPropagation()}>
                <h2>{user ? t('admin.editUser') : t('admin.createUser')}</h2>
                <form className="user-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>{t('common.name')}</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={errors.name ? 'field-error' : ''}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

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

                    <div className="form-field">
                        <label>{t('nav.roles')}</label>
                        <select
                            value={form.roles[0] || ''}
                            onChange={(e) => handleChange('roles', e.target.value ? [e.target.value] : [])}
                        >
                            <option value="">{t('common.select')}</option>
                            {roleKeys.map(key => (
                                <option key={key} value={key}>
                                    {t(ROLE_META[key].labelKey)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>{t('nav.departments')}</label>
                        <select
                            value={form.department}
                            onChange={(e) => handleChange('department', e.target.value)}
                        >
                            <option value="">{t('common.select')}</option>
                            {MOCK_DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>{t('common.status')}</label>
                        <select
                            value={form.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                        >
                            <option value="active">{t('admin.active')}</option>
                            <option value="inactive">{t('admin.inactive')}</option>
                        </select>
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

export default UserFormModal;
