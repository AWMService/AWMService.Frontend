import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal, useInstitutes, useCreateInstitute, useUpdateInstitute, useDeleteInstitute, useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '@awm/shared';
import DepartmentFormModal from '../../components/DepartmentFormModal/DepartmentFormModal';
import './DepartmentsPage.css';

function DepartmentsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('departments');
    
    const { data: departments = [] } = useDepartments();
    const createDeptMutation = useCreateDepartment();
    const updateDeptMutation = useUpdateDepartment();
    const deleteDeptMutation = useDeleteDepartment();

    const { data: faculties = [] } = useInstitutes();
    const createFacMutation = useCreateInstitute();
    const updateFacMutation = useUpdateInstitute();
    const deleteFacMutation = useDeleteInstitute();

    const [isDeptFormOpen, setIsDeptFormOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [deleteDept, setDeleteDept] = useState(null);

    const [isFacFormOpen, setIsFacFormOpen] = useState(false);
    const [editingFac, setEditingFac] = useState(null);
    const [deleteFac, setDeleteFac] = useState(null);

    const handleCreateDept = () => { setEditingDept(null); setIsDeptFormOpen(true); };
    const handleEditDept = (dept) => { setEditingDept(dept); setIsDeptFormOpen(true); };
    const handleSaveDept = (formData) => {
        if (editingDept) {
            updateDeptMutation.mutate({ id: editingDept.id, ...formData });
        } else {
            const instituteId = formData.instituteId || 1; 
            createDeptMutation.mutate({ instituteId, ...formData });
        }
        setIsDeptFormOpen(false);
        setEditingDept(null);
    };
    const handleDeleteDeptConfirm = () => {
        if (deleteDept) deleteDeptMutation.mutate(deleteDept.id);
        setDeleteDept(null);
    };

    const handleCreateFac = () => { setEditingFac(null); setIsFacFormOpen(true); };
    const handleEditFac = (fac) => { setEditingFac(fac); setIsFacFormOpen(true); };
    const handleSaveFac = (formData) => {
        if (editingFac) {
            updateFacMutation.mutate({ id: editingFac.id, name: formData.name, address: formData.address });
        } else {
            createFacMutation.mutate({ name: formData.name, address: formData.address, universityId: 1 });
        }
        setIsFacFormOpen(false);
        setEditingFac(null);
    };
    const handleDeleteFacConfirm = () => {
        if (deleteFac) deleteFacMutation.mutate(deleteFac.id);
        setDeleteFac(null);
    };

    const handleCreate = () => {
        if (activeTab === 'departments') handleCreateDept();
        else handleCreateFac();
    };

    return (
        <div className="departments-page">
            <div className="page-header">
                <div>
                    <h1>{t('nav.departments')} / {t('nav.faculties')}</h1>
                    <p className="page-subtitle">
                        {departments.length} {t('nav.departments').toLowerCase()}, {faculties.length} {t('nav.faculties').toLowerCase()}
                    </p>
                </div>
                <button className="btn-primary" onClick={handleCreate}>
                    + {activeTab === 'departments' ? t('admin.createDepartment') : t('admin.createFaculty')}
                </button>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('departments')}
                >
                    {t('nav.departments')} ({departments.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'faculties' ? 'active' : ''}`}
                    onClick={() => setActiveTab('faculties')}
                >
                    {t('nav.faculties')} ({faculties.length})
                </button>
            </div>

            {activeTab === 'departments' && (
                <div className="items-grid">
                    {departments.map(dept => (
                        <div key={dept.id} className="item-card">
                            <h3>{dept.name}</h3>
                            <span className="faculty-badge">{dept.faculty}</span>
                            <div className="item-stats">
                                <div className="stat">
                                    <span className="stat-value">{dept.supervisorsCount}</span>
                                    <span className="stat-label">{t('nav.supervisors')}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{dept.studentsCount}</span>
                                    <span className="stat-label">{t('roles.student')}</span>
                                </div>
                            </div>
                            <div className="item-footer">
                                <span>{t('admin.assignHead')}: {dept.head}</span>
                                <div className="item-actions">
                                    <button className="action-btn" onClick={() => handleEditDept(dept)}>{t('common.edit')}</button>
                                    <button className="action-btn danger" onClick={() => setDeleteDept(dept)}>{t('common.delete')}</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'faculties' && (
                <div className="items-grid">
                    {faculties.map(faculty => (
                        <div key={faculty.id} className="item-card faculty-card">
                            <h3>{faculty.name}</h3>
                            <div className="item-stats">
                                <div className="stat">
                                    <span className="stat-value">{faculty.departmentsCount}</span>
                                    <span className="stat-label">{t('nav.departments')}</span>
                                </div>
                            </div>
                            <div className="item-footer">
                                <div className="item-actions">
                                    <button className="action-btn" onClick={() => handleEditFac(faculty)}>{t('common.edit')}</button>
                                    <button className="action-btn danger" onClick={() => setDeleteFac(faculty)}>{t('common.delete')}</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <DepartmentFormModal
                isOpen={isDeptFormOpen}
                department={editingDept}
                onClose={() => { setIsDeptFormOpen(false); setEditingDept(null); }}
                onSave={handleSaveDept}
            />

            {/* Faculty form — reuses a simple inline modal */}
            {isFacFormOpen && <FacultyFormModal
                faculty={editingFac}
                onClose={() => { setIsFacFormOpen(false); setEditingFac(null); }}
                onSave={handleSaveFac}
            />}

            <ConfirmModal
                isOpen={!!deleteDept}
                title={t('common.delete')}
                message={deleteDept ? deleteDept.name : ''}
                variant="danger"
                confirmText={t('common.delete')}
                onConfirm={handleDeleteDeptConfirm}
                onCancel={() => setDeleteDept(null)}
            />

            <ConfirmModal
                isOpen={!!deleteFac}
                title={t('common.delete')}
                message={deleteFac ? deleteFac.name : ''}
                variant="danger"
                confirmText={t('common.delete')}
                onConfirm={handleDeleteFacConfirm}
                onCancel={() => setDeleteFac(null)}
            />
        </div>
    );
}

function FacultyFormModal({ faculty, onClose, onSave }) {
    const { t } = useTranslation();
    const [name, setName] = useState(faculty?.name || '');
    const [address, setAddress] = useState(faculty?.address || '');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) { setError(t('validation.required') || 'Required'); return; }
        onSave({ name, address });
    };

    return (
        <div className="dept-form-backdrop" onClick={onClose}>
            <div className="dept-form-dialog" onClick={(e) => e.stopPropagation()}>
                <h2>{faculty ? t('common.edit') : t('common.create')} — {t('nav.faculties')}</h2>
                <form className="dept-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>{t('common.name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            className={error ? 'field-error' : ''}
                        />
                        {error && <span className="error-text">{error}</span>}
                    </div>
                    <div className="form-field">
                        <label>{t('common.contactInfo')}</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>{t('common.cancel')}</button>
                        <button type="submit" className="btn-save">{t('common.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DepartmentsPage;
