import React from 'react';
import './ExpertCard.css';

export const ExpertCard = ({ expert }) => {
    return (
        <div className="card">
            <h4>Эксперт</h4>
            <p><strong>{expert.name}</strong></p>
            <p>{expert.position}, {expert.degree}</p>
        </div>
    );
};
