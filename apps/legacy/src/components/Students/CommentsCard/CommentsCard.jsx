import React from 'react';
import './CommentsCard.css';

export const CommentsCard = ({ comments, status }) => {
    const hasComments = status === 'failed' && comments;

    return (
        <div className="card">
            <h4>Комментарии эксперта</h4>
            <div className={`comments-box ${hasComments ? 'has-content' : 'empty'}`}>
                {hasComments ? comments : 'На данный момент комментариев нет.'}
            </div>
        </div>
    );
};