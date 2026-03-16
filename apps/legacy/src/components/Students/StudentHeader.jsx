import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentHeader.css';

// Импорт иконок
import logoutIcon from '../../assets/icons/logout-icon.svg';
import arrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import globeIcon from '../../assets/icons/globe-icon.svg'; // Убедитесь, что иконка есть в папке

// Вспомогательный компонент для иконок (как в примере)
const Icon = ({ src, alt, size = 16, className = "" }) => (
    <img
        src={src}
        alt={alt || ""}
        className={className}
        style={{
          width: size,
          height: size,
          display: 'block',
          filter: 'brightness(0) invert(1)', // Делает иконку белой
        }}
    />
);

export function StudentHeader() {
  const navigate = useNavigate();

  // Состояния для меню
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  // Refs для отслеживания кликов вне элементов
  const userRef = useRef(null);
  const languageRef = useRef(null);

  // Обработчик клика вне меню
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target)) {
        setLanguageOpen(false);
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
              <div className="logo-box">С</div>
              <div>
                <div className="logo-main">Студент</div>
                <div className="logo-sub">Дипломная работа</div>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div className="header-right">

            {/* --- ЯЗЫКОВОЕ МЕНЮ (НОВОЕ) --- */}
            <div className="nav-item-dropdown" ref={languageRef}>
              <button
                  className="lang-selector"
                  onClick={() => setLanguageOpen(!languageOpen)}
              >
                <Icon src={globeIcon} size={20} />
                <span className="lang-label">RU</span>
                <Icon
                    src={arrowDownIcon}
                    size={10}
                    className={languageOpen ? 'rotate' : ''}
                />
              </button>

              {languageOpen && (
                  <div className="dropdown-menu align-right">
                    <div className="dropdown-item">Русский (RU)</div>
                    <div className="dropdown-item">English (EN)</div>
                    <div className="dropdown-item">Қазақша (KZ)</div>
                  </div>
              )}
            </div>

            {/* --- ПРОФИЛЬ СТУДЕНТА --- */}
            <div className="nav-item-dropdown" ref={userRef}>
              <div
                  className="user-profile"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="avatar-circle">СН</div>

                <div className="user-info-box">
                  <div className="u-name">Сергеев Н.С.</div>
                  <div className="u-role">Студент</div>
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
                      Выйти
                    </div>
                  </div>
              )}
            </div>

          </div>
        </div>
      </header>
  );
}