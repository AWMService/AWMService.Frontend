import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrograms, useDepartments, useDegreeLevels } from '@awm/shared';
import './ProgramsPage.css';

export default function ProgramsPage() {
    const { t } = useTranslation();

    const { data: items = [], isLoading } = usePrograms();

    const { data: departments = [] } = useDepartments();
    const { data: degreeLevels = [] } = useDegreeLevels();

    const [searchTerm, setSearchTerm] = useState('');

    const filtered = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="programs-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.programsTitle')}</h1>
                    <p className="page-subtitle">{filtered.length} {t('admin.programsTitle').toLowerCase()}</p>
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
            </div>

            <div className="programs-table">
                <div className="table-header">
                    <div className="col-num">№</div>
                    <div className="col-name">{t('common.name')}</div>
                    <div className="col-level">{t('admin.level')}</div>
                    <div className="col-department">{t('nav.departments')}</div>
                    <div className="col-code">{t('admin.code')}</div>
                </div>

                {filtered.map((item, idx) => {
                    const levelName = degreeLevels.find(l => l.id === item.degreeLevelId)?.name || '';
                    const deptName = departments.find(d => d.id === item.orgUnitId)?.name || '';
                    return (
                        <div key={item.id} className="table-row">
                            <div className="col-num">{idx + 1}</div>
                            <div className="col-name">{item.name}</div>
                            <div className="col-level">
                                <span className="level-badge">{levelName}</span>
                            </div>
                            <div className="col-department">{deptName}</div>
                            <div className="col-code">{item.code}</div>
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

        </div>
    );
}
