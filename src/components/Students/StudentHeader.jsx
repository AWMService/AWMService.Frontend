import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentHeader.css';
import logoutIcon from '../../assets/icons/logout-icon.svg';

export function StudentHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="student-header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo-brand">
            <div className="logo-icon-wrapper">
              <span className="logo-text">С</span>
            </div>
            <div className="logo-title-wrapper">
              <h1 className="logo-title">Студент</h1>
              <p className="logo-subtitle">Дипломная работа</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              <span>СН</span>
            </div>
            <div className="user-details">
              <div className="user-name">Сергеев Н.С.</div>
              <div className="user-role">Студент</div>
            </div>
            <button className="header-button logout-button" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout" className="icon" />
              <span className="logout-text">Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
