import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './CritiquePage.css';
import infoIcon from '../../assets/icons/pre-defense/info-icon.svg';
import mailReviewIcon from '../../assets/icons/mail-review-icon.svg';
import fileIcon from '../../assets/icons/pre-defense/file-icon.svg';
import doneIcon from '../../assets/icons/done-icon.svg';
import clockIcon from '../../assets/icons/pre-defense/clock-icon.svg';
import { PeriodCard } from '../../components/PeriodCard/PeriodCard.jsx';
import { UploadReviewCard } from '../../components/UploadReviewCard/UploadReviewCard.jsx';
import { ExpertCard } from '../../components/ExpertCard/ExpertCard.jsx';
import { InfoBox } from '../../components/InfoBox/InfoBox.jsx';
import {
    useCurrentWorkId,
    useAssignedReviewer,
    useReviewsByWork,
    useUploadExternalReview,
    useMyWorkProgress,
} from '@awm/shared';

const CritiquePage = () => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [reviewFile, setReviewFile] = useState(null);

    // API data
    const { data: workId } = useCurrentWorkId();
    const { data: reviewer, isLoading: reviewerLoading } = useAssignedReviewer(workId);
    const { data: reviews = [], isLoading: reviewsLoading, refetch: refetchReviews } = useReviewsByWork(workId);
    const { data: workProgress } = useMyWorkProgress();
    const uploadMutation = useUploadExternalReview();

    // Derive review status from API
    const externalReview = reviews.find(
        (r) => r.type === 'ExternalReview' || r.reviewType === 'ExternalReview' || r.type === 2
    );
    const status = externalReview?.isFinal
        ? 'received'
        : externalReview
        ? 'sent_to_reviewer'
        : 'not_received';

    // Period from workProgress (semester start/end as fallback)
    const periodData = workProgress
        ? { startDate: '—', endDate: '—' } // Period stage not implemented yet
        : { startDate: '—', endDate: '—' };

    // Expert card data from reviewer entity
    const expertData = reviewer
        ? {
              name: reviewer.fullName,
              position: reviewer.position || t('reviewer.externalReviewer'),
              degree: reviewer.academicDegree || '',
              email: reviewer.email || '',
          }
        : null;

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setReviewFile(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!reviewFile || !workId) return;

        const formData = new FormData();
        formData.append('file', reviewFile);

        try {
            await uploadMutation.mutateAsync({ workId, formData });
            setReviewFile(null);
            refetchReviews();
        } catch (err) {
            console.error('Failed to upload review:', err);
        }
    };

    const handleDownloadReview = () => {
        if (externalReview?.attachmentId) {
            // TODO: implement download via attachment endpoint
            console.log('Download review attachment:', externalReview.attachmentId);
        }
    };

    const statusBadge = () => {
        if (status === 'sent_to_reviewer') {
            return (
                <span className="critique-badge critique-badge--warning">
                    {t('student.waitingForReview')}
                </span>
            );
        }
        if (status === 'received') {
            return (
                <span className="critique-badge critique-badge--success">
                    {t('student.reviewReceived')}
                </span>
            );
        }
        return null;
    };

    const reviewerInfoBlock = () => {
        if (!reviewer) return null;
        return (
            <div className="card-compact critique-reviewer-card">
                <h3 className="card-title-compact">{t('student.reviewerInfo')}</h3>
                <div className="critique-reviewer-details">
                    <div className="critique-reviewer-avatar">
                        {reviewer.fullName.charAt(0)}
                    </div>
                    <div className="critique-reviewer-text">
                        <p className="critique-reviewer-name">{reviewer.fullName}</p>
                        {reviewer.email && (
                            <p className="critique-reviewer-meta">Email: {reviewer.email}</p>
                        )}
                        {reviewer.organization && (
                            <p className="critique-reviewer-meta">
                                {t('student.department')}: {reviewer.organization}
                            </p>
                        )}
                        {reviewer.position && (
                            <p className="critique-reviewer-meta">{reviewer.position}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const isLoading = reviewerLoading || reviewsLoading;

    const renderMainContent = () => {
        if (isLoading) {
            return <div className="critique-loading">{t('common.loading')}</div>;
        }

        if (!reviewer) {
            return (
                <InfoBox icon={infoIcon} type="neutral">
                    <p className="info-title">{t('student.reviewerNotAssigned')}</p>
                    <p className="info-desc">{t('student.reviewerNotAssignedDesc')}</p>
                </InfoBox>
            );
        }

        if (status === 'not_received') {
            return (
                <>
                    <UploadReviewCard
                        onFileChange={handleFileChange}
                        onSubmit={handleSubmit}
                        reviewFile={reviewFile}
                        isSubmitting={uploadMutation.isPending}
                    />
                    {uploadMutation.isError && (
                        <p className="critique-error">{t('common.uploadError')}</p>
                    )}
                </>
            );
        }

        if (status === 'sent_to_reviewer') {
            return (
                <>
                    <InfoBox icon={clockIcon} type="neutral">
                        <p className="info-title">{t('student.workSentToReviewer')}</p>
                        <p className="info-desc">{t('student.waitingForReviewDesc')}</p>
                    </InfoBox>

                    <div className="spacer-20" />
                    {reviewerInfoBlock()}

                    {reviewFile && (
                        <>
                            <div className="spacer-20" />
                            <div className="card-compact">
                                <h3 className="card-title-compact">{t('student.uploadedWork')}</h3>
                                <div className="file-preview-compact">
                                    <img src={fileIcon} alt="File" />
                                    <span>{reviewFile.name}</span>
                                </div>
                            </div>
                        </>
                    )}
                </>
            );
        }

        // status === 'received'
        return (
            <>
                <InfoBox icon={doneIcon} type="success">
                    <p className="info-title">{t('student.reviewReceived')}</p>
                    <p className="info-desc">{t('student.reviewReceivedDesc')}</p>
                </InfoBox>

                <div className="spacer-20" />
                {reviewerInfoBlock()}

                {externalReview?.attachmentId && (
                    <>
                        <div className="spacer-20" />
                        <div className="card-compact">
                            <h3 className="card-title-compact">{t('student.reviewFile')}</h3>
                            <div className="critique-review-file-row">
                                <div className="file-info-row">
                                    <img src={fileIcon} alt="File" />
                                    <div className="file-texts">
                                        <span className="fname">{t('student.reviewDocument')}</span>
                                        <span className="fsize">
                                            {externalReview.createdAt
                                                ? new Date(externalReview.createdAt).toLocaleDateString()
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="btn-primary-compact critique-download-btn"
                                    onClick={handleDownloadReview}
                                >
                                    {t('student.downloadReview')}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </>
        );
    };

    return (
        <div className="critique-container-compact">
            <header className="critique-header-compact">
                <div className="header-row">
                    <img src={mailReviewIcon} alt="Icon" className="header-icon" />
                    <h1>{t('student.critique')}</h1>
                    {statusBadge()}
                </div>
            </header>

            <div className="info-banner-compact">
                <img src={infoIcon} alt="Info" />
                <p>{t('student.critiqueInstruction')}</p>
            </div>

            <div className="critique-grid-compact">
                <div className="critique-main-col">
                    {renderMainContent()}
                </div>

                <aside className="critique-side-col">
                    <PeriodCard period={periodData} />
                    {expertData && <ExpertCard expert={expertData} />}
                </aside>
            </div>
        </div>
    );
};

export default CritiquePage;
