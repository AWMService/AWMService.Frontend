import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '@awm/shared';
import './EducationLevelsPage.css';

const initialData = [
    { id: '1', name: 'Бакалавриат', code: 'B', duration: 4 },
    { id: '2', name: 'Магистратура', code: 'M', duration: 2 },
    { id: '3', name: 'Докторантура PhD', code: 'D', duration: 3 },
];

const emptyForm = { name: '', code: '', duration: '' };

export default function EducationLevelsPage() {
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
        setFormData({ name: item.name, code: item.code, duration: item.duration });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.code.trim()) return;
        const saveData = { ...formData, duration: Number(formData.duration) || 0 };
        if (editingItem) {
            setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...saveData } : i));
        } else {
            setItems(prev => [...prev, { id: Date.now().toString(), ...saveData }]);
        }
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleDelete = () => {
        setItems(prev => prev.filter(i => i.id !== deleteItem.id));
        setDeleteItem(null);
    };

    return (
        <div className="education-levels-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.educationLevelsTitle')}</h1>
                    <p className="page-subtitle">{filtered.length} {t('admin.educationLevelsTitle').toLowerCase()}</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    + {t('admin.createEducationLevel')}
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

            <div className="education-levels-table">
                <div className="table-header">
                    <div className="col-num">№</div>
                    <div className="col-name">{t('common.name')}</div>
                    <div className="col-code">{t('admin.code')}</div>
                    <div className="col-duration">{t('admin.duration')}</div>
                    <div className="col-actions">{t('common.actions')}</div>
                </div>

                {filtered.map((item, idx) => (
                    <div key={item.id} className="table-row">
                        <div className="col-num">{idx + 1}</div>
                        <div className="col-name">{item.name}</div>
                        <div className="col-code">
                            <span className="code-badge">{item.code}</span>
                        </div>
                        <div className="col-duration">{item.duration} {t('admin.years')}</div>
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
                            {editingItem ? t('admin.editEducationLevel') : t('admin.createEducationLevel')}
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
                                {t('admin.code')}
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </label>
                            <label className="form-label">
                                {t('admin.duration')} ({t('admin.years')})
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    min="1"
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
