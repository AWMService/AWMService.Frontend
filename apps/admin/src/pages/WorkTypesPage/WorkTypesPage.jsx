import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '@awm/shared';
import './WorkTypesPage.css';

const initialData = [
    { id: '1', name: 'Дипломная работа', description: 'Выпускная квалификационная работа бакалавра' },
    { id: '2', name: 'Курсовая работа', description: 'Промежуточная научно-исследовательская работа студента' },
    { id: '3', name: 'Магистерская диссертация', description: 'Выпускная квалификационная работа магистра' },
    { id: '4', name: 'Докторская диссертация', description: 'Выпускная квалификационная работа доктора PhD' },
];

const emptyForm = { name: '', description: '' };

export default function WorkTypesPage() {
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
        setFormData({ name: item.name, description: item.description });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) return;
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
        <div className="work-types-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.workTypesTitle')}</h1>
                    <p className="page-subtitle">{filtered.length} {t('admin.workTypesTitle').toLowerCase()}</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    + {t('admin.createWorkType')}
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

            <div className="work-types-table">
                <div className="table-header">
                    <div className="col-num">№</div>
                    <div className="col-name">{t('common.name')}</div>
                    <div className="col-description">{t('common.description')}</div>
                    <div className="col-actions">{t('common.actions')}</div>
                </div>

                {filtered.map((item, idx) => (
                    <div key={item.id} className="table-row">
                        <div className="col-num">{idx + 1}</div>
                        <div className="col-name">{item.name}</div>
                        <div className="col-description">{item.description}</div>
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
                            {editingItem ? t('admin.editWorkType') : t('admin.createWorkType')}
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
                                {t('common.description')}
                                <textarea
                                    className="form-input form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
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
