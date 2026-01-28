import React from 'react';
import './Results.css';
import commentsIcon from '../../../assets/icons/pre-defense/comments-icon.svg';

export const Results = ({ results, resultsType }) => {
    if (!results) return null;

    if (resultsType === 'defense') {
        return (
            <>
                <div className="results-grid defense-results">
                    <div className="result-card">
                        <h4>Итоговая оценка</h4>
                        <div className="score-circle final-grade">{results.finalGrade}</div>
                    </div>
                    <div className="result-card">
                        <h4>Оценка комиссии</h4>
                        <div className="score-circle">{results.commissionGrade}</div>
                    </div>
                </div>
                <div className="comments-card">
                    <h4><img src={commentsIcon} alt="" className="icon" />Комментарии</h4>
                    <div className="comments-box">
                        {results.comments}
                    </div>
                </div>
            </>
        );
    }

    // Default results view for pre-defense
    return (
        <>
            <div className="results-grid">
                <div className="result-card">
                    <h4>Итоговая оценка</h4>
                    <div className="score-circle">{results.finalScore}</div>
                </div>
                <div className="result-card">
                    <h4>% Готовности ДП</h4>
                    <div className="score-circle">{results.readiness}%</div>
                </div>
            </div>
            <div className="comments-card">
                <h4><img src={commentsIcon} alt="" className="icon" />Комментарии/Замечания</h4>
                <div className="comments-box">
                    {results.comments}
                </div>
            </div>
        </>
    );
};
