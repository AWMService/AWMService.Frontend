import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './DefenseStepPage.css';
import { SubmissionCard } from '../../components/SubmissionCard/SubmissionCard.jsx';
import { ScheduleCard } from '../../components/ScheduleCard/ScheduleCard.jsx';
import { Results } from '../../components/Results/Results.jsx';
import { CommissionCard } from '../../components/CommissionCard/CommissionCard.jsx';
import { DownloadableMaterialsCard } from '../../components/DownloadableMaterialsCard/DownloadableMaterialsCard.jsx';
const DefenseStepPage = ({ pageTitle, schedule, commission, infoText, initialResults, resultsType, attemptNumber, previousAttempts }) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(!!initialResults);
  const [file, setFile] = useState(null);
  const [pageResults, setPageResults] = useState(initialResults);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const hasAttemptTracking = attemptNumber != null && resultsType !== 'defense';

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      setIsSubmitted(true);
      if (resultsType === 'defense') {
          setPageResults({
              finalGrade: 'A',
              commissionGrade: 95,
              commentsKey: 'student.excellentWork'
          });
      } else {
          setPageResults({
              finalScore: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
              readiness: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
              commentsKey: 'student.fileUploaded'
          });
      }
    }
  };
  
  const handleFileDelete = () => {
      setFile(null);
      setIsSubmitted(false);
      setPageResults(null);
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
      <div className="defense-step-grid">
        <div className="defense-step-left">
          <SubmissionCard
            isSubmitted={isSubmitted}
            file={file}
            infoText={infoText}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            handleFileDelete={handleFileDelete}
          />
          {isSubmitted && <Results results={pageResults} resultsType={resultsType} />}
        </div>
        <div className="defense-step-right">
          <ScheduleCard title={`${t('nav.schedule')} ${pageTitle}`} schedule={schedule} />
          <CommissionCard commission={commission} />
        </div>
      </div>

      {hasAttemptTracking && previousAttempts && previousAttempts.length > 0 && (
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
                      {attempt.score >= 70 ? t('student.passed') : t('student.notPassed')}
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