import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentWorkId, useQualityChecks, useUploadAttachment, useSubmitForCheck } from '@awm/shared';
import './AntiplagiarismPage.css';
import infoIcon from '../../assets/icons/pre-defense/info-icon.svg';
import warningIcon from '../../assets/icons/alert-circle-icon.svg';
import successIcon from '../../assets/icons/done-icon.svg';
import fileIcon from '../../assets/icons/pre-defense/file-icon.svg';

import { InfoBox } from '../../components/InfoBox/InfoBox.jsx';
import { PeriodCard } from '../../components/PeriodCard/PeriodCard.jsx';
import { UploadModal } from '../../components/UploadModal/UploadModal.jsx';
import { ExpertCard } from '../../components/ExpertCard/ExpertCard.jsx';

const CircularProgress = ({ percentage, color }) => {
    const radius = 45;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-circle-wrapper">
            <svg height={radius * 2} width={radius * 2} className="progress-svg">
                <circle stroke="#E2E8F0" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
                <circle stroke={color} fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} />
            </svg>
            <div className="progress-value" style={{ color: color }}>
                {percentage}<span>%</span>
            </div>
        </div>
    );
};

const AntiplagiarismPage = () => {
    const { t } = useTranslation();
    const { data: workId } = useCurrentWorkId();
    const { data: checks = [] } = useQualityChecks(workId);
    const uploadMutation = useUploadAttachment(workId);
    const submitMutation = useSubmitForCheck(workId);

    const antiChecks = checks.filter(c => c.checkType === 'AntiPlagiarism').sort((a, b) => b.attemptNumber - a.attemptNumber);
    const latestCheck = antiChecks[0];

    const derivedStatus = latestCheck
        ? latestCheck.isPassed ? 'success' : 'failed'
        : 'in_progress';
    const [status, setStatus] = useState(derivedStatus);
    const originality = latestCheck?.resultValue != null ? Math.round(Number(latestCheck.resultValue)) : 50;
    const comments = latestCheck?.comment || '';
    const [currentFile, setCurrentFile] = useState({ name: 'Дипломка_финал_v2.docx', size: '1.2 MB' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    const periodData = { startDate: '21.05.2025', endDate: '10.06.2025' };
    const expertData = { name: 'Паленшеев Н.П.', position: 'Преподаватель', degree: 'PhD', avatar: null };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) setFileToUpload(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!fileToUpload || !workId) return;
        setUploadError(null);
        setCurrentFile({ name: fileToUpload.name, size: t('common.loading') });
        setIsModalOpen(false);
        try {
            await uploadMutation.mutateAsync({ file: fileToUpload, attachmentType: 'Final' });
            await submitMutation.mutateAsync('AntiPlagiarism');
            setStatus('in_progress');
            setCurrentFile(prev => ({ ...prev, size: (fileToUpload.size / 1024).toFixed(1) + ' KB' }));
        } catch (err) {
            setUploadError(err.message || t('common.error'));
        }
    };

    const renderInfoBox = () => {
        switch (status) {
            case 'in_progress':
                return (
                    <InfoBox icon={infoIcon} type="neutral">
                        <span className="info-text-main">{t('student.waitingCheck')}</span>
                        <p>{t('student.antiplagiarismNote')}</p>
                    </InfoBox>
                );
            case 'failed':
                return (
                    <InfoBox icon={warningIcon} type="warning">
                        <span className="info-text-main">{t('student.needsRevision')}</span>
                        <p>{t('student.belowThresholdNote')}</p>
                    </InfoBox>
                );
            case 'success':
                return (
                    <InfoBox icon={successIcon} type="success">
                        <span className="info-text-main">{t('student.checkPassed')}</span>
                        <p>{t('student.meetsRequirements')}</p>
                    </InfoBox>
                );
            default: return null;
        }
    };

    return (
        <div className="anti-page-container">
            <header className="anti-header">
                <h2>{t('student.antiplagiarism')}</h2>
            </header>

            {renderInfoBox()}

            <div className="anti-grid">
                <div className="anti-main-content">
                    {status === 'in_progress' ? (
                        <div className="glass-card file-card-active">
                            <div className="card-header">
                                <h4>{t('student.currentFile')}</h4>
                                <span className="status-badge">{t('student.onReview')}</span>
                            </div>
                            <div className="file-item">
                                <div className="file-icon-bg">
                                    <img src={fileIcon} alt="docx" />
                                </div>
                                <div className="file-info">
                                    <span className="file-name">{currentFile.name}</span>
                                    <span className="file-meta">{currentFile.size} • {t('student.wordDocument')}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="results-container">
                            <div className="glass-card result-stat-card">
                                <h4>{t('student.originality')}</h4>
                                <CircularProgress percentage={originality} color={status === 'success' ? '#10B981' : '#EF4444'} />
                                <p className="stat-desc">
                                    {status === 'success' ? t('student.thresholdMet') : t('student.thresholdNotMet')}
                                </p>
                            </div>

                            <div className="glass-card comments-section">
                                <h4>{t('student.expertComments')}</h4>
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
                                {t('student.uploadNewVersion')}
                            </button>
                        )}
                        {status === 'success' && (
                            <button className='btn-secondary'>
                                {t('student.downloadFullReport')}
                            </button>
                        )}
                    </div>
                </div>

                <aside className="anti-sidebar">
                    <PeriodCard period={periodData} />
                    <ExpertCard expert={expertData} />
                </aside>
            </div>

            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onFileChange={handleFileChange} onUpload={handleUpload} file={fileToUpload} isUploading={uploadMutation.isPending} uploadError={uploadError} />
        </div>
    );
};

export default AntiplagiarismPage;