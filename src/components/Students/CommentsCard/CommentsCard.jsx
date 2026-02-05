import React from 'react';
import './CommentsCard.css';

export const CommentsCard = ({ comments, status }) => {
    return (
        <div className="card">
            <h4>Комментарии</h4>
            <div className="comments-box">
                {status === 'failed' ? comments : 'Комментариев нет.'}
            </div>
        </div>
    );
};
