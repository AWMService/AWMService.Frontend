import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@awm/shared';
import './StudentHeader.css';

// Импорт иконок
import logoutIcon from '../assets/icons/logout-icon.svg';
import arrowDownIcon from '../assets/icons/arrow-down-icon.svg';

// Вспомогательный компонент для иконок
const Icon = ({ src, alt, size = 16, className = "" }) => (
    <img
        src={src}
        alt={alt || ""}
        className={className}
        style={{
          width: size,
          height: size,
          display: 'block',
          filter: 'brightness(0) invert(1)',
        }}
    />
);

export function StudentHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Состояния для меню
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Refs для отслеживания кликов вне элементов
  const userRef = useRef(null);

  // Обработчик клика вне меню
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
      <header className="student-header">
        <div className="header-content">

          {/* ЛЕВАЯ ЧАСТЬ */}
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-box">{t('roles.student').charAt(0)}</div>
              <div>
                <div className="logo-main">{t('roles.student')}</div>
                <div className="logo-sub">{t('student.thesisTitle')}</div>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div className="header-right">

            {/* --- ЯЗЫКОВОЕ МЕНЮ --- */}
            <LanguageSelector />

            {/* --- ПРОФИЛЬ СТУДЕНТА --- */}
            <div className="nav-item-dropdown" ref={userRef}>
              <div
                  className="user-profile"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="avatar-circle">СН</div>

                <div className="user-info-box">
                  <div className="u-name">Сергеев Н.С.</div>
                  <div className="u-role">{t('roles.student')}</div>
                </div>

                <Icon
                    src={arrowDownIcon}
                    size={10}
                    className={userMenuOpen ? 'rotate' : ''}
                />
              </div>

              {/* DROPDOWN ПРОФИЛЯ */}
              {userMenuOpen && (
                  <div className="dropdown-menu align-right">
                    <div className="dropdown-item logout" onClick={handleLogout}>
                      <img
                          src={logoutIcon}
                          alt=""
                          style={{ width: 14, height: 14, marginRight: 8 }}
                      />
                      {t('auth.logout')}
                    </div>
                  </div>
              )}
            </div>

          </div>
        </div>
      </header>
  );
}
