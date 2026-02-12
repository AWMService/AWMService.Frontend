import React, { useState } from 'react';
import './AntiplagiarismPage.css';
import infoIcon from '../../../assets/icons/pre-defense/info-icon.svg';
import warningIcon from '../../../assets/icons/alert-circle-icon.svg';
import successIcon from '../../../assets/icons/done-icon.svg';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';

import { InfoBox } from '../../../components/Students/InfoBox/InfoBox.jsx';
import { PeriodCard } from '../../../components/Students/PeriodCard/PeriodCard.jsx';
import { UploadModal } from '../../../components/Students/UploadModal/UploadModal.jsx';
import { ExpertCard } from '../../../components/Students/ExpertCard/ExpertCard.jsx';

const CircularProgress = ({ percentage, color }) => {
    const radius = 45;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-circle-wrapper">
            <svg height={radius * 2} width={radius * 2} className="progress-svg">
                {/* Фоновый круг */}
                <circle
                    stroke="#E2E8F0"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                {/* Активный круг */}
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="progress-value" style={{ color: color }}>
                {percentage}<span>%</span>
            </div>
        </div>
    );
};

const AntiplagiarismPage = () => {
    const [status, setStatus] = useState('in_progress'); // in_progress, failed, success
    const [originality, setOriginality] = useState(50);
    const [comments] = useState("1. Высокий процент цитирования во 2 главе.\n2. Перефразируйте выводы в практической части.\n3. Обновите список источников.");
    const [currentFile, setCurrentFile] = useState({ name: 'Дипломка_финал_v2.docx', size: '1.2 MB' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);

    const periodData = { startDate: '21.05.2025', endDate: '10.06.2025' };
    const expertData = {
        name: 'Паленшеев Н.П.',
        position: 'Преподаватель',
        degree: 'PhD',
        avatar: null // Здесь может быть путь к фото
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) setFileToUpload(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!fileToUpload) return;
        setCurrentFile({ name: fileToUpload.name, size: 'Загрузка...' });
        setIsModalOpen(false);

        // Симуляция проверки
        setTimeout(() => {
            const newPct = Math.floor(Math.random() * (95 - 40 + 1)) + 40;
            setOriginality(newPct);
            setStatus(newPct >= 70 ? 'success' : 'failed');
            setCurrentFile(prev => ({ ...prev, size: '1.4 MB' }));
        }, 1500);
    };

    const renderInfoBox = () => {
        switch (status) {
            case 'in_progress':
                return (
                    <InfoBox icon={infoIcon} type="neutral">
                        <span className="info-text-main">Ожидание проверки</span>
                        <p>Проверку на антиплагиат проходит только работа, успешно прошедшая этап нормоконтроля.</p>
                    </InfoBox>
                );
            case 'failed':
                return (
                    <InfoBox icon={warningIcon} type="warning">
                        <span className="info-text-main">Требуется доработка</span>
                        <p>Оригинальность ниже порога (70%). Исправьте замечания и пройдите нормоконтроль заново перед повторной проверкой.</p>
                    </InfoBox>
                );
            case 'success':
                return (
                    <InfoBox icon={successIcon} type="success">
                        <span className="info-text-main">Проверка пройдена</span>
                        <p>Ваша работа соответствует требованиям. Данная версия файла будет зафиксирована для защиты.</p>
                    </InfoBox>
                );
            default: return null;
        }
    };

    return (
        <div className="anti-page-container">
            <header className="anti-header">
                <h2>Антиплагиат</h2>
            </header>

            {renderInfoBox()}

            <div className="anti-grid">
                <div className="anti-main-content">
                    {status === 'in_progress' ? (
                        <div className="glass-card file-card-active">
                            <div className="card-header">
                                <h4>Текущий файл</h4>
                                <span className="status-badge">На проверке</span>
                            </div>
                            <div className="file-item">
                                <div className="file-icon-bg">
                                    <img src={fileIcon} alt="docx" />
                                </div>
                                <div className="file-info">
                                    <span className="file-name">{currentFile.name}</span>
                                    <span className="file-meta">{currentFile.size} • Документ Word</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="results-container">
                            <div className="glass-card result-stat-card">
                                <h4>Оригинальность</h4>
                                <CircularProgress
                                    percentage={originality}
                                    color={status === 'success' ? '#10B981' : '#EF4444'}
                                />
                                <p className="stat-desc">
                                    {status === 'success' ? 'Допустимый порог пройден' : 'Необходимо минимум 70%'}
                                </p>
                            </div>

                            <div className="glass-card comments-section">
                                <h4>Замечания эксперта</h4>
                                <div className="comments-content">
                                    {comments.split('\n').map((line, i) => (
                                        <p key={i} className="comment-line">{line}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="anti-actions">
                        {status === 'failed' && (
                            <button className='btn-primary' onClick={() => setIsModalOpen(true)}>
                                Загрузить новую версию
                            </button>
                        )}
                        {status === 'success' && (
                            <button className='btn-secondary'>
                                Скачать полный отчет (PDF)
                            </button>
                        )}
                    </div>
                </div>

                <aside className="anti-sidebar">
                    <PeriodCard period={periodData} />
                    <ExpertCard expert={expertData} />
                </aside>
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