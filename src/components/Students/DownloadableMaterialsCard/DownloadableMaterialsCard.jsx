import React from 'react';
import './DownloadableMaterialsCard.css';
import fileIcon from '../../../assets/icons/pre-defense/file-icon.svg';

export const DownloadableMaterialsCard = ({ files }) => {
    return (
        <div className="card-compact">
            <h3 className="card-title-compact">Материалы для скачивания</h3>
            <div className="files-list-compact">
                {files.map((file, index) => (
                    <div className="file-row-compact" key={index}>
                        <div className="file-info-row">
                            <img src={fileIcon} alt="doc" />
                            <div className="file-texts">
                                <span className="fname">{file.name}</span>
                                <span className="fsize">{file.size}</span>
                            </div>
                        </div>
                        <button className="link-btn">Скачать</button>
                    </div>
                ))}
            </div>
            <button className="btn-full-gray">Скачать всё архивом</button>
        </div>
    );
};