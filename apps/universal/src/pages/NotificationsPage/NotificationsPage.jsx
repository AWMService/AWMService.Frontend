import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRole, ROLES, getIntlLocale, getLocalizedValue } from '@awm/shared';
import './NotificationsPage.css';

const getNotificationsForRole = (role) => {
    const common = [
        {
            id: 'c1',
            type: 'info',
            title: {
                ru: 'Система обновлена',
                kk: 'Жүйе жаңартылды',
                en: 'System updated',
            },
            message: {
                ru: 'Платформа AWM обновлена.',
                kk: 'AWM платформасы жаңартылды.',
                en: 'The AWM platform has been updated.',
            },
            date: '2026-03-20T08:00:00',
            read: true,
        },
    ];

    const roleSpecific = {
        [ROLES.SUPERVISOR]: [
            {
                id: 's1',
                type: 'action_required',
                title: {
                    ru: 'Новые заявки на темы',
                    kk: 'Тақырыптарға жаңа өтінімдер',
                    en: 'New topic applications',
                },
                message: {
                    ru: '3 студента подали заявки на ваши темы.',
                    kk: '3 студент сіздің тақырыптарыңызға өтінім берді.',
                    en: '3 students applied to your topics.',
                },
                date: '2026-03-31T09:00:00',
                read: false,
            },
            {
                id: 's2',
                type: 'warning',
                title: {
                    ru: 'Срок подачи отзыва',
                    kk: 'Пікір тапсыру мерзімі',
                    en: 'Review submission deadline',
                },
                message: {
                    ru: 'До дедлайна отзыва НР осталось 5 дней.',
                    kk: 'Жетекші пікірін тапсыруға 5 күн қалды.',
                    en: '5 days remain until the supervisor review deadline.',
                },
                date: '2026-03-30T14:00:00',
                read: false,
            },
            {
                id: 's3',
                type: 'info',
                title: {
                    ru: 'Предзащита назначена',
                    kk: 'Алдын ала қорғау тағайындалды',
                    en: 'Pre-defense scheduled',
                },
                message: {
                    ru: 'Предзащита ваших студентов 15 апреля.',
                    kk: 'Студенттеріңіздің алдын ала қорғауы 15 сәуірде.',
                    en: 'Your students\' pre-defense is scheduled for April 15.',
                },
                date: '2026-03-28T10:00:00',
                read: true,
            },
        ],
        [ROLES.REVIEWER]: [
            {
                id: 'r1',
                type: 'action_required',
                title: {
                    ru: 'Новая работа на рецензию',
                    kk: 'Рецензияға жаңа жұмыс',
                    en: 'New work for review',
                },
                message: {
                    ru: 'Назначена рецензия работы Сергеева Н.С.',
                    kk: 'Сергеева Н.С. жұмысына рецензия тағайындалды.',
                    en: 'A review has been assigned for Sergeev N.S.',
                },
                date: '2026-03-31T11:00:00',
                read: false,
            },
            {
                id: 'r2',
                type: 'warning',
                title: {
                    ru: 'Дедлайн рецензии',
                    kk: 'Рецензия мерзімі',
                    en: 'Review deadline',
                },
                message: {
                    ru: 'Срок подачи рецензии — 10 апреля.',
                    kk: 'Рецензияны тапсыру мерзімі — 10 сәуір.',
                    en: 'The review deadline is April 10.',
                },
                date: '2026-03-29T09:00:00',
                read: false,
            },
        ],
        [ROLES.NORMOCONTROL]: [
            {
                id: 'n1',
                type: 'action_required',
                title: {
                    ru: 'Новые документы на проверку',
                    kk: 'Тексеруге жаңа құжаттар',
                    en: 'New documents for review',
                },
                message: {
                    ru: '5 документов ожидают проверки.',
                    kk: '5 құжат тексеруді күтуде.',
                    en: '5 documents are waiting for review.',
                },
                date: '2026-03-31T08:00:00',
                read: false,
            },
            {
                id: 'n2',
                type: 'info',
                title: {
                    ru: 'Документ исправлен',
                    kk: 'Құжат түзетілді',
                    en: 'Document revised',
                },
                message: {
                    ru: 'Студент Козлов В.П. загрузил исправленный документ.',
                    kk: 'Козлов В.П. студенті түзетілген құжатты жүктеді.',
                    en: 'Student Kozlov V.P. uploaded a revised document.',
                },
                date: '2026-03-30T16:00:00',
                read: true,
            },
        ],
        [ROLES.CHAIRMAN]: [
            {
                id: 'ch1',
                type: 'info',
                title: {
                    ru: 'Комиссия сформирована',
                    kk: 'Комиссия құрылды',
                    en: 'Commission created',
                },
                message: {
                    ru: 'Вы назначены председателем комиссии №1.',
                    kk: 'Сіз №1 комиссиясының төрағасы болып тағайындалдыңыз.',
                    en: 'You have been appointed chairman of commission No. 1.',
                },
                date: '2026-03-28T10:00:00',
                read: true,
            },
            {
                id: 'ch2',
                type: 'action_required',
                title: {
                    ru: 'Предзащита завтра',
                    kk: 'Алдын ала қорғау ертең',
                    en: 'Pre-defense tomorrow',
                },
                message: {
                    ru: 'Предзащита комиссии №1 назначена на 1 апреля.',
                    kk: '№1 комиссияның алдын ала қорғауы 1 сәуірге жоспарланған.',
                    en: 'Commission No. 1 pre-defense is scheduled for April 1.',
                },
                date: '2026-03-31T09:00:00',
                read: false,
            },
        ],
        [ROLES.SECRETARY]: [
            {
                id: 'se1',
                type: 'action_required',
                title: {
                    ru: 'Заполните протокол',
                    kk: 'Хаттаманы толтырыңыз',
                    en: 'Fill in the protocol',
                },
                message: {
                    ru: 'Протокол предзащиты комиссии №1 ожидает заполнения.',
                    kk: '№1 комиссияның алдын ала қорғау хаттамасын толтыру қажет.',
                    en: 'The commission No. 1 pre-defense protocol is waiting to be filled in.',
                },
                date: '2026-03-31T10:00:00',
                read: false,
            },
            {
                id: 'se2',
                type: 'warning',
                title: {
                    ru: 'Не все оценки выставлены',
                    kk: 'Барлық бағалар қойылған жоқ',
                    en: 'Not all grades are set',
                },
                message: {
                    ru: '2 члена комиссии ещё не выставили оценки.',
                    kk: 'Комиссияның 2 мүшесі әлі бағаларын қойған жоқ.',
                    en: '2 commission members have not submitted grades yet.',
                },
                date: '2026-03-30T15:00:00',
                read: false,
            },
        ],
        [ROLES.COMMISSION_MEMBER]: [
            {
                id: 'cm1',
                type: 'action_required',
                title: {
                    ru: 'Выставьте оценки',
                    kk: 'Бағаларды қойыңыз',
                    en: 'Submit grades',
                },
                message: {
                    ru: 'Оцените 8 студентов до 2 апреля.',
                    kk: '2 сәуірге дейін 8 студентті бағалаңыз.',
                    en: 'Evaluate 8 students by April 2.',
                },
                date: '2026-03-31T09:00:00',
                read: false,
            },
            {
                id: 'cm2',
                type: 'info',
                title: {
                    ru: 'Расписание предзащиты',
                    kk: 'Алдын ала қорғау кестесі',
                    en: 'Pre-defense schedule',
                },
                message: {
                    ru: 'Предзащита назначена на 1 апреля, 9:00, ауд. 305.',
                    kk: 'Алдын ала қорғау 1 сәуір, 9:00, 305-ауд. тағайындалды.',
                    en: 'Pre-defense is scheduled for April 1 at 9:00 in room 305.',
                },
                date: '2026-03-28T14:00:00',
                read: true,
            },
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
                                    {getLocalizedValue(notification.title, i18n.language)}
                                </span>
                                {!notification.read && (
                                    <span className={`unread-dot type-${notification.type}`} />
                                )}
                            </div>

                            <div className="notification-message">
                                {getLocalizedValue(notification.message, i18n.language)}
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
