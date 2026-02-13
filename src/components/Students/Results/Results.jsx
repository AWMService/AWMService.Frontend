import React from 'react';
import './Results.css';

export const Results = ({ results, resultsType }) => {
    if (!results) return null;

    return (
        <div className="card results-container">
            <div className="card-header">
                <h4 className="card-heading">Результаты</h4>
            </div>

            <div className="card-body">
                <div className="scores-grid">
                    <div className="score-item">
                        <span className="score-label">Итоговая оценка</span>
                        <div className="score-circle primary-score">
                            {resultsType === 'defense' ? results.finalGrade : results.finalScore}
                        </div>
                    </div>
                    <div className="score-item">
                        <span className="score-label">
                            {resultsType === 'defense' ? 'Комиссия' : 'Готовность'}
                        </span>
                        <div className="score-circle secondary-score">
                            {resultsType === 'defense' ? results.commissionGrade : `${results.readiness}%`}
                        </div>
                    </div>
                </div>

                <div className="comments-section">
                    <span className="comments-label">Комментарии:</span>
                    <div className="comments-text">
                        {results.comments}
                    </div>
                </div>
            </div>
        </div>
    );
};