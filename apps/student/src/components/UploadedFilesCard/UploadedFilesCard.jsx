import React from 'react';
import { useTranslation } from 'react-i18next';
import './UploadedFilesCard.css';
import fileIcon from '../../assets/icons/pre-defense/file-icon.svg';
import deleteIcon from '../../assets/icons/pre-defense/delete-icon.svg';

export const UploadedFilesCard = ({ uploadedFiles, onUploadClick, onDeleteFile, status }) => {
    const { t } = useTranslation();
    return (
        <div className="card files-card">
            <div className="card-header-row">
                <h4>{t('student.uploadedFiles')}</h4>
                {status !== 'success' && (
                    <button className="btn-link" onClick={onUploadClick}>
                        {t('student.uploadVersion')}
                    </button>
                )}
            </div>

            <div className="file-list">
                {uploadedFiles.length === 0 ? (
                    <p className="empty-state">{t('common.filesNotUploaded')}</p>
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
                                    title={t('common.delete')}
                                    onClick={() => onDeleteFile(i)}
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