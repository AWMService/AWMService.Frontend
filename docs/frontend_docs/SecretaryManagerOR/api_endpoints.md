# Secretary/OR Manager API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## Мониторинг и допуск

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Users/me` | Контекст пользователя. |
| GET | `/works/defense-readiness` | Готовность студентов к защите. |
| GET | `/works/admitted-students` | Список допущенных. |
| GET | `/works/review-status` | Статус рецензий по кафедре. |
| POST | `/works/send-readiness-reminders` | Массовые напоминания. |

## Расписание

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/pre-defense/schedule` | Расписание предзащит. |
| GET | `/defense-schedule` | Расписание защит. |
| GET | `/defense-schedule/{slotId:long}` | Детали слота. |

## Протоколы и ведомости

| Method | Endpoint | Назначение |
| --- | --- | --- |
| POST | `/pre-defense/protocols` | Сформировать протокол предзащиты. |
| POST | `/protocols` | Сформировать протокол защиты. |
| GET | `/protocols/{protocolId:long}` | Скачать сформированный протокол. |

## Уведомления

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Notifications` | Лента уведомлений. |
| GET | `/Notifications/unread-count` | Непрочитанные уведомления. |

## API Gap

1. Нет отдельного endpoint `export to PDF/Excel` для всех сводных списков (кроме протоколов).
