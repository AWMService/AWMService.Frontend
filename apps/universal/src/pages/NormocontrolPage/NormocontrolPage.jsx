import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './NormocontrolPage.css';

// Mock data для документов на нормоконтроль
const mockDocuments = [
    {
        id: 1,
        studentName: 'Иванов А.А.',
        group: 'ИС-21',
        themeTitle: 'Разработка веб-приложения для управления задачами',
        submittedDate: '2025-05-15',
        status: 'pending',
        documentType: 'Пояснительная записка',
        version: 2,
    },
    {
        id: 2,
        studentName: 'Сидорова М.В.',
        group: 'ИС-21',
        themeTitle: 'Мобильное приложение для учёта финансов',
        submittedDate: '2025-05-14',
        status: 'revision',
        documentType: 'Пояснительная записка',
        version: 1,
        remarks: 3,
    },
    {
        id: 3,
        studentName: 'Петренко О.И.',
        group: 'ИС-20',
        themeTitle: 'Система автоматизации документооборота',
        submittedDate: '2025-05-10',
        status: 'approved',
        documentType: 'Пояснительная записка',
        version: 3,
    },
];

function NormocontrolPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('pending');

    const filteredDocs = mockDocuments.filter(doc => {
        if (activeTab === 'pending') return doc.status === 'pending';
        if (activeTab === 'revision') return doc.status === 'revision';
        if (activeTab === 'approved') return doc.status === 'approved';
        return true;
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: t('normocontrol.pendingCheck'), class: 'status-pending' },
            revision: { label: t('normocontrol.revision'), class: 'status-revision' },
            approved: { label: t('normocontrol.approved'), class: 'status-approved' },
        };
        return statusMap[status] || { label: status, class: '' };
    };

    return (
        <div className="normocontrol-page">
            <div className="page-header">
                <h1>{t('normocontrol.documentsCheck')}</h1>
                <p className="page-subtitle">
                    {t('normocontrol.pendingCheck')}: {mockDocuments.filter(d => d.status === 'pending').length}
                </p>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    {t('normocontrol.pendingCheck')} ({mockDocuments.filter(d => d.status === 'pending').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'revision' ? 'active' : ''}`}
                    onClick={() => setActiveTab('revision')}
                >
                    {t('normocontrol.revision')} ({mockDocuments.filter(d => d.status === 'revision').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('approved')}
                >
                    {t('normocontrol.checked')} ({mockDocuments.filter(d => d.status === 'approved').length})
                </button>
            </div>

            <div className="documents-list">
                {filteredDocs.map(doc => {
                    const statusBadge = getStatusBadge(doc.status);
                    return (
                        <div key={doc.id} className="document-card">
                            <div className="document-card-header">
                                <div className="student-info">
                                    <h3>{doc.studentName}</h3>
                                    <span className="group">{doc.group}</span>
                                </div>
                                <span className={`status-badge ${statusBadge.class}`}>
                                    {statusBadge.label}
                                </span>
                            </div>
                            
                            <p className="theme-title">{doc.themeTitle}</p>
                            
                            <div className="document-meta">
                                <span className="doc-type">{doc.documentType}</span>
                                <span className="version">v{doc.version}</span>
                            </div>

                            <div className="document-card-footer">
                                <span>{t('common.date')}: {doc.submittedDate}</span>
                                {doc.remarks && (
                                    <span className="remarks">
                                        {doc.remarks} замечаний
                                    </span>
                                )}
                            </div>

                            <div className="document-actions">
                                <button className="action-btn secondary">
                                    {t('common.view')}
                                </button>
                                {doc.status === 'pending' && (
                                    <>
                                        <button className="action-btn success">
                                            {t('normocontrol.approved')}
                                        </button>
                                        <button className="action-btn warning">
                                            {t('normocontrol.addRemark')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredDocs.length === 0 && (
                    <div className="empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NormocontrolPage;
