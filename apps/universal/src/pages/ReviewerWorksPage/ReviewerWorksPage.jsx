import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyReviewerAssignments } from '@awm/shared';
import ReviewWritingModal from '../../components/ReviewWritingModal/ReviewWritingModal';
import './ReviewerWorksPage.css';

function ReviewerWorksPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('pending');
    const [reviewModalWork, setReviewModalWork] = useState(null);

    const { data: assignments = [], isLoading } = useMyReviewerAssignments();

    const works = useMemo(() => {
        return assignments.map(item => ({
            id: item.workId,
            status: item.isReviewUploaded ? 'reviewed' : 'pending',
            topicTitle: item.topicTitle,
            studentName: item.studentName,
            reviewId: item.reviewId,
        }));
    }, [assignments]);

    const filteredWorks = works.filter(work => {
        if (activeTab === 'pending') return work.status === 'pending';
        if (activeTab === 'reviewed') return work.status === 'reviewed';
        return true;
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: t('reviewer.pendingReview'), class: 'status-pending' },
            reviewed: { label: t('reviewer.reviewed'), class: 'status-completed' },
        };
        return statusMap[status] || { label: status, class: '' };
    };

    if (isLoading) {
        return (
            <div className="reviewer-works-page">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

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
                                    <h3>{work.studentName || t('student.student')}</h3>
                                    <span className="topic-title">{work.topicTitle || t('department.topic')}</span>
                                </div>
                                <span className={`status-badge ${statusBadge.class}`}>
                                    {statusBadge.label}
                                </span>
                            </div>
                            {work.status !== 'reviewed' && (
                                <button className="review-btn" onClick={(e) => { e.stopPropagation(); setReviewModalWork(work); }}>
                                    {t('reviewer.writeReview')}
                                </button>
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
                onSubmit={() => {
                    setReviewModalWork(null);
                }}
            />
        </div>
    );
}

export default ReviewerWorksPage;
