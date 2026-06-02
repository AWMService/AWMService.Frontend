import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { adminApi, useAuth } from '@awm/shared';
import './StudentsPage.css';

export default function StudentsPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const universityId = user?.universityId || 1;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: items = [], isLoading } = useQuery({
        queryKey: ['admin-students', universityId, statusFilter, searchTerm],
        queryFn: () => adminApi.fetchStudents({ universityId, search: searchTerm, status: statusFilter === 'all' ? null : statusFilter }),
        enabled: !!universityId
    });



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
                    <p className="page-subtitle">{items.length} {t('admin.studentsTitle').toLowerCase()}</p>
                </div>
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
                </div>

                {isLoading && <div className="loading-state">{t('common.loading')}...</div>}

                {items.map((item, idx) => (
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
                    </div>
                ))}

                {!isLoading && items.length === 0 && (
                    <div className="empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                )}
            </div>

        </div>
    );
}
