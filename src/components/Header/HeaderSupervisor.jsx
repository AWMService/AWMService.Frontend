import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import bellIcon from '../../assets/icons/bell-icon.svg';
import globeIcon from '../../assets/icons/globe-icon.svg';
import arrowDownIcon from '../../assets/icons/arrow-down-icon.svg';

const pageNames = {
    "/super/my-topics": "Мои темы",
    "/super/students": "Мои студенты",
    "/super/reports": "Отчёты",
    "/super/settings": "Настройки",
};

const Icon = ({ src, size = 16, className = "" }) => (
    <img
        src={src}
        className={className}
        style={{
            width: size,
            height: size,
            filter: 'brightness(0) invert(1)',
        }}
        alt=""
    />
);

export function HeaderSupervisor() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPageName =
        pageNames[location.pathname] || "Панель руководителя";

    const notificationCount = 2;

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const notificationsRef = useRef(null);
    const languageRef = useRef(null);
    const userRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
                setNotificationsOpen(false);
            }
            if (languageRef.current && !languageRef.current.contains(e.target)) {
                setLanguageOpen(false);
            }
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
        <header className="header">
            <div className="header-content">

                {/* ЛЕВАЯ ЧАСТЬ */}
                <div className="header-left">
                    <div className="logo-section">
                        <div className="logo-box">Р</div>
                        <div>
                            <div className="logo-main">Руководитель</div>
                            <div className="logo-sub">Панель управления</div>
                        </div>
                    </div>

                    <div className="page-divider"></div>
                    <div className="page-tittle">{currentPageName}</div>
                </div>

                {/* ПРАВАЯ ЧАСТЬ */}
                <div className="header-right">

                    {/* 🔔 Уведомления */}
                    <div className="nav-item-dropdown" ref={notificationsRef}>
                        <button
                            className="icon-btn"
                            onClick={() => {
                                setNotificationsOpen(v => !v);
                                setLanguageOpen(false);
                                setUserMenuOpen(false);
                            }}
                        >
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

                    {/* 🌐 Язык */}
                    <div className="nav-item-dropdown" ref={languageRef}>
                        <button
                            className="lang-selector"
                            onClick={() => {
                                setLanguageOpen(v => !v);
                                setNotificationsOpen(false);
                                setUserMenuOpen(false);
                            }}
                        >
                            <Icon src={globeIcon} size={20} />
                            <span>RU</span>
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

                    {/* 👤 Пользователь */}
                    <div className="nav-item-dropdown" ref={userRef}>
                        <div
                            className="user-profile"
                            onClick={() => {
                                setUserMenuOpen(v => !v);
                                setNotificationsOpen(false);
                                setLanguageOpen(false);
                            }}
                        >
                            <div className="avatar-circle">РР</div>
                            <div>
                                <div className="u-name">Рахимов Р.Р.</div>
                                <div className="u-role">Руководитель</div>
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
