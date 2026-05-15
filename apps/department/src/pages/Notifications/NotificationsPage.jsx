import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale } from '@awm/shared';
import './NotificationsPage.css';

const mockNotifications = [
    { id: '1', type: 'action_required', title: 'Новые направления на рассмотрение', message: 'Поступило 3 новых направления от научных руководителей.', date: '2026-03-31T09:30:00', read: false },
    { id: '2', type: 'warning', title: 'Истекает срок формирования тем', message: 'До окончания периода формирования тем осталось 3 дня.', date: '2026-03-30T14:00:00', read: false },
    { id: '3', type: 'info', title: 'Научные руководители утверждены', message: 'Список НР на 2025-2026 учебный год утверждён.', date: '2026-03-28T10:15:00', read: true },
    { id: '4', type: 'action_required', title: 'Заявки студентов на темы', message: '5 студентов подали заявки на выбор тем. Требуется согласование.', date: '2026-03-27T16:45:00', read: true },
    { id: '5', type: 'info', title: 'Начальные периоды утверждены', message: 'Периоды формирования направлений, тем и выбора тем установлены.', date: '2026-03-25T11:00:00', read: true },
    { id: '6', type: 'warning', title: 'Не назначены рецензенты', message: 'Для 4 работ не назначены рецензенты. Назначьте до начала предзащиты.', date: '2026-03-24T09:00:00', read: false },
    { id: '7', type: 'info', title: 'Система обновлена', message: 'Платформа AWM обновлена до версии 2.1.', date: '2026-03-20T08:00:00', read: true },
];

const TYPE_ICONS = {
    info: '🔵',
    warning: '⚠️',
    action_required: '🔴',
};

const FILTER_TYPES = ['all', 'info', 'warning', 'action_required'];

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
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filterType, setFilterType] = useState('all');

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications],
    );

    const filteredNotifications = useMemo(
        () =>
            filterType === 'all'
                ? notifications
                : notifications.filter((n) => n.type === filterType),
        [notifications, filterType],
    );

    const handleMarkAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
    };

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const filterLabelKeys = {
        all: 'department.filterAll',
        info: 'department.filterInfo',
        warning: 'department.filterWarning',
        action_required: 'department.filterActionRequired',
    };

    return (
        <div className="notifications-page">
            {/* Header */}
            <div className="notifications-header">
                <h1>{t('department.notificationsTitle', 'Уведомления')}</h1>
                {unreadCount > 0 && (
                    <span className="unread-badge">
                        {t('department.unreadCount', '{{count}} новых', { count: unreadCount })}
                    </span>
                )}
            </div>

            {/* Filter bar */}
            <div className="notifications-filter-bar">
                <div className="filter-pills">
                    {FILTER_TYPES.map((type) => (
                        <button
                            key={type}
                            className={`filter-pill ${filterType === type ? 'active' : ''}`}
                            onClick={() => setFilterType(type)}
                        >
                            {t(filterLabelKeys[type])}
                        </button>
                    ))}
                </div>
                <button
                    className="mark-all-read-btn"
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                >
                    {t('department.markAllRead', 'Отметить все как прочитанные')}
                </button>
            </div>

            {/* Notification list */}
            <div className="notifications-list">
                {filteredNotifications.length === 0 && (
                    <div className="notifications-empty">
                        {t('department.noNotifications', 'Нет уведомлений')}
                    </div>
                )}

                {filteredNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`notification-card type-${notification.type} ${!notification.read ? 'unread' : ''}`}
                    >
                        <div className="notification-icon">
                            {TYPE_ICONS[notification.type]}
                        </div>

                        <div className="notification-content">
                            <div className="notification-top-row">
                                <span className="notification-title">
                                    {notification.title}
                                </span>
                                {!notification.read && (
                                    <span className={`unread-dot type-${notification.type}`} />
                                )}
                            </div>

                            <div className="notification-message">
                                {notification.message}
                            </div>

                            <div className="notification-footer">
                                <span className="notification-date">
                                    {formatDate(notification.date, locale)}
                                </span>
                                {!notification.read && (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        {t('department.markAsRead', 'Отметить как прочитанное')}
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
