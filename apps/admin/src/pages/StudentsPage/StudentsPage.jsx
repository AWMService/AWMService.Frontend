import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '@awm/shared';
import './StudentsPage.css';

const initialData = [
    { id: '1', fullName: 'Алиев Тимур Маратович', group: 'ИС-21-1', program: 'Информационные системы', year: 4, status: 'active' },
    { id: '2', fullName: 'Бекова Айгуль Серикова', group: 'КН-21-2', program: 'Компьютерные науки', year: 4, status: 'active' },
    { id: '3', fullName: 'Волков Дмитрий Андреевич', group: 'МАТ-20-1', program: 'Математика', year: 3, status: 'graduated' },
    { id: '4', fullName: 'Газизова Динара Кайратовна', group: 'ИС-22-1', program: 'Информационные системы', year: 3, status: 'active' },
    { id: '5', fullName: 'Дорохов Никита Павлович', group: 'ФИЗ-21-1', program: 'Физика', year: 4, status: 'expelled' },
    { id: '6', fullName: 'Ержанова Камила Нурлановна', group: 'БИО-20-1', program: 'Биология', year: 2, status: 'active' },
    { id: '7', fullName: 'Жумабаев Арман Бауржанович', group: 'КН-22-1', program: 'Компьютерные науки', year: 3, status: 'graduated' },
    { id: '8', fullName: 'Исаева Мадина Ерболатовна', group: 'ИС-23-1', program: 'Информационные системы', year: 2, status: 'active' },
];

const programOptions = ['Информационные системы', 'Компьютерные науки', 'Математика', 'Физика', 'Биология'];

const emptyForm = { fullName: '', group: '', program: programOptions[0], year: '', status: 'active' };

export default function StudentsPage() {
    const { t } = useTranslation();
    const [items, setItems] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const filtered = items.filter(item => {
        const matchesSearch = item.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const openCreate = () => {
        setEditingItem(null);
        setFormData(emptyForm);
        setIsFormOpen(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData({
            fullName: item.fullName,
            group: item.group,
            program: item.program,
            year: item.year,
            status: item.status,
        });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!formData.fullName.trim() || !formData.group.trim()) return;
        const saveData = { ...formData, year: Number(formData.year) || 1 };
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

    const getStatusLabel = (status) => {
        const map = {
            active: t('admin.statusActive'),
            graduated: t('admin.statusGraduated'),
            expelled: t('admin.statusExpelled'),
        };
        return map[status] || status;
    };

    return (
        <div className="students-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.studentsTitle')}</h1>
                    <p className="page-subtitle">{filtered.length} {t('admin.studentsTitle').toLowerCase()}</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    + {t('admin.createStudent')}
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
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">{t('common.all')}</option>
                    <option value="active">{t('admin.statusActive')}</option>
                    <option value="graduated">{t('admin.statusGraduated')}</option>
                    <option value="expelled">{t('admin.statusExpelled')}</option>
                </select>
            </div>

            <div className="students-table">
                <div className="table-header">
                    <div className="col-num">№</div>
                    <div className="col-name">{t('common.name')}</div>
                    <div className="col-group">{t('admin.group')}</div>
                    <div className="col-program">{t('admin.program')}</div>
                    <div className="col-year">{t('admin.year')}</div>
                    <div className="col-status">{t('common.status')}</div>
                    <div className="col-actions">{t('common.actions')}</div>
                </div>

                {filtered.map((item, idx) => (
                    <div key={item.id} className="table-row">
                        <div className="col-num">{idx + 1}</div>
                        <div className="col-name">{item.fullName}</div>
                        <div className="col-group">{item.group}</div>
                        <div className="col-program">{item.program}</div>
                        <div className="col-year">{item.year}</div>
                        <div className="col-status">
                            <span className={`status-badge status-${item.status}`}>
                                {getStatusLabel(item.status)}
                            </span>
                        </div>
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
                            {editingItem ? t('admin.editStudent') : t('admin.createStudent')}
                        </h2>
                        <div className="dialog-body">
                            <label className="form-label">
                                {t('common.name')}
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </label>
                            <label className="form-label">
                                {t('admin.group')}
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.group}
                                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                                />
                            </label>
                            <label className="form-label">
                                {t('admin.program')}
                                <select
                                    className="form-input"
                                    value={formData.program}
                                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                >
                                    {programOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="form-label">
                                {t('admin.year')}
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    min="1"
                                    max="6"
                                />
                            </label>
                            <label className="form-label">
                                {t('common.status')}
                                <select
                                    className="form-input"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">{t('admin.statusActive')}</option>
                                    <option value="graduated">{t('admin.statusGraduated')}</option>
                                    <option value="expelled">{t('admin.statusExpelled')}</option>
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
