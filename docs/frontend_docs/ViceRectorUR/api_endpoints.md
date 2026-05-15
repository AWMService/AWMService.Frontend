# Vice Rector (UR) API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## Оргструктура и справочники

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Institutes` | Институты университета. |
| GET | `/institutes/{instituteId}/departments` | Кафедры института. |
| GET | `/WorkTypes` | Типы работ. |

## Аналитика и контроль

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/works/defense-readiness` | Готовность к защите по кафедре. |
| GET | `/works/review-status` | Статус рецензий по кафедре. |
| GET | `/works/admitted-students` | Допущенные к защите. |
| GET | `/works/by-department` | Реестр работ кафедры. |
| GET | `/defense-schedule` | Расписание защит (через комиссии). |

## Уведомления

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Notifications` | Лента уведомлений. |

## API Gap

1. Нет агрегированных endpoint уровня `all institutes summary` без итерирования по кафедрам.
2. Нет отдельного endpoint для динамики KPI по периодам (trend/time-series).
