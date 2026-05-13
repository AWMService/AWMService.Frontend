import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, getLocalizedValue } from '@awm/shared';
import ReviewWritingModal from '../../components/ReviewWritingModal/ReviewWritingModal';
import './ReviewerWorksPage.css';

// Mock data для работ на рецензирование
const initialWorks = [
    {
        id: 1,
        studentName: 'Иванов А.А.',
        group: 'ИС-21',
        themeTitle: {
            kk: 'Тапсырмаларды басқаруға арналған веб-қосымшаны әзірлеу',
            ru: 'Разработка веб-приложения для управления задачами',
            en: 'Development of a web application for task management',
        },
        submittedDate: '2025-05-15',
        status: 'pending',
        supervisor: 'Петров П.П.',
    },
    {
        id: 2,
        studentName: 'Сидорова М.В.',
        group: 'ИС-21',
        themeTitle: {
            kk: 'Қаржыны есепке алуға арналған мобильді қосымша',
            ru: 'Мобильное приложение для учёта финансов',
            en: 'Mobile application for financial tracking',
        },
        submittedDate: '2025-05-14',
        status: 'in_review',
        supervisor: 'Козлов К.К.',
    },
    {
        id: 3,
        studentName: 'Петренко О.И.',
        group: 'ИС-20',
        themeTitle: {
            kk: 'Құжат айналымын автоматтандыру жүйесі',
            ru: 'Система автоматизации документооборота',
            en: 'Document workflow automation system',
        },
        submittedDate: '2025-05-10',
        status: 'reviewed',
        supervisor: 'Петров П.П.',
        grade: 'A',
    },
];

function ReviewerWorksPage() {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const [activeTab, setActiveTab] = useState('pending');
    const [works, setWorks] = useState(initialWorks);
    const [reviewModalWork, setReviewModalWork] = useState(null);

    const filteredWorks = works.filter(work => {
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

    const formatDate = (dateValue) =>
        new Date(dateValue).toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    return (
        <div className="reviewer-works-page">
            <div className="page-header">
                <h1>{t('reviewer.assignedWorks')}</h1>
                <p className="page-subtitle">{t('reviewer.pendingReview')}: {works.filter(w => w.status === 'pending').length}</p>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    {t('reviewer.pendingReview')} ({works.filter(w => w.status === 'pending').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'in_review' ? 'active' : ''}`}
                    onClick={() => setActiveTab('in_review')}
                >
                    {t('status.inProgress')} ({works.filter(w => w.status === 'in_review').length})
                </button>
                <button 
                    className={`tab ${activeTab === 'reviewed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviewed')}
                >
                    {t('reviewer.reviewed')} ({works.filter(w => w.status === 'reviewed').length})
                </button>
            </div>

            <div className="works-list">
                {filteredWorks.map(work => {
                    const statusBadge = getStatusBadge(work.status);
                    return (
                        <div key={work.id} className="work-card">
                            <div className="work-card-header">
                                <div className="student-info">
                                    <h3>{work.studentName}</h3>
                                    <span className="group">{work.group}</span>
                                </div>
                            <span className={`status-badge ${statusBadge.class}`}>
                                {statusBadge.label}
                            </span>
                        </div>
                            <p className="theme-title">{getLocalizedValue(work.themeTitle, i18n.language)}</p>
                            <div className="work-card-footer">
                                <span>{t('student.supervisor')}: {work.supervisor}</span>
                                <span>{t('common.date')}: {formatDate(work.submittedDate)}</span>
                            </div>
                            {work.status !== 'reviewed' && (
                                <button className="review-btn" onClick={(e) => { e.stopPropagation(); setReviewModalWork(work); }}>
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

            <ReviewWritingModal
                isOpen={!!reviewModalWork}
                work={reviewModalWork}
                onClose={() => setReviewModalWork(null)}
                onSubmit={(reviewData) => {
                    setWorks(prev => prev.map(w =>
                        w.id === reviewData.workId
                            ? { ...w, status: 'reviewed', review: reviewData }
                            : w
                    ));
                    setReviewModalWork(null);
                }}
            />
        </div>
    );
}

export default ReviewerWorksPage;
