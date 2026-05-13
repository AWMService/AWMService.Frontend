import React from 'react';
import { useTranslation } from 'react-i18next';
import './UploadModal.css';
import uploadIcon from '../../assets/icons/pre-defense/upload-icon.svg';

export const UploadModal = ({ isOpen, onClose, onFileChange, onUpload, file }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>{t('student.uploadDocument')}</h4>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className={`file-drop-zone ${file ? 'active' : ''}`}>
                        <input
                            type="file"
                            onChange={onFileChange}
                            id="file-upload-modal"
                            className="file-input"
                        />
                        <label htmlFor="file-upload-modal" className="drop-zone-label">
                            {file ? (
                                <div className="file-selected">
                                    <div className="icon-wrapper check">✓</div>
                                    <div className="file-info">
                                        <p className="file-name-large">{file.name}</p>
                                        <p className="file-size">{t('student.readyToSend')}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="icon-wrapper">
                                        <img src={uploadIcon} alt="upload" />
                                    </div>
                                    <p className="primary-text">{t('student.clickToUploadOrDrag')}</p>
                                    <p className="secondary-text">{t('student.orDragHere')}</p>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
                    <button className="btn-primary" onClick={onUpload} disabled={!file}>
                        {t('common.upload')}
                    </button>
                </div>
            </div>
        </div>
    );
};