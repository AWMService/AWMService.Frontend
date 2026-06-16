import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal, useWorkTypes, useCreateWorkType, useUpdateWorkType, useDeleteWorkType, useDegreeLevels } from '@awm/shared';
import './WorkTypesPage.css';

const emptyForm = { name: '', degreeLevelId: '' };

export default function WorkTypesPage() {
    const { t } = useTranslation();


    const { data: items = [], isLoading } = useWorkTypes();
    const createMutation = useCreateWorkType();
    const updateMutation = useUpdateWorkType();
    const deleteMutation = useDeleteWorkType();

    const { data: degreeLevels = [] } = useDegreeLevels();

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const filtered = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => {
        setEditingItem(null);
        setFormData(emptyForm);
        setIsFormOpen(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData({ name: item.name, degreeLevelId: item.degreeLevelId || '' });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) return;

        const payload = {
            ...formData,
            degreeLevelId: formData.degreeLevelId ? Number(formData.degreeLevelId) : null,
        };

        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, ...payload });
        } else {
            createMutation.mutate(payload);
        }
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleDelete = () => {
        if (deleteItem) {
            deleteMutation.mutate(deleteItem.id);
        }
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
                    <div className="col-level">{t('admin.level')}</div>
                    <div className="col-actions">{t('common.actions')}</div>
                </div>

                {filtered.map((item, idx) => {
                    const levelName = degreeLevels.find(l => l.id === item.degreeLevelId)?.name || '';
                    return (
                        <div key={item.id} className="table-row">
                            <div className="col-num">{idx + 1}</div>
                            <div className="col-name">{item.name}</div>
                            <div className="col-level">
                                {levelName && <span className="level-badge">{levelName}</span>}
                            </div>
                            <div className="col-actions">
                                <button className="action-btn" onClick={() => openEdit(item)}>{t('common.edit')}</button>
                                <button className="action-btn danger" onClick={() => setDeleteItem(item)}>{t('common.delete')}</button>
                            </div>
                        </div>
                    );
                })}

                {isLoading ? (
                    <div className="empty-state">
                        <p>{t('common.loading') || 'Loading...'}</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                ) : null}
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
                                {t('admin.level')}
                                <select
                                    className="form-input"
                                    value={formData.degreeLevelId}
                                    onChange={(e) => setFormData({ ...formData, degreeLevelId: e.target.value })}
                                >
                                    <option value="">{t('common.select') || 'Select...'}</option>
                                    {degreeLevels.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                                    ))}
                                </select>
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
