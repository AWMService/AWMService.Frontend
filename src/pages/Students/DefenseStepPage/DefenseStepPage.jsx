import React, { useState } from 'react';
import './DefenseStepPage.css';
import { SubmissionCard } from '../../../components/Students/SubmissionCard/SubmissionCard.jsx';
import { ScheduleCard } from '../../../components/Students/ScheduleCard/ScheduleCard.jsx';
import { Results } from '../../../components/Students/Results/Results.jsx';
import { CommissionCard } from '../../../components/Students/CommissionCard/CommissionCard.jsx';
import { DownloadableMaterialsCard } from '../../../components/Students/DownloadableMaterialsCard/DownloadableMaterialsCard.jsx';
const DefenseStepPage = ({ pageTitle, schedule, commission, infoText, initialResults, resultsType }) => {
  const [isSubmitted, setIsSubmitted] = useState(!!initialResults);
  const [file, setFile] = useState(null);
  const [pageResults, setPageResults] = useState(initialResults);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      setIsSubmitted(true);
      // Mock results based on page type
      if (resultsType === 'defense') {
          setPageResults({
              finalGrade: 'A',
              commissionGrade: 95,
              comments: "Отличная работа и уверенная защита! Поздравляем!"
          });
      } else {
          setPageResults({
              finalScore: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
              readiness: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
              comments: "Файл успешно загружен. Ожидайте результатов проверки."
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
          <ScheduleCard title={`Расписание ${pageTitle}`} schedule={schedule} />
          <CommissionCard commission={commission} />
        </div>
      </div>
    </div>
  );
};

export default DefenseStepPage;