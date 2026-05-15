import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale } from '@awm/shared';
import './NotificationsPage.css';

const mockNotifications = [
    { id: '1', type: 'action_required', title: 'Загрузите материалы на нормоконтроль', message: 'Срок загрузки истекает через 5 дней.', date: '2026-03-31T09:00:00', read: false },
    { id: '2', type: 'info', title: 'Тема утверждена', message: 'Ваша тема "Разработка системы управления процессами защиты ВКР" утверждена кафедрой.', date: '2026-03-28T14:00:00', read: false },
    { id: '3', type: 'warning', title: 'Предзащита 1 через 7 дней', message: 'Подготовьте презентацию и пояснительную записку.', date: '2026-03-27T10:00:00', read: true },
    { id: '4', type: 'info', title: 'Рецензент назначен', message: 'Вам назначен рецензент: Волков Д.С.', date: '2026-03-25T16:00:00', read: true },
    { id: '5', type: 'action_required', title: 'Заполните репозиторий', message: 'Укажите ссылку на репозиторий для проверки исходного кода.', date: '2026-03-20T11:00:00', read: true },
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
        all: 'student.filterAll',
        info: 'student.filterInfo',
        warning: 'student.filterWarning',
        action_required: 'student.filterActionRequired',
    };

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
                    {FILTER_TYPES.map((type) => (
                        <button
                            key={type}
                            className={`student-filter-pill ${filterType === type ? 'active' : ''}`}
                            onClick={() => setFilterType(type)}
                        >
                            {t(filterLabelKeys[type])}
                        </button>
                    ))}
                </div>
                <button
                    className="student-mark-all-read-btn"
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                >
                    {t('student.markAllRead')}
                </button>
            </div>

            {/* Notification list */}
            <div className="student-notifications-list">
                {filteredNotifications.length === 0 && (
                    <div className="student-notifications-empty">
                        {t('student.noNotifications')}
                    </div>
                )}

                {filteredNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`student-notification-card type-${notification.type} ${!notification.read ? 'unread' : ''}`}
                    >
                        <div className="student-notification-icon">
                            {TYPE_ICONS[notification.type]}
                        </div>

                        <div className="student-notification-content">
                            <div className="student-notification-top-row">
                                <span className="student-notification-title">
                                    {notification.title}
                                </span>
                                {!notification.read && (
                                    <span className={`student-unread-dot type-${notification.type}`} />
                                )}
                            </div>

                            <div className="student-notification-message">
                                {notification.message}
                            </div>

                            <div className="student-notification-footer">
                                <span className="student-notification-date">
                                    {formatDate(notification.date, locale)}
                                </span>
                                {!notification.read && (
                                    <button
                                        className="student-mark-read-btn"
                                        onClick={() => handleMarkAsRead(notification.id)}
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
