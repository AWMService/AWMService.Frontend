import React from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale, useNotifications, useMarkAsRead, useMarkAllAsRead } from '@awm/shared';
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

export default function NotificationsPage() {
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
            <div className="student-notifications-page">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className="student-notifications-page">
            {/* Header */}
            <div className="student-notifications-header">
                <h1>{t('student.notificationsTitle')}</h1>
                {unreadCount > 0 && (
                    <span className="student-unread-badge">
                        {t('student.unreadCount', { count: unreadCount })}
                    </span>
                )}
            </div>

            {/* Filter bar */}
            <div className="student-notifications-filter-bar">
                <div className="student-filter-pills">
                    <span className="student-filter-pill active">
                        {t('student.filterAll')}
                    </span>
                </div>
                <button
                    className="student-mark-all-read-btn"
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
                >
                    {t('student.markAllRead')}
                </button>
            </div>

            {/* Notification list */}
            <div className="student-notifications-list">
                {notifications.length === 0 && (
                    <div className="student-notifications-empty">
                        {t('student.noNotifications')}
                    </div>
                )}

                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`student-notification-card ${!notification.isRead ? 'unread' : ''}`}
                    >
                        <div className="student-notification-content">
                            <div className="student-notification-top-row">
                                <span className="student-notification-title">
                                    {notification.title}
                                </span>
                                {!notification.isRead && (
                                    <span className="student-unread-dot" />
                                )}
                            </div>

                            <div className="student-notification-message">
                                {notification.body}
                            </div>

                            <div className="student-notification-footer">
                                <span className="student-notification-date">
                                    {formatDate(notification.createdAt, locale)}
                                </span>
                                {!notification.isRead && (
                                    <button
                                        className="student-mark-read-btn"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        disabled={markAsReadMutation.isPending}
                                    >
                                        {t('student.markAsRead')}
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
