import React from 'react';
import './CommissionCard.css';

export const CommissionCard = ({ commission }) => {
    return (
        <div className="card side-card">
            <div className="card-header small-header">
                <h4 className="card-heading">
                    Состав комиссии
                </h4>
            </div>
            <div className="card-body compact-body">
                <div className="commission-list">
                    {commission.map((member, index) => (
                        <div key={index} className="member-item">
                            <div className="member-name">{member.name}</div>
                            <div className="member-role">{member.role}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};