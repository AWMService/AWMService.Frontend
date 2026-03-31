import React from 'react';
import { useTranslation } from 'react-i18next';
import './UploadReviewCard.css';
import uploadIcon from '../../assets/icons/pre-defense/upload-icon.svg';
import fileIcon from '../../assets/icons/pre-defense/file-icon.svg';

export const UploadReviewCard = ({ onFileChange, onSubmit, reviewFile }) => {
    const { t } = useTranslation();
    return (
        <div className="card-compact">
            <h3 className="card-title-compact">{t('student.uploadReview')}</h3>

            <div
                className="upload-area-compact"
                onClick={() => document.getElementById('review-upload').click()}
            >
                <input
                    type="file"
                    id="review-upload"
                    onChange={onFileChange}
                    style={{ display: 'none' }}
                />

                {reviewFile ? (
                    <div className="file-selected-view">
                        <img src={fileIcon} alt="file" />
                        <span className="selected-name">{reviewFile.name}</span>
                        <span className="change-link">{t('common.change')}</span>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <img src={uploadIcon} alt="upload" />
                        <span>{t('common.selectFileOrDrag')}</span>
                    </div>
                )}
            </div>

            <button
                className="btn-primary-compact"
                onClick={onSubmit}
                disabled={!reviewFile}
            >
                {t('common.send')}
            </button>
        </div>
    );
};