# Commission Member API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## Предзащита

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/pre-defense/schedule?commissionId={id}` | Список назначенных предзащит. |
| GET | `/pre-defense/works/{workId:long}/attempts` | История попыток студента. |
| POST | `/pre-defense/schedule/{scheduleId:long}/grades` | Выставить оценку предзащиты. |
| GET | `/evaluation/criteria?workTypeId={id}&departmentId={id}` | Критерии оценивания. |

## Защита

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/defense-schedule?commissionId={id}` | Список назначенных защит. |
| GET | `/defense-schedule/{slotId:long}` | Детали слота защиты. |
| POST | `/evaluation/schedule/{scheduleId:long}/grades` | Выставить оценку защиты. |
| GET | `/evaluation/schedule/{scheduleId:long}/grades` | Просмотр оценок в сессии. |

## Материалы работ

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/works/{workId:long}` | Детали работы. |
| GET | `/works/{workId:long}/Attachments` | Материалы студента. |
| GET | `/works/{workId:long}/Attachments/{attachmentId:long}/download` | Скачать материалы. |
| GET | `/works/{workId:long}/Reviews` | Отзыв НР и рецензии. |

## Уведомления

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Notifications` | Лента уведомлений комиссии. |

## API Gap

1. Нет endpoint уровня `my sessions` без `commissionId`; нужен удобный агрегатор для роли.
