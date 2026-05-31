import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './DefenseStepPage.css';
import { SubmissionCard } from '../../components/SubmissionCard/SubmissionCard.jsx';
import { ScheduleCard } from '../../components/ScheduleCard/ScheduleCard.jsx';
import { Results } from '../../components/Results/Results.jsx';
import { CommissionCard } from '../../components/CommissionCard/CommissionCard.jsx';
import { useUploadAttachment, useCurrentWorkId, useStudentDefenseStep } from '@awm/shared';

const DefenseStepPage = () => {
  const { t } = useTranslation();
  const { data: defenseStep, isLoading } = useStudentDefenseStep();
  const { data: workId } = useCurrentWorkId();
  const uploadMutation = useUploadAttachment(workId);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Presentation upload (final defense only)
  const [presentationFile, setPresentationFile] = useState(null);
  const [presentationSubmitted, setPresentationSubmitted] = useState(false);
  const [presentationError, setPresentationError] = useState(null);

  const schedule = defenseStep?.schedule
    ? {
        date: defenseStep.schedule.date,
        time: defenseStep.schedule.time,
        location: defenseStep.schedule.location,
      }
    : null;

  const commission = defenseStep?.commission || [];
  const previousAttempts = defenseStep?.previousAttempts || [];
  const attemptNumber = defenseStep?.attemptNumber;
  const resultsType = defenseStep?.stepType === 'defense' ? 'defense' : 'pre-defense';
  const pageTitle = defenseStep?.stepType === 'defense' ? t('student.defense') : t('student.preDefense');
  const infoText = t('student.uploadFinalVersion');
  const hasAttemptTracking = defenseStep?.stepType === 'pre-defense' && attemptNumber != null;

  // Normalise API result fields to what Results component expects
  const rawResults = defenseStep?.results;
  const results = rawResults
    ? {
        finalGrade: rawResults.gradeLetter ?? rawResults.finalGrade ?? '—',
        commissionGrade: rawResults.score != null ? rawResults.score.toFixed(1) : (rawResults.commissionGrade ?? '—'),
        finalScore: rawResults.score != null ? rawResults.score.toFixed(1) : '—',
        comments: rawResults.decision,
      }
    : null;

  const isDefenseComplete = !!results && defenseStep?.stepType === 'defense';

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !workId) return;
    setUploadError(null);
    try {
      await uploadMutation.mutateAsync({ file, attachmentType: 'Final' });
      setIsSubmitted(true);
    } catch (err) {
      setUploadError(err.message || t('common.error'));
    }
  };

  const handleFileDelete = () => {
    setFile(null);
    setIsSubmitted(false);
  };

  const handlePresentationChange = (e) => {
    if (e.target.files.length > 0) setPresentationFile(e.target.files[0]);
  };

  const handlePresentationSubmit = async () => {
    if (!presentationFile || !workId) return;
    setPresentationError(null);
    try {
      await uploadMutation.mutateAsync({ file: presentationFile, attachmentType: 'Presentation' });
      setPresentationSubmitted(true);
    } catch (err) {
      setPresentationError(err.message || t('common.error'));
    }
  };

  const handlePresentationDelete = () => {
    setPresentationFile(null);
    setPresentationSubmitted(false);
  };

  const isFinalDefense = defenseStep?.stepType === 'defense';

  if (isLoading) {
    return (
      <div className="defense-step-page">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="defense-step-page">
      <div className="defense-step-header">
        <h2>{pageTitle}</h2>
        {hasAttemptTracking && (
          <span className="attempt-badge">
            {t('student.attemptNumber')} #{attemptNumber}
          </span>
        )}
      </div>
      {isDefenseComplete && (
        <div className={`defense-result-banner ${rawResults?.isPassed ? 'defense-result-banner--passed' : 'defense-result-banner--failed'}`}>
          {rawResults?.isPassed
            ? t('student.defensePassedBanner', '🎓 Поздравляем! Вы успешно защитили дипломную работу.')
            : t('student.defenseFailedBanner', 'К сожалению, защита не пройдена. Обратитесь к научному руководителю.')}
        </div>
      )}

      <div className="defense-step-grid">
        <div className="defense-step-left">
          {!isDefenseComplete && (
            <>
              <SubmissionCard
                isSubmitted={isSubmitted}
                file={file}
                infoText={infoText}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                handleFileDelete={handleFileDelete}
                isUploading={uploadMutation.isPending}
                uploadError={uploadError}
              />
              {isFinalDefense && (
                <SubmissionCard
                  title={t('student.presentationUpload', 'Загрузить презентацию')}
                  isSubmitted={presentationSubmitted}
                  file={presentationFile}
                  infoText={t('student.presentationUploadHint', 'Загрузите файл презентации (PPTX, PDF) для защиты.')}
                  handleFileChange={handlePresentationChange}
                  handleSubmit={handlePresentationSubmit}
                  handleFileDelete={handlePresentationDelete}
                  isUploading={uploadMutation.isPending}
                  uploadError={presentationError}
                />
              )}
            </>
          )}
          {(isDefenseComplete || isSubmitted) && <Results results={results} resultsType={resultsType} />}
        </div>
        <div className="defense-step-right">
          {schedule && <ScheduleCard title={`${t('nav.schedule')} ${pageTitle}`} schedule={schedule} />}
          <CommissionCard commission={commission} />
        </div>
      </div>

      {hasAttemptTracking && previousAttempts.length > 0 && (
        <div className="attempt-history-section">
          <button
            className="attempt-history-toggle"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            <span>{t('student.attemptHistory')}</span>
            <span className={`attempt-history-arrow ${isHistoryOpen ? 'open' : ''}`}>▼</span>
          </button>

          {isHistoryOpen && (
            <div className="attempt-history-list">
              {previousAttempts.map((attempt) => (
                <div key={attempt.attemptNumber} className="attempt-history-card">
                  <div className="attempt-history-card-header">
                    <span className="attempt-history-number">
                      {t('student.attemptNumber')} #{attempt.attemptNumber}
                    </span>
                    <span className={`attempt-result-badge ${attempt.score >= 70 ? 'passed' : 'not-passed'}`}>
                      {attempt.isPassed ? t('student.passed') : t('student.notPassed')}
                    </span>
                  </div>
                  <div className="attempt-history-details">
                    <span>{t('student.date')}: {attempt.date}</span>
                    <span>{t('student.score')}: {attempt.score}</span>
                  </div>
                  {attempt.comments && (
                    <div className="attempt-history-comments">
                      {t('student.commentsLabel')} {attempt.comments}
                    </div>
                  )}
                </div>
              ))}

              <div className="attempt-history-card current">
                <div className="attempt-history-card-header">
                  <span className="attempt-history-number">
                    {t('student.attemptNumber')} #{attemptNumber}
                  </span>
                  <span className="attempt-current-badge">
                    {t('student.currentAttempt')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DefenseStepPage;
