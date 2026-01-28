import React from 'react';
import './DownloadableMaterialsCard.css';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';

export const DownloadableMaterialsCard = ({ files }) => {
    return (
        <div className="critique-card downloadable-materials-card">
            <h2 className="critique-card-title">Скачиваемые материалы</h2>
            {files.map((file, index) => (
                <div className="file-display" key={index}>
                    <img src={fileIcon} alt="File"/>
                    <span>{file.name}</span>
                </div>
            ))}
             <button className="download-all-button">Скачать все материалы</button>
        </div>
    );
};
