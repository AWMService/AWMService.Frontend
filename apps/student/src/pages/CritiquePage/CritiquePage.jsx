import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CritiquePage.css';
import infoIcon from '../../assets/icons/pre-defense/info-icon.svg';
import mailReviewIcon from '../../assets/icons/mail-review-icon.svg';
import fileIcon from '../../assets/icons/pre-defense/file-icon.svg';
import doneIcon from '../../assets/icons/done-icon.svg';
import clockIcon from '../../assets/icons/pre-defense/clock-icon.svg';
import { PeriodCard } from '../../components/PeriodCard/PeriodCard.jsx';
import { UploadReviewCard } from '../../components/UploadReviewCard/UploadReviewCard.jsx';
import { DownloadableMaterialsCard } from '../../components/DownloadableMaterialsCard/DownloadableMaterialsCard.jsx';
import { ExpertCard } from '../../components/ExpertCard/ExpertCard.jsx';
import { InfoBox } from '../../components/InfoBox/InfoBox.jsx';

const downloadableFiles = [
    { name: 'Дипломная_работа_финал.docx', size: '1.2 MB' },
    { name: 'Отчет_антиплагиат.pdf', size: '450 KB' },
    { name: 'Отзыв_научного_руководителя.pdf', size: '320 KB' },
];

const reviewerData = {
    name: 'Волков Дмитрий Сергеевич',
    email: 'volkov@university.edu',
    department: 'Информационные системы',
};

const CritiquePage = () => {
    const { t } = useTranslation();
    const [reviewFile, setReviewFile] = useState(null);
    // 'not_received' | 'sent_to_reviewer' | 'received'
    const [status, setStatus] = useState('not_received');

    const periodData = { startDate: '21.05.2025', endDate: '10.06.2025' };
    const expertData = {
        name: 'Паленшеев Н.П.',
        position: 'Преподаватель',
        degree: 'PhD',
        email: 'palensheevnur@university'
    };

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setReviewFile(event.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (reviewFile) setStatus('sent_to_reviewer');
    };

    const handleCheckStatus = () => {
        setStatus('received');
    };

    const handleDownloadReview = () => {
        console.log('Download review: Рецензия_Волков.pdf');
        alert(t('student.downloadReview') + ': Рецензия_Волков.pdf');
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

    const reviewerInfoBlock = () => (
        <div className="card-compact critique-reviewer-card">
            <h3 className="card-title-compact">{t('student.reviewerInfo')}</h3>
            <div className="critique-reviewer-details">
                <div className="critique-reviewer-avatar">
                    {reviewerData.name.charAt(0)}
                </div>
                <div className="critique-reviewer-text">
                    <p className="critique-reviewer-name">{reviewerData.name}</p>
                    <p className="critique-reviewer-meta">Email: {reviewerData.email}</p>
                    <p className="critique-reviewer-meta">
                        {t('student.department')}: {reviewerData.department}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderMainContent = () => {
        if (status === 'not_received') {
            return (
                <>
                    <DownloadableMaterialsCard files={downloadableFiles} />
                    <div className="spacer-20" />
                    <UploadReviewCard
                        onFileChange={handleFileChange}
                        onSubmit={handleSubmit}
                        reviewFile={reviewFile}
                    />
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

                    <div className="spacer-20" />
                    <button className="btn-primary-compact" onClick={handleCheckStatus}>
                        {t('student.checkStatus')}
                    </button>
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

                <div className="spacer-20" />
                <div className="card-compact">
                    <h3 className="card-title-compact">{t('student.reviewFile')}</h3>
                    <div className="critique-review-file-row">
                        <div className="file-info-row">
                            <img src={fileIcon} alt="File" />
                            <div className="file-texts">
                                <span className="fname">Рецензия_Волков.pdf</span>
                                <span className="fsize">12.06.2025</span>
                            </div>
                        </div>
                        <button className="btn-primary-compact critique-download-btn" onClick={handleDownloadReview}>
                            {t('student.downloadReview')}
                        </button>
                    </div>
                </div>
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
                    <ExpertCard expert={expertData} />
                </aside>
            </div>
        </div>
    );
};

export default CritiquePage;