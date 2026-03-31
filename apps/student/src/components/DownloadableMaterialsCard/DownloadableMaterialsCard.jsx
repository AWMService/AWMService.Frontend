import React from 'react';
import { useTranslation } from 'react-i18next';
import './DownloadableMaterialsCard.css';
import fileIcon from '../../assets/icons/pre-defense/file-icon.svg';

export const DownloadableMaterialsCard = ({ files }) => {
    const { t } = useTranslation();
    return (
        <div className="card-compact">
            <h3 className="card-title-compact">{t('student.materialsToDownload')}</h3>
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
                        <button className="link-btn">{t('common.download')}</button>
                    </div>
                ))}
            </div>
            <button className="btn-full-gray">{t('common.downloadAll')}</button>
        </div>
    );
};