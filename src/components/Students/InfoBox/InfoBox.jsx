import React from 'react';
import './InfoBox.css';

export const InfoBox = ({ icon, children, type = 'neutral' }) => {
    return (
        <div className={`info-box ${type}`}>
            {icon && <img src={icon} alt="" className="info-icon" />}
            <div className="info-content">
                {children}
            </div>
        </div>
    );
};