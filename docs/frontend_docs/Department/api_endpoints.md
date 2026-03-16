# Department Cabinet API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## НР и сотрудники

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Users/me` | Контекст кафедры и учебного года. |
| GET | `/Staff?departmentId={id}` | Сотрудники кафедры. |
| GET | `/Staff/supervisors?departmentId={id}` | Текущий состав НР. |
| POST | `/Staff/approve-supervisors` | Утвердить состав НР. |

## Периоды workflow

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/departments/{departmentId}/Periods` | Список периодов кафедры. |
| GET | `/departments/{departmentId}/Periods/active` | Активный период по stage. |
| POST | `/departments/{departmentId}/Periods/approve-initial` | Утверждение начальных периодов. |
| POST | `/departments/{departmentId}/Periods/approve-defense` | Утверждение периодов предзащит/проверок/защиты. |
| PUT | `/departments/{departmentId}/Periods/{periodId}` | Корректировка периода. |

## Направления и темы

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Directions/by-department` | Очередь направлений кафедры. |
| POST | `/Directions/{id}/approve` | Утвердить направление. |
| POST | `/Directions/{id}/reject` | Отклонить направление. |
| POST | `/Directions/{id}/request-revision` | Вернуть на доработку. |
| GET | `/Topics/coordination-summary` | Сводка согласования тем. |
| POST | `/Topics/bulk-approve` | Массово утвердить темы. |
| POST | `/Topics/{id}/deactivate` | Сделать тему неактуальной. |
| POST | `/Topics/complete-coordination` | Завершить этап согласования. |

## Комиссии и расписание

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/commissions` | Список комиссий. |
| GET | `/commissions/{id:int}` | Детали комиссии. |
| POST | `/commissions` | Создать комиссию. |
| PUT | `/commissions/{id:int}` | Изменить комиссию. |
| POST | `/commissions/{id:int}/members` | Добавить члена комиссии. |
| DELETE | `/commissions/{id:int}/members/{memberId:int}` | Удалить члена комиссии. |
| POST | `/pre-defense/distribute` | Автораспределение на предзащиту. |
| POST | `/pre-defense/generate-slots` | Генерация слотов предзащиты. |
| POST | `/defense-schedule/generate-slots` | Генерация слотов защиты. |
| POST | `/defense-schedule/{scheduleId:long}/assign` | Назначить работу в слот защиты. |
| PUT | `/defense-schedule/{scheduleId:long}` | Изменить слот защиты. |

## Проверки, рецензии, готовность

| Method | Endpoint | Назначение |
| --- | --- | --- |
| POST | `/quality-checks/assign-experts` | Назначение экспертов. |
| POST | `/works/{workId:long}/assign-reviewer` | Назначение рецензента. |
| GET | `/works/review-status` | Сводка статуса рецензий. |
| GET | `/works/defense-readiness` | Готовность к защите. |
| GET | `/works/admitted-students` | Список допущенных. |
| POST | `/works/send-readiness-reminders` | Рассылка напоминаний. |

## Уведомления

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Notifications` | Лента уведомлений. |
| GET | `/Notifications/unread-count` | Непрочитанные. |

## API Gap

1. Для workflow шага `доработка тем с комментариями` нет отдельного явного endpoint.
2. Для внешнего рецензента нет полноценной CRUD-сущности в открытом API.
