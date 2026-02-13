import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

import arrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import bellIcon from '../../assets/icons/bell-icon.svg';
import globeIcon from '../../assets/icons/globe-icon.svg';

const pageNames = {
  "/department/supervisors": "Научные руководители",
  "/department/time-periods": "Временные периоды",
  "/department/directions": "Направления ДП/ДР",
  "/department/topics": "Темы ДП/ДР",
  "/department/settings": "Настройки",
};

const Icon = ({ src, alt, size = 16, className = "" }) => (
    <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: size,
          height: size,
          display: 'block',
          filter: 'brightness(0) invert(1)',
        }}
    />
);

export function Header() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ ДОБАВИЛИ

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notificationsRef = useRef(null);
  const languageRef = useRef(null);
  const userRef = useRef(null);

  const currentPageName =
      pageNames[location.pathname] || "Панель управления";
  const notificationCount = 3;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target))
        setNotificationsOpen(false);
      if (languageRef.current && !languageRef.current.contains(event.target))
        setLanguageOpen(false);
      if (userRef.current && !userRef.current.contains(event.target))
        setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ ФУНКЦИЯ ЛОГАУТА
  const handleLogout = () => {
    localStorage.removeItem('token'); // если используешь JWT
    navigate('/login');               // или '/'
  };

  return (
      <header className="header">
        <div className="header-content">

          {/* ЛЕВАЯ ЧАСТЬ */}
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-box">К</div>
              <div className="logo-text-group">
                <div className="logo-main">Кафедра</div>
                <div className="logo-sub">Панель управления</div>
              </div>
            </div>

            <div className="page-divider"></div>
            <div className="page-tittle">{currentPageName}</div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <div className="header-right">

            {/* Колокольчик */}
            <div className="nav-item-dropdown" ref={notificationsRef}>
              <button className="icon-btn" onClick={() => setNotificationsOpen(!notificationsOpen)}>
                <Icon src={bellIcon} size={22} />
                {notificationCount > 0 && (
                    <span className="red-badge">{notificationCount}</span>
                )}
              </button>
              {notificationsOpen && (
                  <div className="dropdown-menu align-right">
                    <div className="dropdown-header">Уведомления</div>
                    <div className="dropdown-item">
                      Новых уведомлений: {notificationCount}
                    </div>
                  </div>
              )}
            </div>

            {/* Язык */}
            <div className="nav-item-dropdown" ref={languageRef}>
              <button className="lang-selector" onClick={() => setLanguageOpen(!languageOpen)}>
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

            {/* Профиль */}
            <div className="nav-item-dropdown" ref={userRef}>
              <div className="user-profile" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="avatar-circle">ИИ</div>
                <div className="user-info-box">
                  <div className="u-name">Иванов И.И.</div>
                  <div className="u-role">Зав. Кафедры</div>
                </div>
                <Icon
                    src={arrowDownIcon}
                    size={10}
                    className={userMenuOpen ? 'rotate' : ''}
                />
              </div>

              {userMenuOpen && (
                  <div className="dropdown-menu align-right">
                    <div className="dropdown-item">Профиль</div>
                    <div className="dropdown-item logout" onClick={handleLogout}>
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
