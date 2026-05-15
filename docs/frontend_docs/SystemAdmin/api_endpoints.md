# System Admin API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## Auth / Users

| Method | Endpoint | Назначение |
| --- | --- | --- |
| POST | `/Auth/register` | Регистрация пользователя. |
| POST | `/Auth/login` | Аутентификация. |
| POST | `/Auth/refresh-token` | Обновление токена. |
| GET | `/Users/me` | Проверка контекста/ролей. |

## Оргструктура

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Institutes` | Список институтов. |
| GET | `/Institutes/{instituteId}` | Детали института. |
| POST | `/Institutes` | Создать институт. |
| PUT | `/Institutes/{instituteId}` | Обновить институт. |
| DELETE | `/Institutes/{instituteId}` | Удалить институт. |
| GET | `/institutes/{instituteId}/departments` | Список кафедр института. |
| POST | `/institutes/{instituteId}/departments` | Создать кафедру. |
| PUT | `/Departments/{departmentId}` | Обновить кафедру. |
| DELETE | `/Departments/{departmentId}` | Удалить кафедру. |

## Справочники

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/degree-levels` | Уровни образования. |
| POST | `/degree-levels` | Создать уровень образования. |
| GET | `/academic-programs` | Список образовательных программ. |
| POST | `/academic-programs` | Создать программу. |
| PUT | `/academic-programs/{id}` | Обновить программу. |
| GET | `/WorkTypes` | Типы работ. |

## Сотрудники и студенты

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Staff` | Список сотрудников. |
| POST | `/Staff` | Создать запись сотрудника. |
| PUT | `/Staff/{staffId}` | Обновить сотрудника. |
| PATCH | `/Staff/{staffId}/workload` | Обновить нагрузку. |
| GET | `/Students` | Список студентов. |
| GET | `/Students/{studentId}` | Детали студента. |
| POST | `/Students` | Создать запись студента. |
| PUT | `/Students/{studentId}` | Обновить студента. |

## API Gap

1. Нет отдельного endpoint для управления ролями/правами пользователей (RBAC admin).
2. Нет явных endpoint для системных логов и аудита операций.
