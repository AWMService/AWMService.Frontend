import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal, useInstitutes, useCreateInstitute, useUpdateInstitute, useDeleteInstitute } from '@awm/shared';
import './InstitutesPage.css';

const emptyForm = { name: '', address: '' };

export default function InstitutesPage() {
    const { t } = useTranslation();
    
    const { data: items = [], isLoading } = useInstitutes();
    const createMutation = useCreateInstitute();
    const updateMutation = useUpdateInstitute();
    const deleteMutation = useDeleteInstitute();

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
        setFormData({ name: item.name, address: item.address });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) return;
        
        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, name: formData.name, address: formData.address });
        } else {
            createMutation.mutate({ name: formData.name, address: formData.address, universityId: 1 });
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
        <div className="institutes-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.institutesTitle')}</h1>
                    <p className="page-subtitle">{filtered.length} {t('admin.institutesTitle').toLowerCase()}</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    + {t('admin.createInstitute')}
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

            <div className="institutes-table">
                <div className="table-header">
                    <div className="col-num">№</div>
                    <div className="col-name">{t('common.name')}</div>
                    <div className="col-address">{t('admin.address')}</div>
                    <div className="col-count">{t('admin.facultyCount')}</div>
                    <div className="col-actions">{t('common.actions')}</div>
                </div>

                {filtered.map((item, idx) => (
                    <div key={item.id} className="table-row">
                        <div className="col-num">{idx + 1}</div>
                        <div className="col-name">{item.name}</div>
                        <div className="col-address">{item.address}</div>
                        <div className="col-count">{item.facultyCount}</div>
                        <div className="col-actions">
                            <button className="action-btn" onClick={() => openEdit(item)}>{t('common.edit')}</button>
                            <button className="action-btn danger" onClick={() => setDeleteItem(item)}>{t('common.delete')}</button>
                        </div>
                    </div>
                ))}

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
                            {editingItem ? t('admin.editInstitute') : t('admin.createInstitute')}
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
                                {t('admin.address')}
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
