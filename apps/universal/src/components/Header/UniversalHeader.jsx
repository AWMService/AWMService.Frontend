import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector, RoleSelector, useAuth, useRole } from '@awm/shared';
import './Header.css';
import bellIcon from '../../assets/icons/bell-icon.svg';
import arrowDownIcon from '../../assets/icons/arrow-down-icon.svg';

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

export function UniversalHeader() {
    const location = useLocation();
    const { t } = useTranslation();
    const { roleMeta } = useRole();
    const { logout } = useAuth();

    // Динамическое название страницы на основе пути
    const getPageName = () => {
        const path = location.pathname;
        if (path.includes('/my-topics')) return t('nav.myTopics');
        if (path.includes('/directions')) return t('nav.directions');
        if (path.includes('/mystudents')) return t('nav.myStudents');
        if (path.includes('/reviews')) return t('reviewer.assignedWorks');
        if (path.includes('/documents')) return t('normocontrol.documentsCheck');
        if (path.includes('/schedule')) return t('commission.schedule');
        if (path.includes('/commission')) return t('commission.commissions');
        if (path.includes('/checks')) return t('nav.checks');
        return t('nav.dashboard');
    };

    const notificationCount = 2;

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const notificationsRef = useRef(null);
    const userRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
                setNotificationsOpen(false);
            }
            if (userRef.current && !userRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="header">
            <div className="header-content">

                {/* ЛЕВАЯ ЧАСТЬ */}
                <div className="header-left">
                    <div className="logo-section">
                        <div 
                            className="logo-box"
                            style={{ background: roleMeta?.color || '#6366f1' }}
                        >
                            {t(roleMeta?.labelKey || 'roles.supervisor').charAt(0)}
                        </div>
                        <div>
                            <div className="logo-main">{t(roleMeta?.labelKey || 'roles.supervisor')}</div>
                            <div className="logo-sub">{t('nav.dashboard')}</div>
                        </div>
                    </div>

                    <div className="page-divider"></div>
                    <div className="page-tittle">{getPageName()}</div>
                </div>

                {/* ПРАВАЯ ЧАСТЬ */}
                <div className="header-right">

                    {/* Переключатель ролей */}
                    <RoleSelector />

                    {/* 🔔 Уведомления */}
                    <div className="nav-item-dropdown" ref={notificationsRef}>
                        <button
                            className="icon-btn"
                            onClick={() => {
                                setNotificationsOpen(v => !v);
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
                                <div className="dropdown-header">{t('common.noData')}</div>
                                <div className="dropdown-item">
                                    {notificationCount}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 🌐 Язык */}
                    <LanguageSelector />

                    {/* 👤 Пользователь */}
                    <div className="nav-item-dropdown" ref={userRef}>
                        <div
                            className="user-profile"
                            onClick={() => {
                                setUserMenuOpen(v => !v);
                                setNotificationsOpen(false);
                            }}
                        >
                            <div className="avatar-circle">РР</div>
                            <div>
                                <div className="u-name">Рахимов Р.Р.</div>
                                <div className="u-role">{t(roleMeta?.labelKey || 'roles.supervisor')}</div>
                            </div>
                            <Icon
                                src={arrowDownIcon}
                                size={10}
                                className={userMenuOpen ? 'rotate' : ''}
                            />
                        </div>

                        {userMenuOpen && (
                            <div className="dropdown-menu align-right">
                                <div className="dropdown-item">{t('auth.profile')}</div>
                                <div className="dropdown-item logout" onClick={handleLogout}>
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
