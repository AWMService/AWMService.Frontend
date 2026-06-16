import React from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale } from '../../i18n';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../api';
import './NotificationsPage.css';
function formatDate(dateString, locale) {
    const date = new Date(dateString);
    return date.toLocaleString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
export default function NotificationsPage({ translationPrefix = 'department' }) {
    const { t, i18n } = useTranslation();
    const locale = getIntlLocale(i18n.language);
    const { data, isLoading } = useNotifications();
    const notifications = data?.items ?? [];
    const unreadCount = data?.unreadCount ?? 0;
    const markAsReadMutation = useMarkAsRead();
    const markAllAsReadMutation = useMarkAllAsRead();
    const handleMarkAsRead = (id) => {
        markAsReadMutation.mutate(id);
    };
    const handleMarkAllRead = () => {
        markAllAsReadMutation.mutate();
    };
    if (isLoading) {
        return (
            <div className="notifications-page">
                <p>{t('common.loading')}</p>
            </div>
        );
    }
    return (
        <div className="notifications-page">
            { }
            <div className="notifications-header">
                <h1>{t(`${translationPrefix}.notificationsTitle`, 'Уведомления')}</h1>
                {unreadCount > 0 && (
                    <span className="unread-badge">
                        {t(`${translationPrefix}.unreadCount`, { count: unreadCount, defaultValue: '{{count}} новых' })}
                    </span>
                )}
            </div>

            { }
            <div className="notifications-filter-bar">
                <div className="filter-pills">
                    <span className="filter-pill active">
                        {t(`${translationPrefix}.filterAll`, 'Все')}
                    </span>
                </div>
                <button
                    className="mark-all-read-btn"
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
                >
                    {t(`${translationPrefix}.markAllRead`, 'Отметить все как прочитанные')}
                </button>
            </div>

            { }
            <div className="notifications-list">
                {notifications.length === 0 && (
                    <div className="notifications-empty">
                        {t(`${translationPrefix}.noNotifications`, 'Нет уведомлений')}
                    </div>
                )}
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                    >
                        <div className="notification-content">
                            <div className="notification-top-row">
                                <span className="notification-title">
                                    {notification.title}
                                </span>
                                {!notification.isRead && (
                                    <span className="unread-dot" />
                                )}
                            </div>
                            <div className="notification-message">
                                {notification.body}
                            </div>
                            <div className="notification-footer">
                                <span className="notification-date">
                                    {formatDate(notification.createdAt, locale)}
                                </span>
                                {!notification.isRead && (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        disabled={markAsReadMutation.isPending}
                                    >
                                        {t(`${translationPrefix}.markAsRead`, 'Отметить как прочитанное')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}