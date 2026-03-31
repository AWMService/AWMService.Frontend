import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './DepartmentsPage.css';

const mockDepartments = [
    { id: 1, name: 'Информационные системы', faculty: 'Факультет IT', head: 'Иванов И.И.', supervisorsCount: 12, studentsCount: 85 },
    { id: 2, name: 'Программная инженерия', faculty: 'Факультет IT', head: 'Петров П.П.', supervisorsCount: 8, studentsCount: 64 },
    { id: 3, name: 'Компьютерные науки', faculty: 'Факультет IT', head: 'Сидоров С.С.', supervisorsCount: 15, studentsCount: 120 },
    { id: 4, name: 'Автоматизация и управление', faculty: 'Инженерный факультет', head: 'Козлов К.К.', supervisorsCount: 10, studentsCount: 78 },
];

const mockFaculties = [
    { id: 1, name: 'Факультет IT', departmentsCount: 3 },
    { id: 2, name: 'Инженерный факультет', departmentsCount: 1 },
];

function DepartmentsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('departments');

    return (
        <div className="departments-page">
            <div className="page-header">
                <div>
                    <h1>{t('nav.departments')} / {t('nav.faculties')}</h1>
                    <p className="page-subtitle">
                        {mockDepartments.length} {t('nav.departments').toLowerCase()}, {mockFaculties.length} {t('nav.faculties').toLowerCase()}
                    </p>
                </div>
                <button className="btn-primary">
                    + {activeTab === 'departments' ? t('admin.createDepartment') : t('admin.createFaculty')}
                </button>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('departments')}
                >
                    {t('nav.departments')} ({mockDepartments.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'faculties' ? 'active' : ''}`}
                    onClick={() => setActiveTab('faculties')}
                >
                    {t('nav.faculties')} ({mockFaculties.length})
                </button>
            </div>

            {activeTab === 'departments' && (
                <div className="items-grid">
                    {mockDepartments.map(dept => (
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
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'faculties' && (
                <div className="items-grid">
                    {mockFaculties.map(faculty => (
                        <div key={faculty.id} className="item-card faculty-card">
                            <h3>{faculty.name}</h3>
                            <div className="item-stats">
                                <div className="stat">
                                    <span className="stat-value">{faculty.departmentsCount}</span>
                                    <span className="stat-label">{t('nav.departments')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DepartmentsPage;
