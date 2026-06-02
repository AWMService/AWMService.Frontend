import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInstitutes } from '@awm/shared';
import './InstitutesPage.css';
export default function InstitutesPage() {
    const { t } = useTranslation();
    
    // API Hooks
    const { data: items = [], isLoading } = useInstitutes();

    const [searchTerm, setSearchTerm] = useState('');

    const filtered = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="institutes-page">
            <div className="page-header">
                <div>
                    <h1>{t('admin.institutesTitle')}</h1>
                    <p className="page-subtitle">{filtered.length} {t('admin.institutesTitle').toLowerCase()}</p>
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

            <div className="institutes-table">
                <div className="table-header">
                    <div className="col-num">№</div>
                    <div className="col-name">{t('common.name')}</div>
                    <div className="col-address">{t('admin.address')}</div>
                    <div className="col-count">{t('admin.facultyCount')}</div>
                </div>

                {filtered.map((item, idx) => (
                    <div key={item.id} className="table-row">
                        <div className="col-num">{idx + 1}</div>
                        <div className="col-name">{item.name}</div>
                        <div className="col-address">{item.address}</div>
                        <div className="col-count">{item.facultyCount}</div>
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
