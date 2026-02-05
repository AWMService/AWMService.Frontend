import React from 'react';
import './UploadedFilesCard.css';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';

export const UploadedFilesCard = ({ uploadedFiles, onUploadClick, status }) => {
    return (
        <div className="card">
            <h4>Загруженные файлы</h4>
            <div className="file-list">
                {uploadedFiles.map((f, i) => (
                    <div key={i} className="file-item">
                        <img src={fileIcon} alt="file" />
                        <span>{f.name} (от {f.date})</span>
                    </div>
                ))}
            </div>
            {status !== 'success' && (
                <button className="btn-primary" onClick={onUploadClick}>Загрузить новую версию</button>
            )}
        </div>
    );
};
