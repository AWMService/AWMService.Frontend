import React, { useState } from 'react';
import './ReviewStepPage.css';
import warningIcon from '../../../assets/icons/alert-circle-icon.svg';
import infoIcon from '../../../assets/icons/pre-defense/info-icon.svg';
import { UploadModal } from '../../../components/Students/UploadModal/UploadModal.jsx';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';
import uploadIcon from '../../../assets/icons/pre-defense/upload-icon.svg';
import { InfoBox } from '../../../components/Students/InfoBox/InfoBox.jsx';
import { UploadedFilesCard  } from '../../../components/Students/UploadedFilesCard/UploadedFilesCard.jsx';
import { CommentsCard } from '../../../components/Students/CommentsCard/CommentsCard.jsx';
import { PeriodCard  } from '../../../components/Students/PeriodCard/PeriodCard.jsx';
import { ExpertCard } from '../../../components/Students/ExpertCard/ExpertCard.jsx';

const ReviewStepPage = ({ pageTitle, pageIcon, expert, initialStatus }) => {
  const [status, setStatus] = useState(initialStatus || 'in_progress');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([
      { name: 'Диплом_Иванов_v1.docx', date: '2025-05-20' },
  ]);

  const period = { start: '2025-05-20', end: '2025-06-10' };
  const comments = "1. Отредактировать введение.\n2. Список литературы не по ГОСТу.\n3. Убрать опечатки в 3 разделе.";

  const renderInfoBox = () => {
    switch (status) {
      case 'failed':
        return (
          <InfoBox icon={warningIcon} type="warning">
            <p><strong>Эксперт поставил отметку о не прохождении {pageTitle.toLowerCase()}</strong></p>
            <p>Доработайте и загрузите необходимые материалы.</p>
          </InfoBox>
        );
      case 'success':
        return (
          <InfoBox icon={infoIcon} type="success">
            <p><strong>Загруженные материалы нельзя поменять после прохождения {pageTitle.toLowerCase()}</strong></p>
            <p>Загруженные материалы будут использовать для антиплагиата и защиты.</p>
          </InfoBox>
        );
      default: // in_progress
        return (
            <InfoBox icon={infoIcon} type="neutral">
                <p><strong>Ожидается проверка эксперта</strong></p>
                <p>Эксперт проверяет загруженные вами материалы. Вы можете загрузить новую версию до окончания периода проверки.</p>
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
      const newFile = { name: file.name, date: new Date().toISOString().split('T')[0] };
      setUploadedFiles([...uploadedFiles, newFile]);
      setStatus('in_progress');
      setIsModalOpen(false);
      setFile(null);
  };

  return (
    <div className="review-step-page">
        <div className="review-step-header">
          <img src={pageIcon} alt=""/>
          <h2>{pageTitle}</h2>
        </div>

        {renderInfoBox()}

        <div className="review-step-grid">
            <div className="review-step-left">
                <UploadedFilesCard uploadedFiles={uploadedFiles} onUploadClick={() => setIsModalOpen(true)} status={status} />
                <CommentsCard comments={comments} status={status} />
            </div>

            <div className="review-step-right">
                <PeriodCard period={period} />
                <ExpertCard expert={expert} />
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
