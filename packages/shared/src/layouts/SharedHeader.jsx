import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './SharedHeader.css';
import { getInitials } from '../utils/user';
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
    appLogoBox,
    appLogoBoxColor,
    appTitle,
    appSubtitle,
    pageTitle,
    userProfile,
    userDropdownItems,
    appLogoBox,
    appLogoBoxColor,
    appTitle,
    appSubtitle,
    pageTitle,
    userProfile,
    userDropdownItems,
    onLogout,
    notificationCount = 0,
    actions           
    actions
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
                { }
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

                { }
                <div className="shared-header-right">
                    {actions}

                    { }
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
                            <div className="dropdown-menu align-right" style={{ width: '320px', padding: '0' }}>
                                <div className="dropdown-header" style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', color: '#1e293b' }}>
                                    {t('common.notifications', 'Уведомления')}
                                </div>
                                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                                    {notificationCount > 0 ? (
                                        <>
                                            <div className="dropdown-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', gap: '4px', borderBottom: '1px solid #f8fafc' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>Система готова к работе</span>
                                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Синхронизация с БД университета завершена</span>
                                            </div>
                                            <div className="dropdown-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', gap: '4px', borderBottom: '1px solid #f8fafc' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>Импорт данных завершен</span>
                                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Загружено 40 записей студентов</span>
                                            </div>
                                            <div className="dropdown-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', gap: '4px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>Права доступа обновлены</span>
                                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Настройки ролей применены</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                                            {t('common.noData', 'Нет уведомлений')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    { }
                    <div className="nav-item-dropdown" ref={userRef}>
                        <div
                            className="user-profile"
                            onClick={() => {
                                setUserMenuOpen(v => !v);
                                setNotificationsOpen(false);
                            }}
                        >
                            <div className="avatar-circle">
                                {userProfile?.initials || (userProfile?.name ? getInitials(userProfile.name) : 'ИИ')}
                            </div>
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