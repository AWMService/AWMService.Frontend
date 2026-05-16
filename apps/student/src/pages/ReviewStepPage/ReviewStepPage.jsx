import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, useUploadAttachment, useCurrentWorkId, useAttachments, useQualityChecks, useSubmitForCheck, useMyWorkProgress, useActivePeriod } from '@awm/shared';
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
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const { data: workId } = useCurrentWorkId();
    const { data: workProgress } = useMyWorkProgress();
    const { data: apiAttachments = [] } = useAttachments(workId);
    const uploadMutation = useUploadAttachment(workId);
    const checkType = route === 'software-check' ? 'SoftwareCheck' : 'NormControl';
    const { data: checks = [] } = useQualityChecks(workId);
    const { data: activePeriod } = useActivePeriod(
        workProgress?.departmentId,
        workProgress?.academicYearId,
        checkType
    );
    const submitMutation = useSubmitForCheck(workId);
    const latestCheck = checks.filter(c => c.checkType === checkType).sort((a, b) => b.attemptNumber - a.attemptNumber)[0];
    const derivedStatus = latestCheck
        ? latestCheck.isPassed ? 'success' : 'failed'
        : initialStatus || 'in_progress';
    const [status, setStatus] = useState(derivedStatus);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    const isSoftwareCheck = route === 'software-check';
    const [submitMode, setSubmitMode] = useState('file');
    const [repoUrl, setRepoUrl] = useState('');
    const [repoUrlError, setRepoUrlError] = useState('');

    const period = activePeriod ? {
        start: new Date(activePeriod.startDate).toLocaleDateString(),
        end: new Date(activePeriod.endDate).toLocaleDateString()
    } : { start: '—', end: '—' };

    const expertData = {
        name: workProgress?.supervisorName || t('common.noData'),
        position: t('student.assignedExpert'),
        degree: '',
        ...expert
    };

    const comments = latestCheck?.comment || null;

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

    const handleUpload = async () => {
        if (!file || !workId) return;
        setUploadError(null);
        try {
            await uploadMutation.mutateAsync({ file, attachmentType: 'Draft' });
            await submitMutation.mutateAsync(checkType);
            setStatus('in_progress');
            setIsModalOpen(false);
            setFile(null);
        } catch (err) {
            setUploadError(err.message || t('common.error'));
        }
    };

    const handleDeleteFile = () => {
        // Delete handled by UploadedFilesCard via API
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
                                uploadedFiles={apiAttachments.map(a => ({ name: a.fileName, date: new Date(a.createdAt).toLocaleDateString(locale), id: a.id }))}
                                onUploadClick={() => setIsModalOpen(true)}
                                onDeleteFile={handleDeleteFile}
                                status={status}
                            />
                        )}
                        <CommentsCard comments={comments} status={status} />
                    </div>

                    <div className="review-step-right">
                        <PeriodCard period={period} />
                        <ExpertCard expert={expertData} />
                    </div>
                </div>
            </div>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onFileChange={handleFileChange}
                onUpload={handleUpload}
                file={file}
                isUploading={uploadMutation.isPending}
                uploadError={uploadError}
            />
        </div>
    );
};

export default ReviewStepPage;
