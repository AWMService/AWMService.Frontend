import React from 'react';
import { useTranslation } from 'react-i18next';
import './Results.css';

export const Results = ({ results, resultsType }) => {
    const { t } = useTranslation();
    if (!results) return null;

    const commentsText = results.commentsKey ? t(results.commentsKey) : results.comments;

    return (
        <div className="card results-container">
            <div className="card-header">
                <h4 className="card-heading">{t('student.results')}</h4>
            </div>

            <div className="card-body">
                <div className="scores-grid">
                    <div className="score-item">
                        <span className="score-label">{t('student.finalGrade')}</span>
                        <div className="score-circle primary-score">
                            {resultsType === 'defense' ? results.finalGrade : results.finalScore}
                        </div>
                    </div>
                    <div className="score-item">
                        <span className="score-label">
                            {resultsType === 'defense' ? t('student.commissionLabel') : t('student.readinessLabel')}
                        </span>
                        <div className="score-circle secondary-score">
                            {resultsType === 'defense' ? results.commissionGrade : `${results.readiness}%`}
                        </div>
                    </div>
                </div>

                <div className="comments-section">
                    <span className="comments-label">{t('student.commentsLabel')}</span>
                    <div className="comments-text">
                        {commentsText}
                    </div>
                </div>
            </div>
        </div>
    );
};