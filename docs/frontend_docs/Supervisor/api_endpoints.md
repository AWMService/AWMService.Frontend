# Supervisor Cabinet API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## Профиль и уведомления

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Users/me` | Контекст пользователя/роли. |
| GET | `/Notifications` | Лента уведомлений НР. |
| GET | `/Notifications/unread-count` | Непрочитанные уведомления. |
| PATCH | `/Notifications/{notificationId:long}/read` | Отметка прочитанного. |

## Направления

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Directions/by-supervisor` | Список направлений НР. |
| GET | `/Directions/{id}` | Детали направления. |
| POST | `/Directions` | Создать направление (`CreateDirectionRequest`). |
| PUT | `/Directions/{id}` | Изменить направление (`UpdateDirectionRequest`). |
| POST | `/Directions/{id}/submit` | Отправить направление на кафедру. |

## Темы

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Topics/by-direction/{directionId}` | Список тем направления. |
| GET | `/Topics/{id}` | Детали темы. |
| POST | `/Topics` | Создать тему (`CreateTopicRequest`). |
| PUT | `/Topics/{id}` | Изменить тему (`UpdateTopicRequest`). |
| POST | `/Topics/submit-for-approval` | Пакетно отправить темы на согласование. |
| POST | `/Topics/{id}/close` | Закрыть тему при заполнении. |

## Заявки студентов

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/applications/by-topic/{topicId:long}` | Заявки на тему. |
| POST | `/applications/{applicationId:long}/accept` | Принять заявку. |
| POST | `/applications/{applicationId:long}/reject` | Отклонить заявку (`RejectApplicationRequest`). |

## Закрепленные работы и отзывы

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/works/supervisor/{supervisorId:int}` | Список работ НР. |
| GET | `/works/{id:long}` | Детали работы. |
| POST | `/works/{workId:long}/Reviews/supervisor` | Создать/загрузить отзыв НР. |

## API Gap

1. В API нет отдельного endpoint `мой dashboard НР` (сводка нагрузка/статусы).
2. Для workflow-комментариев кафедры к теме нужен более явный контракт в ответах.
