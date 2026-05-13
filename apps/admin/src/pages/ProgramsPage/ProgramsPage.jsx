import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '@awm/shared';
import './ProgramsPage.css';

const initialData = [
    { id: '1', name: 'Информационные системы', level: 'Бакалавриат', department: 'Кафедра ИС', code: '6B06101' },
    { id: '2', name: 'Компьютерные науки', level: 'Бакалавриат', department: 'Кафедра КН', code: '6B06102' },
    { id: '3', name: 'Математика', level: 'Магистратура', department: 'Кафедра математики', code: '7M05401' },
    { id: '4', name: 'Физика', level: 'Бакалавриат', department: 'Кафедра физики', code: '6B05301' },
    { id: '5', name: 'Биология', level: 'Докторантура PhD', department: 'Кафедра биологии', code: '8D05101' },
];

const levelOptions = ['Бакалавриат', 'Магистратура', 'Докторантура PhD'];
const departmentOptions = ['Кафедра ИС', 'Кафедра КН', 'Кафедра математики', 'Кафедра физики', 'Кафедра биологии'];

const emptyForm = { name: '', level: levelOptions[0], department: departmentOptions[0], code: '' };

export default function ProgramsPage() {
    const { t } = useTranslation();
    const [items, setItems] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => {
        setEditingItem(null);
        setFormData(emptyForm);
        setIsFormOpen(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData({ name: item.name, level: item.level, department: item.department, code: item.code });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.code.trim()) return;
        if (editingItem) {
            setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
        } else {
            setItems(prev => [...prev, { id: Date.now().toString(), ...formData }]);
        }
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleDelete = () => {
        setItems(prev => prev.filter(i => i.id !== deleteItem.id));
        setDeleteItem(null);
    };

    return (
        <div className="programs-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.programsTitle')}</h1>
                    <p className="page-subtitle">{filtered.length} {t('admin.programsTitle').toLowerCase()}</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    + {t('admin.createProgram')}
                </button>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder={t('common.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="programs-table">
                <div className="table-header">
                    <div className="col-num">№</div>
                    <div className="col-name">{t('common.name')}</div>
                    <div className="col-level">{t('admin.level')}</div>
                    <div className="col-department">{t('nav.departments')}</div>
                    <div className="col-code">{t('admin.code')}</div>
                    <div className="col-actions">{t('common.actions')}</div>
                </div>

                {filtered.map((item, idx) => (
                    <div key={item.id} className="table-row">
                        <div className="col-num">{idx + 1}</div>
                        <div className="col-name">{item.name}</div>
                        <div className="col-level">
                            <span className="level-badge">{item.level}</span>
                        </div>
                        <div className="col-department">{item.department}</div>
                        <div className="col-code">{item.code}</div>
                        <div className="col-actions">
                            <button className="action-btn" onClick={() => openEdit(item)}>{t('common.edit')}</button>
                            <button className="action-btn danger" onClick={() => setDeleteItem(item)}>{t('common.delete')}</button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <div className="dialog-backdrop" onClick={() => setIsFormOpen(false)}>
                    <div className="dialog" onClick={(e) => e.stopPropagation()}>
                        <h2 className="dialog-title">
                            {editingItem ? t('admin.editProgram') : t('admin.createProgram')}
                        </h2>
                        <div className="dialog-body">
                            <label className="form-label">
                                {t('common.name')}
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </label>
                            <label className="form-label">
                                {t('admin.level')}
                                <select
                                    className="form-input"
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                >
                                    {levelOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="form-label">
                                {t('nav.departments')}
                                <select
                                    className="form-input"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                >
                                    {departmentOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="form-label">
                                {t('admin.code')}
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </label>
                        </div>
                        <div className="dialog-buttons">
                            <button className="btn-primary" onClick={handleSave}>{t('common.save')}</button>
                            <button className="btn-secondary" onClick={() => setIsFormOpen(false)}>{t('common.cancel')}</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteItem}
                title={t('admin.confirmDeleteTitle')}
                message={t('admin.confirmDeleteMessage')}
                onConfirm={handleDelete}
                onCancel={() => setDeleteItem(null)}
                variant="danger"
            />
        </div>
    );
}
