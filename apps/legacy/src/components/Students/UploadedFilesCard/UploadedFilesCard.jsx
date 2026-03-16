import React from 'react';
import './UploadedFilesCard.css';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';
import deleteIcon from '../../../assets/icons/pre-defense/delete-icon.svg';

// Добавляем onDeleteFile в деструктуризацию пропсов
export const UploadedFilesCard = ({ uploadedFiles, onUploadClick, onDeleteFile, status }) => {
    return (
        <div className="card files-card">
            <div className="card-header-row">
                <h4>Загруженные файлы</h4>
                {status !== 'success' && (
                    <button className="btn-link" onClick={onUploadClick}>
                        + Загрузить версию
                    </button>
                )}
            </div>

            <div className="file-list">
                {uploadedFiles.length === 0 ? (
                    <p className="empty-state">Файлы еще не загружены</p>
                ) : (
                    uploadedFiles.map((f, i) => (
                        <div key={i} className="file-item-card">
                            <div className="file-info-group">
                                <img src={fileIcon} alt="doc" className="file-icon-large" />
                                <div className="file-text-content">
                                    <span className="file-name-text">{f.name}</span>
                                    <span className="file-size-text">156 KB • {f.date}</span>
                                </div>
                            </div>

                            {status !== 'success' && (
                                <button
                                    className="delete-icon-btn"
                                    title="Удалить"
                                    onClick={() => onDeleteFile(i)} // Вызываем удаление
                                >
                                    <img src={deleteIcon} alt="delete" />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};