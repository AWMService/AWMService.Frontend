import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ReviewerWorksPage.css';

// Mock data для работ на рецензирование
const mockWorks = [
    {
        id: 1,
        studentName: 'Иванов А.А.',
        group: 'ИС-21',
        themeTitle: 'Разработка веб-приложения для управления задачами',
        submittedDate: '2025-05-15',
        status: 'pending',
        supervisor: 'Петров П.П.',
    },
    {
        id: 2,
        studentName: 'Сидорова М.В.',
        group: 'ИС-21',
        themeTitle: 'Мобильное приложение для учёта финансов',
        submittedDate: '2025-05-14',
        status: 'in_review',
        supervisor: 'Козлов К.К.',
    },
    {
        id: 3,
        studentName: 'Петренко О.И.',
        group: 'ИС-20',
        themeTitle: 'Система автоматизации документооборота',
        submittedDate: '2025-05-10',
        status: 'reviewed',
        supervisor: 'Петров П.П.',
        grade: 'A',
    },
];

function ReviewerWorksPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedWork, setSelectedWork] = useState(null);

    const filteredWorks = mockWorks.filter(work => {
        if (activeTab === 'pending') return work.status === 'pending';
        if (activeTab === 'in_review') return work.status === 'in_review';
        if (activeTab === 'reviewed') return work.status === 'reviewed';
        return true;
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: t('reviewer.pendingReview'), class: 'status-pending' },
            in_review: { label: t('status.inProgress'), class: 'status-progress' },
            reviewed: { label: t('reviewer.reviewed'), class: 'status-completed' },
        };
        return statusMap[status] || { label: status, class: '' };
    };

    return (
        <div className="reviewer-works-page">
            <div className="page-header">
                <h1>{t('reviewer.assignedWorks')}</h1>
                <p className="page-subtitle">{t('reviewer.pendingReview')}: {mockWorks.filter(w => w.status === 'pending').length}</p>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    {t('reviewer.pendingReview')} ({mockWorks.filter(w => w.status === 'pending').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'in_review' ? 'active' : ''}`}
                    onClick={() => setActiveTab('in_review')}
                >
                    {t('status.inProgress')} ({mockWorks.filter(w => w.status === 'in_review').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'reviewed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviewed')}
                >
                    {t('reviewer.reviewed')} ({mockWorks.filter(w => w.status === 'reviewed').length})
                </button>
            </div>

            <div className="works-list">
                {filteredWorks.map(work => {
                    const statusBadge = getStatusBadge(work.status);
                    return (
                        <div key={work.id} className="work-card" onClick={() => setSelectedWork(work)}>
                            <div className="work-card-header">
                                <div className="student-info">
                                    <h3>{work.studentName}</h3>
                                    <span className="group">{work.group}</span>
                                </div>
                                <span className={`status-badge ${statusBadge.class}`}>
                                    {statusBadge.label}
                                </span>
                            </div>
                            <p className="theme-title">{work.themeTitle}</p>
                            <div className="work-card-footer">
                                <span>{t('student.supervisor')}: {work.supervisor}</span>
                                <span>{t('common.date')}: {work.submittedDate}</span>
                            </div>
                            {work.status !== 'reviewed' && (
                                <button className="review-btn">
                                    {t('reviewer.writeReview')}
                                </button>
                            )}
                            {work.grade && (
                                <div className="grade-badge">
                                    {t('reviewer.grade')}: {work.grade}
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredWorks.length === 0 && (
                    <div className="empty-state">
                        <p>{t('common.noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewerWorksPage;
