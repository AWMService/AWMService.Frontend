import React from 'react';
import './UploadModal.css';
import uploadIcon from '../../../assets/icons/pre-defense/upload-icon.svg';

export const UploadModal = ({ isOpen, onClose, onFileChange, onUpload, file }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Загрузка новой версии</h4>
                <div className="file-drop-zone">
                    <input type="file" onChange={onFileChange} id="file-upload-modal" style={{display: 'none'}}/>
                    <label htmlFor="file-upload-modal">
                        {file ? (
                            <p>Выбран файл: {file.name}</p>
                        ) : (
                            <>
                                <img src={uploadIcon} alt="Upload" className="upload-icon-large"/>
                                <p>Перетащите файлы сюда или нажмите для выбора</p>
                            </>
                        )}
                    </label>
                 </div>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>Отмена</button>
                    <button className="btn-primary" onClick={onUpload} disabled={!file}>Отправить</button>
                </div>
            </div>
        </div>
    );
};
