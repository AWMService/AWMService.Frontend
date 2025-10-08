import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import logoutIcon from '../../assets/icons/logout-icon.svg';
import bellIcon from '../../assets/icons/bell-icon.svg';
import globeIcon from '../../assets/icons/globe-icon.svg';
import arrowDownIcon from '../../assets/icons/arrow-down-icon.svg';

const pageNames = {
    "/super/my-topics": "Мои темы",
    "/super/students": "Мои студенты",
    "/super/reports": "Отчёты",
    "/super/settings": "Настройки",
};

export function HeaderSupervisor() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPageName = pageNames[location.pathname] || "Панель руководителя";
    const notificationCount = 2;

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

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-brand">
                            <div className="logo-icon-wrapper">
                                <span className="logo-text">Р</span>
                            </div>
                            <div className="logo-title-wrapper">
                                <h1 className="logo-title">Руководитель</h1>
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
                                        <span className="badge notification-badge">{notificationCount}</span>
                                    )}
                                </button>
                                {notificationsOpen && (
                                    <div className="dropdown-content notifications-dropdown">
                                        <div className="dropdown-header">
                                            <span>Уведомления</span>
                                        </div>
                                        <div className="dropdown-item notification-item">
                                            <div>Новый студент добавлен</div>
                                            <div className="text-xs text-gray">5 минут назад</div>
                                        </div>
                                        <div className="dropdown-item notification-item">
                                            <div>Отчёт ожидает проверки</div>
                                            <div className="text-xs text-gray">1 час назад</div>
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
                                        <div className="dropdown-item">🇷🇺 Русский</div>
                                        <div className="dropdown-item">🇰🇿 Қазақша</div>
                                        <div className="dropdown-item">🇺🇸 English</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="user-info">
                            <div className="user-avatar"><span>РР</span></div>
                            <div className="user-details">
                                <div className="user-name">Рахимов Р.Р.</div>
                                <div className="user-role">Руководитель</div>
                            </div>
                            <button className="header-button logout-button" onClick={handleLogout}>
                                <img src={logoutIcon} alt="Logout" className="icon" />
                                <span className="logout-text">Выйти</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
