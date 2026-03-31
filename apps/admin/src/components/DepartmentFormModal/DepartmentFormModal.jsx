import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './DepartmentFormModal.css';

const MOCK_FACULTIES = ['ФИТ', 'ФМ', 'ФЕН', 'ФГН'];

function DepartmentFormModal({ isOpen, department, onClose, onSave }) {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', faculty: '', head: '', phone: '', email: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (department) {
                setForm({
                    name: department.name || '',
                    faculty: department.faculty || '',
                    head: department.head || '',
                    phone: department.phone || '',
                    email: department.email || '',
                });
            } else {
                setForm({ name: '', faculty: '', head: '', phone: '', email: '' });
            }
            setErrors({});
        }
    }, [isOpen, department]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = t('validation.required') || 'Required';
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) next.email = t('validation.email') || 'Invalid email';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave({ ...form });
    };

    return (
        <div className="dept-form-backdrop" onClick={onClose}>
            <div className="dept-form-dialog" onClick={(e) => e.stopPropagation()}>
                <h2>{department ? t('common.edit') : t('common.create')} — {t('nav.departments')}</h2>
                <form className="dept-form" onSubmit={handleSubmit}>
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
                        <label>{t('nav.faculties')}</label>
                        <select
                            value={form.faculty}
                            onChange={(e) => handleChange('faculty', e.target.value)}
                        >
                            <option value="">{t('common.select')}</option>
                            {MOCK_FACULTIES.map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>{t('admin.assignHead')}</label>
                        <input
                            type="text"
                            value={form.head}
                            onChange={(e) => handleChange('head', e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>{t('common.phone')}</label>
                        <input
                            type="text"
                            value={form.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
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

export default DepartmentFormModal;
