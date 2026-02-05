import React from 'react';
import './CommissionCard.css';
import peopleIcon from '../../../assets/icons/pre-defense/people-icon.svg';

export const CommissionCard = ({ commission }) => {
    return (
        <div className="commission-card">
            <h4><img src={peopleIcon} alt="" className="icon" />Состав Комиссии</h4>
            <div className="commission-list">
              {commission.map((member, index) => (
                <div key={index} className="commission-member">
                  <p><strong>{member.name}</strong> ({member.role})</p>
                  <p>{member.position}, {member.degree}</p>
                </div>
              ))}
            </div>
        </div>
    );
};
