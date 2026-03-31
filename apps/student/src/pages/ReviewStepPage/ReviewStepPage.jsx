import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ReviewStepPage.css';
import warningIcon from '../../assets/icons/alert-circle-icon.svg';
import infoIcon from '../../assets/icons/pre-defense/info-icon.svg';
import { UploadModal } from '../../components/UploadModal/UploadModal.jsx';
import { InfoBox } from '../../components/InfoBox/InfoBox.jsx';
import { UploadedFilesCard } from '../../components/UploadedFilesCard/UploadedFilesCard.jsx';
import { CommentsCard } from '../../components/CommentsCard/CommentsCard.jsx';
import { PeriodCard } from '../../components/PeriodCard/PeriodCard.jsx';
import { ExpertCard } from '../../components/ExpertCard/ExpertCard.jsx';

const REPO_URL_PATTERN = /^https?:\/\/(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\/.+/i;

const ReviewStepPage = ({ pageTitle, pageIcon, expert, initialStatus, route }) => {
    const { t } = useTranslation();
    const [status, setStatus] = useState(initialStatus || 'in_progress');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([
        { name: 'Диплом_Иванов_v1.docx', date: '20.05.2025' },
    ]);

    const isSoftwareCheck = route === 'software-check';
    const [submitMode, setSubmitMode] = useState('file');
    const [repoUrl, setRepoUrl] = useState('');
    const [repoUrlError, setRepoUrlError] = useState('');

    const period = { start: '20.05.2025', end: '10.06.2025' };
    const comments = "1. Отредактировать введение.\n2. Список литературы не по ГОСТу.\n3. Убрать опечатки в 3 разделе.";

    const renderInfoBox = () => {
        switch (status) {
            case 'failed':
                return (
                    <InfoBox icon={warningIcon} type="warning">
                        <p className="info-title">{t('student.expertReturnedWork')}</p>
                        <p className="info-desc">{t('student.fixAndReupload')}</p>
                    </InfoBox>
                );
            case 'success':
                return (
                    <InfoBox icon={infoIcon} type="success">
                        <p className="info-title">{t('student.stagePassed')}</p>
                        <p className="info-desc">{t('student.materialsApproved')}</p>
                    </InfoBox>
                );
            default:
                return (
                    <InfoBox icon={infoIcon} type="neutral">
                        <p className="info-title">{t('student.awaitingExpertReview')}</p>
                        <p className="info-desc">{t('student.canUploadUpdated')}</p>
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

    const handleRepoSubmit = () => {
        if (!REPO_URL_PATTERN.test(repoUrl.trim())) {
            setRepoUrlError(t('student.invalidUrl'));
            return;
        }
        setRepoUrlError('');
        setStatus('in_progress');
        setRepoUrl('');
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

                {isSoftwareCheck && (
                    <div className="submit-mode-toggle">
                        <label className={`toggle-option${submitMode === 'file' ? ' active' : ''}`}>
                            <input
                                type="radio"
                                name="submitMode"
                                value="file"
                                checked={submitMode === 'file'}
                                onChange={() => setSubmitMode('file')}
                            />
                            {t('student.uploadZip')}
                        </label>
                        <label className={`toggle-option${submitMode === 'url' ? ' active' : ''}`}>
                            <input
                                type="radio"
                                name="submitMode"
                                value="url"
                                checked={submitMode === 'url'}
                                onChange={() => { setSubmitMode('url'); setRepoUrlError(''); }}
                            />
                            {t('student.enterRepoUrl')}
                        </label>
                    </div>
                )}

                {isSoftwareCheck && submitMode === 'url' && (
                    <div className="repo-url-card card">
                        <h4>{t('student.repositoryUrl')}</h4>
                        <div className="repo-url-field">
                            <input
                                type="url"
                                className={`repo-url-input${repoUrlError ? ' input-error' : ''}`}
                                placeholder="https://github.com/user/repo"
                                value={repoUrl}
                                onChange={(e) => { setRepoUrl(e.target.value); setRepoUrlError(''); }}
                            />
                            <button
                                className="btn-primary"
                                onClick={handleRepoSubmit}
                                disabled={!repoUrl.trim()}
                            >
                                {t('student.submitRepo')}
                            </button>
                        </div>
                        {repoUrlError && <p className="repo-url-error">{repoUrlError}</p>}
                    </div>
                )}

                <div className="review-step-grid">
                    <div className="review-step-left">
                        {(!isSoftwareCheck || submitMode === 'file') && (
                            <UploadedFilesCard
                                uploadedFiles={uploadedFiles}
                                onUploadClick={() => setIsModalOpen(true)}
                                onDeleteFile={handleDeleteFile}
                                status={status}
                            />
                        )}
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