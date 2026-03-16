# Student Cabinet API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## Профиль и контекст

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Users/me` | Контекст пользователя, роль, кафедра, учебный год. |
| GET | `/Notifications` | Лента уведомлений. |
| GET | `/Notifications/unread-count` | Счетчик непрочитанных. |
| PATCH | `/Notifications/{notificationId:long}/read` | Отметить уведомление прочитанным. |
| PATCH | `/Notifications/read-all` | Отметить все прочитанными. |

## Выбор темы и заявки

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Topics/available` | Каталог доступных тем. |
| GET | `/Topics/{id}` | Детали темы. |
| POST | `/applications` | Подать заявку (`CreateApplicationRequest`). |
| GET | `/applications/my` | Мои заявки. |
| DELETE | `/applications/{applicationId:long}` | Отозвать заявку. |

## Моя работа и материалы

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/works/my` | Работы текущего студента. |
| GET | `/works/{id:long}` | Детали работы. |
| GET | `/works/{workId:long}/Attachments` | Список вложений по работе. |
| POST | `/works/{workId:long}/Attachments` | Загрузка вложения (`UploadAttachmentRequest`). |
| GET | `/works/{workId:long}/Attachments/{attachmentId:long}/download` | Скачать вложение. |
| DELETE | `/works/{workId:long}/Attachments/{attachmentId:long}` | Удалить вложение до фиксации этапа. |

## Предзащита

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/pre-defense/works/{workId:long}/attempts` | История попыток и результат. |

## Проверки и рецензия

| Method | Endpoint | Назначение |
| --- | --- | --- |
| POST | `/quality-checks/works/{workId:long}/submit` | Отправить материалы на проверку. |
| GET | `/quality-checks/by-work/{workId:long}` | Получить статусы проверок. |
| PUT | `/works/{workId:long}/repository-url` | Указать Git-репозиторий для проверки ПО. |
| GET | `/works/{workId:long}/assigned-reviewer` | Контакты/данные назначенного рецензента. |
| GET | `/works/{workId:long}/Reviews` | Отзыв НР и рецензии. |
| POST | `/works/{workId:long}/Reviews/external/{reviewId:long}` | Загрузить внешнюю рецензию (если роль разрешена). |

## API Gap

1. Нет отдельного endpoint `my pre-defense schedule` и `my defense schedule` по студенту.
2. Для шага `Материалы отправлены рецензенту` нет отдельного флага/endpoint.
