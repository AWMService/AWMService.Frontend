import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector, useAuth } from '@awm/shared';
import './Header.css';

import arrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import bellIcon from '../../assets/icons/bell-icon.svg';

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

export function AdminHeader() {
  const location = useLocation();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notificationsRef = useRef(null);
  const userRef = useRef(null);

  // Переводимые названия страниц
  const getPageName = () => {
    const path = location.pathname;
    if (path.includes('/users')) return t('admin.users');
    if (path.includes('/roles')) return t('nav.roles');
    if (path.includes('/departments')) return t('nav.departments');
    if (path.includes('/monitoring')) return t('admin.monitoring');
    if (path.includes('/settings')) return t('admin.systemSettings');
    return t('nav.dashboard');
  };

  const notificationCount = 5;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target))
        setNotificationsOpen(false);
      if (userRef.current && !userRef.current.contains(event.target))
        setUserMenuOpen(false);
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
              <div className="logo-box">{t('roles.admin').charAt(0)}</div>
              <div className="logo-text-group">
                <div className="logo-main">{t('roles.admin')}</div>
                <div className="logo-sub">{t('nav.dashboard')}</div>
              </div>
            </div>

            <div className="page-divider"></div>
            <div className="page-tittle">{getPageName()}</div>
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
                    <div className="dropdown-header">{t('common.noData')}</div>
                    <div className="dropdown-item">
                      {notificationCount}
                    </div>
                  </div>
              )}
            </div>

            {/* Язык */}
            <LanguageSelector />

            {/* Профиль */}
            <div className="nav-item-dropdown" ref={userRef}>
              <div className="user-profile" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="avatar-circle">АД</div>
                <div className="user-info-box">
                  <div className="u-name">{t('roles.admin')}</div>
                  <div className="u-role">{t('roles.admin')}</div>
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
