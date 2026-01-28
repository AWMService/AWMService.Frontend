import React from 'react';
import './InfoBox.css';

export const InfoBox = ({ icon, children, type = 'neutral' }) => {
    const typeClassName = `info-box ${type}`;

    return (
        <div className={typeClassName}>
            {icon && <img src={icon} alt="" className="icon" />}
            <div>
                {children}
            </div>
        </div>
    );
};
