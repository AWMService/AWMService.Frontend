import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import logoutIcon from '../../assets/icons/logout-icon.svg';
import arrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import bellIcon from '../../assets/icons/bell-icon.svg';
import globeIcon from '../../assets/icons/globe-icon.svg';

const pageNames = {
  "/": "Научные руководители",
  "/time-periods": "Временные периоды",
  "/directions": "Направления ДП/ДР",
  "/topics": "Темы ДП/ДР",
  "/settings": "Настройки",
};

export function Header() {
  const [pathname, setPathname] = useState("/");
  const currentPageName = pageNames[pathname] || "Панель управления";
  const notificationCount = 3;

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const notificationsRef = useRef(null);
  const languageRef = useRef(null);


  const handleClickOutside = (event) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
      setNotificationsOpen(false);
    }
    if (languageRef.current && !languageRef.current.contains(event.target)) {
      setLanguageOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-brand">
              <div className="logo-icon-wrapper">
                <span className="logo-text">К</span>
              </div>
              <div className="logo-title-wrapper">
                <h1 className="logo-title">Кафедра</h1>
                <p className="logo-subtitle">Панель управления</p>
              </div>
            </div>
            <div className="page-indicator">
              <div className="indicator-line"></div>
              <span className="page-name">{currentPageName}</span>
            </div>
          </div>

          <div className="header-right">
            <div className="header-actions">
              <div className="dropdown" ref={notificationsRef}>
                <button
                  className="header-button relative"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <img src={bellIcon} alt="Notifications" className="icon" />
                  {notificationCount > 0 && (
                    <span className="badge notification-badge">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="dropdown-content notifications-dropdown">
                    <div className="dropdown-header">
                      <span>Уведомления</span>
                      <span className="badge secondary-badge">{notificationCount}</span>
                    </div>
                    <div className="dropdown-separator"></div>
                    <div className="dropdown-item notification-item">
                      <div>Новое направление на рассмотрении</div>
                      <div className="text-xs">Иванов А.П. подал направление по ИИ</div>
                      <div className="text-xs text-gray">2 минуты назад</div>
                    </div>
                    <div className="dropdown-item notification-item">
                      <div>Период завершается</div>
                      <div className="text-xs">Назначение НР завершается через 3 дня</div>
                      <div className="text-xs text-gray">1 час назад</div>
                    </div>
                    <div className="dropdown-item notification-item">
                      <div>Требуется утверждение</div>
                      <div className="text-xs">5 направлений ожидают решения</div>
                      <div className="text-xs text-gray">3 часа назад</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="dropdown" ref={languageRef}>
                <button
                  className="header-button language-button"
                  onClick={() => setLanguageOpen(!languageOpen)}
                >
                  <img src={globeIcon} alt="Language" className="icon" />
                  <span>RU</span>
                  <img src={arrowDownIcon} alt="arrow down" className="arrow-icon" />
                </button>
                {languageOpen && (
                  <div className="dropdown-content language-dropdown">
                    <div className="dropdown-item">
                      <span>🇷🇺</span>
                      <span>Русский</span>
                    </div>
                    <div className="dropdown-item">
                      <span>🇰🇿</span>
                      <span>Қазақша</span>
                    </div>
                    <div className="dropdown-item">
                      <span>🇺🇸</span>
                      <span>English</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="user-info">
              <div className="user-avatar">
                <span>ИИ</span>
              </div>
              <div className="user-details">
                <div className="user-name">Иванов И.И.</div>
                <div className="user-role">Зав. Кафедры</div>
              </div>
              <button className="header-button logout-button">
                <img src={logoutIcon} alt="Logout" className="icon" />
                <span className="logout-text">Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile-page-title">
        <span>{currentPageName}</span>
      </div>
    </header>
  );
}
