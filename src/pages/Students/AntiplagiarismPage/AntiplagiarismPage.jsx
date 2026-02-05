import React, { useState } from 'react';
import './AntiplagiarismPage.css';
import shieldCheckIcon from '../../../assets/icons/shield-check-icon.svg';
import infoIcon from '../../../assets/icons/pre-defense/info-icon.svg';
import { InfoBox } from '../../../components/Students/InfoBox/InfoBox.jsx';
import warningIcon from '../../../assets/icons/alert-circle-icon.svg';
import successIcon from '../../../assets/icons/done-icon.svg';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';
import uploadIcon from '../../../assets/icons/pre-defense/upload-icon.svg';
import commentsIcon from '../../../assets/icons/pre-defense/comments-icon.svg';
import { PeriodCard } from '../../../components/Students/PeriodCard/PeriodCard.jsx';
import { UploadModal } from '../../../components/Students/UploadModal/UploadModal.jsx';
import { ExpertCard } from '../../../components/Students/ExpertCard/ExpertCard.jsx';

const CircularProgress = ({ percentage, color }) => {
    const radius = 50;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-circle-container">
            <svg height={radius * 2} width={radius * 2}>
                <circle
                    fill="transparent"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="progress-circle-text">{percentage}%</div>
        </div>
    );
};

const AntiplagiarismPage = () => {
    const [status, setStatus] = useState('in_progress'); // in_progress, failed, success
    const [originality, setOriginality] = useState(50);
    const [comments, setComments] = useState("Комментарии 1\nКомментарии 2\nЗамечание 1\nЗамечание 2");
    const [currentFile, setCurrentFile] = useState({ name: 'Дипломка 1112.docx' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);

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

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileToUpload(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!fileToUpload) return;
        setCurrentFile({ name: fileToUpload.name });
        setStatus('in_progress');
        setIsModalOpen(false);
        setFileToUpload(null);
        setTimeout(() => {
            const newOriginality = Math.floor(Math.random() * (95 - 30 + 1)) + 30;
            setOriginality(newOriginality);
            setStatus(newOriginality >= 70 ? 'success' : 'failed');
        }, 2000);
    };

    const renderInfoBox = () => {
        switch (status) {
            case 'in_progress':
                return (
                    <InfoBox icon={infoIcon} type="neutral">
                        <p>Проверку на антиплагиат проходит только работа, прошедшая нормоконтроль.</p>
                    </InfoBox>
                );
            case 'failed':
                return (
                    <InfoBox icon={warningIcon} type="warning">
                        <p>Процент оригинальности не превысил пороговую. Исправьте все замечания и доработайте Дипломную работу. Загрузите доработанную работу и заново пройдите нормаконтроль перед тем как проходить антиплагиат.</p>
                    </InfoBox>
                );
            case 'success':
                return (
                    <InfoBox icon={successIcon} type="success">
                        <p>Работа прошла антиплагиат. Загруженная работа будет использоваться для защиты. Если хотите внести изменения, просим вас обратиться в кафедру.</p>
                    </InfoBox>
                );
            default: return null;
        }
    };

    const renderMainContent = () => {
        if (status === 'in_progress') {
            return (
                <div className="content-card uploaded-materials">
                    <h4>Загруженные материалы</h4>
                    <div className="file-display">
                        <img src={fileIcon} alt="file" />
                        <span>{currentFile.name}</span>
                    </div>
                </div>
            );
        }

        const isSuccess = status === 'success';
        const progressColor = isSuccess ? '#32ADE6' : '#FF3B30';
        const finalOriginality = isSuccess ? 87 : 50;

        return (
            <div className="results-content-cards">
                <div className="content-card originality-card">
                    <h4>% Оригинальность</h4>
                    <CircularProgress percentage={finalOriginality} color={progressColor} />
                </div>
                <div className="content-card comments-card">
                    <h4>Комментарии/Замечания</h4>
                    <div className="comments-body">
                        <pre>{comments}</pre>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="antiplagiarism-page">
            {renderInfoBox()}

            <div className="page-columns">
                <div className="main-column">
                    {renderMainContent()}

                    {status === 'failed' && (
                        <div className="action-section">
                            <button className='btn-upload' onClick={() => setIsModalOpen(true)}>
                                Загрузить новую версию
                            </button>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="action-section">
                            <button className='btn-download'>
                                Скачать отчет
                            </button>
                        </div>
                    )}
                </div>

                <div className="side-column">
                    <PeriodCard period={periodData} />
                    <ExpertCard expert={expertData} />
                </div>
            </div>

            <UploadModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onFileChange={handleFileChange} 
                onUpload={handleUpload} 
                file={fileToUpload} 
            />
        </div>
    );
};

export default AntiplagiarismPage;
