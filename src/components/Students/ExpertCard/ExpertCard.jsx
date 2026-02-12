import React from 'react';
import './ExpertCard.css';

export const ExpertCard = ({ expert }) => {
    return (
        <div className="card">
            <h4>Назначенный эксперт</h4>
            <div className="expert-info">
                <div className="expert-avatar-placeholder">
                    {expert.name.charAt(0)}
                </div>
                <div className="expert-details">
                    <p className="expert-name">{expert.name}</p>
                    <p className="expert-meta">{expert.position}</p>
                    <p className="expert-meta">{expert.degree}</p>
                </div>
            </div>
        </div>
    );
};