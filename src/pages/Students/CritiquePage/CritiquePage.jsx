import React, { useState } from 'react';
import './CritiquePage.css';
import infoIcon from '../../../assets/icons/pre-defense/info-icon.svg';
import mailReviewIcon from '../../../assets/icons/mail-review-icon.svg';
import uploadIcon from '../../../assets/icons/pre-defense/upload-icon.svg';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';
import { PeriodCard } from '../../../components/Students/PeriodCard/PeriodCard.jsx';
import { UploadReviewCard } from '../../../components/Students/UploadReviewCard/UploadReviewCard.jsx';
import doneIcon from '../../../assets/icons/done-icon.svg';
import { DownloadableMaterialsCard } from '../../../components/Students/DownloadableMaterialsCard/DownloadableMaterialsCard.jsx';
import { ExpertCard } from '../../../components/Students/ExpertCard/ExpertCard.jsx';

const downloadableFiles = [
    { name: 'Дипломка 1112.docx' },
    { name: 'Антиплагиат Дипломка 1112.pdf' },
    { name: 'Отзыв НР на Дипломка 1112.pdf' },
];

const CritiquePage = () => {
    const [reviewFile, setReviewFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const periodData = {
        startDate: '2025-05-21',
        endDate: '2025-05-21',
    };

    const expertData = {
        name: 'Паленшеев Н.П.',
        role: 'Эксперт',
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
        if (reviewFile) {
            setIsSubmitted(true);
        }
    };

    const renderInitialView = () => (
        <>
            <DownloadableMaterialsCard files={downloadableFiles} />
            <UploadReviewCard onFileChange={handleFileChange} onSubmit={handleSubmit} reviewFile={reviewFile} />
        </>
    );

    const renderSubmittedView = () => (
        <div className="critique-card submitted-card">
            <img src={doneIcon} alt="Success" className="success-icon"/>
            <h2 className="critique-card-title">Рецензия успешно загружена</h2>
            <p>Ваш отзыв был отправлен на проверку.</p>
            <div className="file-display">
                <img src={fileIcon} alt="File"/>
                <span>{reviewFile.name}</span>
            </div>
        </div>
    );

    return (
        <div className="critique-page">
            <div className="header-container">
                <img src={mailReviewIcon} alt="Critique Icon" className="header-icon"/>
                <h1 className="header-title">Рецензия</h1>
            </div>

            <div className="info-banner">
                <img src={infoIcon} alt="Info"/>
                <span>Отправьте нужные материалы рецензенту и загрузите отзыв рецензента</span>
            </div>

            <div className="page-columns">
                <div className="main-column">
                    {isSubmitted ? renderSubmittedView() : renderInitialView()}
                </div>
                <div className="side-column">
                    <PeriodCard period={periodData} />
                    <ExpertCard expert={expertData} />
                </div>
            </div>
        </div>
    );
};

export default CritiquePage;
