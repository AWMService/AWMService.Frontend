import React, { useState } from 'react';
import './CritiquePage.css';
import infoIcon from '../../../assets/icons/pre-defense/info-icon.svg';
import mailReviewIcon from '../../../assets/icons/mail-review-icon.svg';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';
import doneIcon from '../../../assets/icons/done-icon.svg';
import { PeriodCard } from '../../../components/Students/PeriodCard/PeriodCard.jsx';
import { UploadReviewCard } from '../../../components/Students/UploadReviewCard/UploadReviewCard.jsx';
import { DownloadableMaterialsCard } from '../../../components/Students/DownloadableMaterialsCard/DownloadableMaterialsCard.jsx';
import { ExpertCard } from '../../../components/Students/ExpertCard/ExpertCard.jsx';

const downloadableFiles = [
    { name: 'Дипломная_работа_финал.docx', size: '1.2 MB' },
    { name: 'Отчет_антиплагиат.pdf', size: '450 KB' },
    { name: 'Отзыв_научного_руководителя.pdf', size: '320 KB' },
];

const CritiquePage = () => {
    const [reviewFile, setReviewFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        if (reviewFile) setIsSubmitted(true);
    };

    return (
        <div className="critique-container-compact">
            <header className="critique-header-compact">
                <div className="header-row">
                    <img src={mailReviewIcon} alt="Icon" className="header-icon"/>
                    <h1>Рецензия</h1>
                </div>
            </header>

            <div className="info-banner-compact">
                <img src={infoIcon} alt="Info"/>
                <p>Скачайте материалы, отправьте их рецензенту, а затем загрузите полученный отзыв.</p>
            </div>

            <div className="critique-grid-compact">
                <div className="critique-main-col">
                    {isSubmitted ? (
                        <div className="card-compact success-view">
                            <div className="success-icon-wrap">
                                <img src={doneIcon} alt="Success"/>
                            </div>
                            <h3>Отзыв загружен</h3>
                            <p className="success-text">Файл отправлен на проверку.</p>

                            <div className="file-preview-compact">
                                <img src={fileIcon} alt="File"/>
                                <span>{reviewFile.name}</span>
                            </div>

                            <button className="btn-text-only" onClick={() => setIsSubmitted(false)}>
                                Заменить файл
                            </button>
                        </div>
                    ) : (
                        <>
                            <DownloadableMaterialsCard files={downloadableFiles} />
                            <div className="spacer-20"></div>
                            <UploadReviewCard
                                onFileChange={handleFileChange}
                                onSubmit={handleSubmit}
                                reviewFile={reviewFile}
                            />
                        </>
                    )}
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