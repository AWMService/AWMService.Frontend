import React from 'react';
import { useTranslation } from 'react-i18next';
import './SubmissionCard.css';
import uploadIcon from '../../assets/icons/pre-defense/upload-icon.svg';
import fileIcon from '../../assets/icons/pre-defense/file-icon.svg';
import deleteIcon from '../../assets/icons/pre-defense/delete-icon.svg';

export const SubmissionCard = ({ isSubmitted, file, infoText, handleFileChange, handleSubmit, handleFileDelete, isUploading, uploadError, title }) => {
    const { t } = useTranslation();
    return (
        <div className="card submission-card">
            <div className="card-header">
                <h4 className="card-heading">{title ?? t('student.defenseMaterials')}</h4>
            </div>

            <div className="card-body">
                {!isSubmitted ? (
                    <>
                        <div className="info-alert">
                            <p className="info-text">{infoText}</p>
                        </div>

                        {!file ? (
                            <label className="dropzone">
                                <input type="file" onChange={handleFileChange} className="hidden-input"/>
                                <div className="dropzone-content">
                                    <div className="icon-circle">
                                        <img src={uploadIcon} alt="Upload" />
                                    </div>
                                    <p className="dropzone-title">{t('student.uploadOrDrag')}</p>
                                    <p className="dropzone-hint">{t('student.fileFormatHint')}</p>
                                </div>
                            </label>
                        ) : (
                            <div className="file-preview-row">
                                <div className="file-icon-wrapper">
                                    <img src={fileIcon} alt="File" />
                                </div>
                                <div className="file-info">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <button onClick={handleFileDelete} className="btn-icon-danger">
                                    <img src={deleteIcon} alt="Delete" />
                                </button>
                            </div>
                        )}

                        {uploadError && <div className="upload-error">{uploadError}</div>}
                        <div className="card-actions">
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={!file || isUploading}
                            >
                                {isUploading ? t('common.loading') : t('student.sendForReview')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="submitted-view">
                        <div className="file-preview-row success-border">
                            <div className="file-icon-wrapper">
                                <img src={fileIcon} alt="File" />
                            </div>
                            <div className="file-info">
                                <span className="file-name">{file ? file.name : 'Diplom_Ivanov.docx'}</span>
                                <span className="file-tag">{t('common.uploaded')}</span>
                            </div>
                            <button onClick={handleFileDelete} className="btn-text-danger">
                                {t('common.change')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};