import React from 'react';
import { useTranslation } from 'react-i18next';
import './CommentsCard.css';

export const CommentsCard = ({ comments, status }) => {
    const { t } = useTranslation();
    const hasComments = status === 'failed' && comments;

    return (
        <div className="card">
            <h4>{t('student.expertComments')}</h4>
            <div className={`comments-box ${hasComments ? 'has-content' : 'empty'}`}>
                {hasComments ? comments : t('student.noComments')}
            </div>
        </div>
    );
};