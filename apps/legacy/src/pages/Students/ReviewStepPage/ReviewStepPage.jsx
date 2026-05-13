import React, { useState } from 'react';
import './ReviewStepPage.css';
import warningIcon from '../../../assets/icons/alert-circle-icon.svg';
import infoIcon from '../../../assets/icons/pre-defense/info-icon.svg';
import { UploadModal } from '../../../components/Students/UploadModal/UploadModal.jsx';
import { InfoBox } from '../../../components/Students/InfoBox/InfoBox.jsx';
import { UploadedFilesCard } from '../../../components/Students/UploadedFilesCard/UploadedFilesCard.jsx';
import { CommentsCard } from '../../../components/Students/CommentsCard/CommentsCard.jsx';
import { PeriodCard } from '../../../components/Students/PeriodCard/PeriodCard.jsx';
import { ExpertCard } from '../../../components/Students/ExpertCard/ExpertCard.jsx';

const ReviewStepPage = ({ pageTitle, pageIcon, expert, initialStatus }) => {
    const [status, setStatus] = useState(initialStatus || 'in_progress');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([
        { name: 'Диплом_Иванов_v1.docx', date: '20.05.2025' },
    ]);

    const period = { start: '20.05.2025', end: '10.06.2025' };
    const comments = "1. Отредактировать введение.\n2. Список литературы не по ГОСТу.\n3. Убрать опечатки в 3 разделе.";

    const renderInfoBox = () => {
        switch (status) {
            case 'failed':
                return (
                    <InfoBox icon={warningIcon} type="warning">
                        <p className="info-title">Эксперт вернул работу на доработку</p>
                        <p className="info-desc">Необходимо исправить замечания и загрузить новую версию.</p>
                    </InfoBox>
                );
            case 'success':
                return (
                    <InfoBox icon={infoIcon} type="success">
                        <p className="info-title">Этап успешно пройден</p>
                        <p className="info-desc">Материалы утверждены и будут использованы для защиты.</p>
                    </InfoBox>
                );
            default: // in_progress
                return (
                    <InfoBox icon={infoIcon} type="neutral">
                        <p className="info-title">Ожидается проверка эксперта</p>
                        <p className="info-desc">Вы можете загрузить обновленную версию до окончания срока.</p>
                    </InfoBox>
                );
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        const newFile = { name: file.name, date: new Date().toLocaleDateString('ru-RU') };
        setUploadedFiles([...uploadedFiles, newFile]);
        setStatus('in_progress');
        setIsModalOpen(false);
        setFile(null);
    };

    const handleDeleteFile = (indexToDelete) => {
        const updatedFiles = uploadedFiles.filter((_, index) => index !== indexToDelete);
        setUploadedFiles(updatedFiles);
    };

    return (
        <div className="review-step-page">
            <header className="review-step-header">
                <div className="header-title-row">
                    <img src={pageIcon} alt="" className="page-icon"/>
                    <h2>{pageTitle}</h2>
                </div>
            </header>

            <div className="review-step-content">
                {renderInfoBox()}

                <div className="review-step-grid">
                    <div className="review-step-left">
                        <UploadedFilesCard
                            uploadedFiles={uploadedFiles}
                            onUploadClick={() => setIsModalOpen(true)}
                            onDeleteFile={handleDeleteFile}
                            status={status}
                        />
                        <CommentsCard comments={comments} status={status} />
                    </div>

                    <div className="review-step-right">
                        <PeriodCard period={period} />
                        <ExpertCard expert={expert} />
                    </div>
                </div>
            </div>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onFileChange={handleFileChange}
                onUpload={handleUpload}
                file={file}
            />
        </div>
    );
};

export default ReviewStepPage;