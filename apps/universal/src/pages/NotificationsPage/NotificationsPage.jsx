import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRole, ROLES } from '@awm/shared';
import './NotificationsPage.css';

const getNotificationsForRole = (role) => {
    const common = [
        { id: 'c1', type: 'info', title: 'Система обновлена', message: 'Платформа AWM обновлена.', date: '2026-03-20T08:00:00', read: true },
    ];

    const roleSpecific = {
        [ROLES.SUPERVISOR]: [
            { id: 's1', type: 'action_required', title: 'Новые заявки на темы', message: '3 студента подали заявки на ваши темы.', date: '2026-03-31T09:00:00', read: false },
            { id: 's2', type: 'warning', title: 'Срок подачи отзыва', message: 'До дедлайна отзыва НР осталось 5 дней.', date: '2026-03-30T14:00:00', read: false },
            { id: 's3', type: 'info', title: 'Предзащита назначена', message: 'Предзащита ваших студентов 15 апреля.', date: '2026-03-28T10:00:00', read: true },
        ],
        [ROLES.REVIEWER]: [
            { id: 'r1', type: 'action_required', title: 'Новая работа на рецензию', message: 'Назначена рецензия работы Сергеева Н.С.', date: '2026-03-31T11:00:00', read: false },
            { id: 'r2', type: 'warning', title: 'Дедлайн рецензии', message: 'Срок подачи рецензии — 10 апреля.', date: '2026-03-29T09:00:00', read: false },
        ],
        [ROLES.NORMOCONTROL]: [
            { id: 'n1', type: 'action_required', title: 'Новые документы на проверку', message: '5 документов ожидают проверки.', date: '2026-03-31T08:00:00', read: false },
            { id: 'n2', type: 'info', title: 'Документ исправлен', message: 'Студент Козлов В.П. загрузил исправленный документ.', date: '2026-03-30T16:00:00', read: true },
        ],
        [ROLES.CHAIRMAN]: [
            { id: 'ch1', type: 'info', title: 'Комиссия сформирована', message: 'Вы назначены председателем комиссии №1.', date: '2026-03-28T10:00:00', read: true },
            { id: 'ch2', type: 'action_required', title: 'Предзащита завтра', message: 'Предзащита комиссии №1 назначена на 1 апреля.', date: '2026-03-31T09:00:00', read: false },
        ],
        [ROLES.SECRETARY]: [
            { id: 'se1', type: 'action_required', title: 'Заполните протокол', message: 'Протокол предзащиты комиссии №1 ожидает заполнения.', date: '2026-03-31T10:00:00', read: false },
            { id: 'se2', type: 'warning', title: 'Не все оценки выставлены', message: '2 члена комиссии ещё не выставили оценки.', date: '2026-03-30T15:00:00', read: false },
        ],
        [ROLES.COMMISSION_MEMBER]: [
            { id: 'cm1', type: 'action_required', title: 'Выставьте оценки', message: 'Оцените 8 студентов до 2 апреля.', date: '2026-03-31T09:00:00', read: false },
            { id: 'cm2', type: 'info', title: 'Расписание предзащиты', message: 'Предзащита назначена на 1 апреля, 9:00, ауд. 305.', date: '2026-03-28T14:00:00', read: true },
        ],
    };

    return [...(roleSpecific[role] || []), ...common];
};

const TYPE_ICONS = {
    info: '🔵',
    warning: '⚠️',
    action_required: '🔴',
};

const FILTER_TYPES = ['all', 'info', 'warning', 'action_required'];

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function NotificationsPage() {
    const { t } = useTranslation();
    const { currentRole } = useRole();
    const [notifications, setNotifications] = useState(() => getNotificationsForRole(currentRole));
    const [filterType, setFilterType] = useState('all');

    // Re-generate notifications when role changes
    React.useEffect(() => {
        setNotifications(getNotificationsForRole(currentRole));
        setFilterType('all');
    }, [currentRole]);

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
        all: 'universal.filterAll',
        info: 'universal.filterInfo',
        warning: 'universal.filterWarning',
        action_required: 'universal.filterActionRequired',
    };

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <h1>{t('universal.notificationsTitle')}</h1>
                {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                )}
            </div>

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
                    {t('universal.markAllRead')}
                </button>
            </div>

            <div className="notifications-list">
                {filteredNotifications.length === 0 && (
                    <div className="notifications-empty">
                        {t('universal.noNotifications')}
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
                                    {formatDate(notification.date)}
                                </span>
                                {!notification.read && (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        {t('universal.markAsRead')}
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
