import React from 'react';
import './UploadReviewCard.css';
import uploadIcon from '../../../assets/icons/pre-defense/upload-icon.svg';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';

export const UploadReviewCard = ({ onFileChange, onSubmit, reviewFile }) => {
    return (
        <div className="critique-card upload-review-card">
            <h2 className="critique-card-title">Загрузите отзыв рецензента</h2>
             <div className="upload-area" onClick={() => document.getElementById('file-upload-review').click()}>
                <img src={uploadIcon} alt="Upload"/>
                <p>Перетащите файлы сюда или нажмите для выбора</p>
                <input type="file" id="file-upload-review" onChange={onFileChange} style={{ display: 'none' }} />
            </div>
            {reviewFile && (
                <div className="file-display uploaded-review">
                    <img src={fileIcon} alt="File"/>
                    <span>{reviewFile.name}</span>
                </div>
            )}
            <button className="submit-button" onClick={onSubmit} disabled={!reviewFile}>
                Отправить
            </button>
        </div>
    );
};
