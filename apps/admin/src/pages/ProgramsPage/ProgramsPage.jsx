import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal, usePrograms, useCreateProgram, useUpdateProgram, useDeleteProgram, useDepartments, useDegreeLevels } from '@awm/shared';
import './ProgramsPage.css';

const emptyForm = { name: '', degreeLevelId: '', departmentId: '', code: '' };

export default function ProgramsPage() {
    const { t } = useTranslation();
    
    const { data: items = [], isLoading } = usePrograms();
    const createMutation = useCreateProgram();
    const updateMutation = useUpdateProgram();
    const deleteMutation = useDeleteProgram();

    const { data: departments = [] } = useDepartments();
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
        setFormData({ name: item.name, degreeLevelId: item.degreeLevelId, departmentId: item.departmentId, code: item.code });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.code.trim()) return;
        
        // Ensure ids are numbers if they exist
        const payload = {
            ...formData,
            degreeLevelId: formData.degreeLevelId ? Number(formData.degreeLevelId) : null,
            departmentId: formData.departmentId ? Number(formData.departmentId) : null,
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

                {filtered.map((item, idx) => {
                    const levelName = degreeLevels.find(l => l.id === item.degreeLevelId)?.name || '';
                    const deptName = departments.find(d => d.id === item.departmentId)?.name || '';
                    return (
                        <div key={item.id} className="table-row">
                            <div className="col-num">{idx + 1}</div>
                            <div className="col-name">{item.name}</div>
                            <div className="col-level">
                                <span className="level-badge">{levelName}</span>
                            </div>
                            <div className="col-department">{deptName}</div>
                            <div className="col-code">{item.code}</div>
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
                                    value={formData.degreeLevelId}
                                    onChange={(e) => setFormData({ ...formData, degreeLevelId: e.target.value })}
                                >
                                    <option value="">{t('common.select') || 'Select...'}</option>
                                    {degreeLevels.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="form-label">
                                {t('nav.departments')}
                                <select
                                    className="form-input"
                                    value={formData.departmentId}
                                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                >
                                    <option value="">{t('common.select') || 'Select...'}</option>
                                    {departments.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.name}</option>
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
