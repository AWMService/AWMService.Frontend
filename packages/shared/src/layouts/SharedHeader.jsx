import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './SharedHeader.css';
import arrowDownIcon from '../assets/icons/arrow-down-icon.svg';
import bellIcon from '../assets/icons/bell-icon.svg';

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

export function SharedHeader({
    appLogoBox,       // e.g. "Р"
    appLogoBoxColor,  // e.g. "#6366f1"
    appTitle,         // e.g. "Руководитель"
    appSubtitle,      // e.g. "Система"
    pageTitle,        // e.g. "Мои темы"
    userProfile,      // { initials: 'РР', name: 'Рахимов Р.Р.', role: 'Руководитель' }
    userDropdownItems,// ReactNode (e.g. <div className="dropdown-item">Профиль</div>)
    onLogout,
    notificationCount = 0,
    actions           // Custom React nodes for extra buttons (LanguageSelector, RoleSelector)
}) {
    const { t } = useTranslation();
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

    return (
        <header className="shared-header">
            <div className="shared-header-content">
                {/* ЛЕВАЯ ЧАСТЬ */}
                <div className="shared-header-left">
                    <div className="logo-section">
                        <div 
                            className="logo-box"
                            style={{ background: appLogoBoxColor || 'var(--awm-primary, #6366f1)' }}
                        >
                            {appLogoBox}
                        </div>
                        <div className="logo-text-group">
                            <div className="logo-main">{appTitle}</div>
                            <div className="logo-sub">{appSubtitle}</div>
                        </div>
                    </div>
                    {pageTitle && (
                        <>
                            <div className="page-divider"></div>
                            <div className="page-title">{pageTitle}</div>
                        </>
                    )}
                </div>

                {/* ПРАВАЯ ЧАСТЬ */}
                <div className="shared-header-right">
                    
                    {actions}

                    {/* Колокольчик */}
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
                                <div className="dropdown-header">{t('common.noData', 'Нет данных')}</div>
                                <div className="dropdown-item">
                                    {notificationCount > 0 ? notificationCount : ''}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Профиль */}
                    <div className="nav-item-dropdown" ref={userRef}>
                        <div
                            className="user-profile"
                            onClick={() => {
                                setUserMenuOpen(v => !v);
                                setNotificationsOpen(false);
                            }}
                        >
                            <div className="avatar-circle">{userProfile?.initials || 'ИИ'}</div>
                            <div className="user-info-box">
                                <div className="u-name">{userProfile?.name || 'Пользователь'}</div>
                                <div className="u-role">{userProfile?.role || ''}</div>
                            </div>
                            <Icon
                                src={arrowDownIcon}
                                size={10}
                                className={userMenuOpen ? 'rotate' : ''}
                            />
                        </div>

                        {userMenuOpen && (
                            <div className="dropdown-menu align-right">
                                {userDropdownItems}
                                <div className="dropdown-item logout" onClick={onLogout}>
                                    {t('auth.logout', 'Выйти')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
