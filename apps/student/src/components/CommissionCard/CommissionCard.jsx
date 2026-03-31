import React from 'react';
import { useTranslation } from 'react-i18next';
import './CommissionCard.css';

export const CommissionCard = ({ commission }) => {
    const { t } = useTranslation();
    return (
        <div className="card side-card">
            <div className="card-header small-header">
                <h4 className="card-heading">
                    {t('student.commissionMembers')}
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