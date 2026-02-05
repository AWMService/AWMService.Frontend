import React from 'react';
import './SubmissionCard.css';
import uploadIcon from '../../../assets/icons/pre-defense/upload-icon.svg';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';
import deleteIcon from '../../../assets/icons/pre-defense/delete-icon.svg';
import infoIcon from '../../../assets/icons/pre-defense/info-icon.svg';

export const SubmissionCard = ({ isSubmitted, file, infoText, handleFileChange, handleSubmit, handleFileDelete }) => {
    return (
        <>
            {isSubmitted ? (
                <div className="submission-status-card">
                    <h4><img src={uploadIcon} alt="" className="icon" /> Загруженные материалы</h4>
                    <div className="submitted-file-info">
                        <img src={fileIcon} alt="" className="icon" />
                        <div className="file-details">
                            <p><strong>{file ? file.name : 'Diplom_Ivanov_final.docx'}</strong></p>
                            <p className="file-size">{file ? (file.size / 1024).toFixed(2) + ' KB' : '5,123 KB'}</p>
                        </div>
                        <button onClick={handleFileDelete} className="delete-btn">
                            <img src={deleteIcon} alt="Delete" className="icon" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="upload-card">
                    <h4><img src={uploadIcon} alt="" className="icon" /> Загрузка материалов</h4>
                     <div className="info-box">
                        <img src={infoIcon} alt="" className="icon" />
                        <div>
                            <p><strong>Загрузите необходимые материалы</strong></p>
                            <p>{infoText}</p>
                        </div>
                    </div>
                    
                    {file ? (
                        <div className="file-preview">
                            <img src={fileIcon} alt="" className="icon" />
                            <div className="file-details">
                                <p><strong>{file.name}</strong></p>
                                <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <button onClick={handleFileDelete} className="delete-btn">
                                <img src={deleteIcon} alt="Delete" className="icon" />
                            </button>
                        </div>
                    ) : (
                        <div className="file-drop-zone">
                            <input type="file" onChange={handleFileChange} id="file-upload-submission" style={{display: 'none'}}/>
                            <label htmlFor="file-upload-submission">
                                <img src={uploadIcon} alt="Upload" className="upload-icon-large"/>
                                <p>Перетащите файлы сюда или нажмите для выбора</p>
                                <button type="button" className="btn-secondary" onClick={() => document.getElementById('file-upload-submission').click()}>Выбрать файл</button>
                            </label>
                        </div>
                    )}

                    <div className="upload-actions">
                        <button className="btn-primary" onClick={handleSubmit} disabled={!file}>Отправить</button>
                    </div>
                </div>
            )}
        </>
    );
};
