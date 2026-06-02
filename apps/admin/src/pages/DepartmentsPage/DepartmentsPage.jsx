import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInstitutes, useDepartments } from '@awm/shared';
import './DepartmentsPage.css';
function DepartmentsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('departments');
    
    // API Hooks
    const { data: departments = [] } = useDepartments();
    const { data: faculties = [] } = useInstitutes();

    return (
        <div className="departments-page">
            <div className="page-header">
                <div>
                    <h1>{t('nav.departments')} / {t('nav.faculties')}</h1>
                    <p className="page-subtitle">
                        {departments.length} {t('nav.departments').toLowerCase()}, {faculties.length} {t('nav.faculties').toLowerCase()}
                    </p>
                </div>
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
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default DepartmentsPage;
