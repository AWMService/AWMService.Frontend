import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDegreeLevels } from '@awm/shared';
import './EducationLevelsPage.css';
export default function EducationLevelsPage() {
    const { t } = useTranslation();
    
    // API Hooks
    const { data: items = [], isLoading } = useDegreeLevels();
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="education-levels-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.educationLevelsTitle')}</h1>
                    <p className="page-subtitle">{filtered.length} {t('admin.educationLevelsTitle').toLowerCase()}</p>
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

            <div className="education-levels-table">
                <div className="table-header">
                    <div className="col-num">№</div>
                    <div className="col-name">{t('common.name')}</div>
                    <div className="col-duration">{t('admin.duration')}</div>
                </div>

                {filtered.map((item, idx) => (
                    <div key={item.id} className="table-row">
                        <div className="col-num">{idx + 1}</div>
                        <div className="col-name">{item.name}</div>
                        <div className="col-duration">{item.durationYears} {t('admin.years')}</div>
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
        </div>
    );
}
