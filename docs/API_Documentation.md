# Документация API AWM.Service

**Система управления дипломными работами (Academic Work Management)**

- **Версия API:** v1.0
- **Базовый путь:** `api/v{version:apiVersion}`
- **Формат данных:** JSON
- **Архитектура:** Clean Architecture с использованием MediatR (CQRS)

---

## Содержание

1. [Аутентификация (Auth)](#1-аутентификация-auth)
2. [Образовательные программы (AcademicPrograms)](#2-образовательные-программы-academicprograms)
3. [Вложения файлов (Attachments)](#3-вложения-файлов-attachments)
4. [Комиссии (Commissions)](#4-комиссии-commissions)
5. [Расписание защит (DefenseSchedule)](#5-расписание-защит-defenseschedule)
6. [Уровни образования (DegreeLevels)](#6-уровни-образования-degreelevels)
7. [Кафедры (Departments)](#7-кафедры-departments)
8. [Направления исследований (Directions)](#8-направления-исследований-directions)
9. [Оценивание (Evaluation)](#9-оценивание-evaluation)
10. [Институты (Institutes)](#10-институты-institutes)
11. [Уведомления (Notifications)](#11-уведомления-notifications)
12. [Периоды workflow (Periods)](#12-периоды-workflow-periods)
13. [Предзащиты (PreDefense)](#13-предзащиты-predefense)
14. [Протоколы (Protocols)](#14-протоколы-protocols)
15. [Контроль качества (QualityChecks)](#15-контроль-качества-qualitychecks)
16. [Рецензии (Reviews)](#16-рецензии-reviews)
17. [Преподаватели (Staff)](#17-преподаватели-staff)
18. [Студенты (Students)](#18-студенты-students)
19. [Дипломные работы (StudentWorks)](#19-дипломные-работы-studentworks)
20. [Заявки на темы (TopicApplications)](#20-заявки-на-темы-topicapplications)
21. [Темы дипломных работ (Topics)](#21-темы-дипломных-работ-topics)
22. [Типы работ (WorkTypes)](#22-типы-работ-worktypes)
23. [Пользователи (Users)](#23-пользователи-users)

---

## 1. Аутентификация (Auth)

**Базовый путь:** `api/v1/auth`

### POST `/login`

Аутентификация пользователя.

**Входные данные:**

```json
{
  "login": "string",
  "password": "string"
}
```

**Возвращаемые данные:**

```json
{
  "token": "string",
  "login": "string",
  "userId": 0,
  "email": "string",
  "roles": ["string"],
  "refreshToken": "string"
}
```

### POST `/refresh-token`

Обновление access-токена с использованием refresh-токена.

**Входные данные:**

```json
{
  "refreshToken": "string"
}
```

**Возвращаемые данные:**

```json
{
  "token": "string",
  "login": "string",
  "userId": 0,
  "email": "string",
  "roles": ["string"],
  "refreshToken": "string"
}
```

### POST `/register`

Регистрация нового пользователя.

**Входные данные:**

```json
{
  "login": "string",
  "email": "string",
  "password": "string",
  "universityId": 1
}
```

**Возвращаемые данные:** `int` (UserId)

---

## 2. Образовательные программы (AcademicPrograms)

**Базовый путь:** `api/v1/academic-programs`

### GET `/`

Получить список программ.

**Параметры запроса (query):**

- `departmentId` (int, optional)
- `degreeLevelId` (int, optional)
- `code` (string, optional)
- `name` (string, optional)
- `includeDeleted` (bool, optional)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "departmentId": 0,
    "degreeLevelId": 0,
    "code": "string",
    "name": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": 0,
    "lastModifiedAt": "2024-01-01T00:00:00Z",
    "lastModifiedBy": 0,
    "isDeleted": true,
    "deletedAt": "2024-01-01T00:00:00Z",
    "deletedBy": 0
  }
]
```

### POST `/`

Создать программу.

**Входные данные:**

```json
{
  "departmentId": 0,
  "degreeLevelId": 0,
  "code": "string",
  "name": "string"
}
```

**Возвращаемые данные:** `int` (Id)

### PUT `/{id}`

Обновить программу.

**Параметры пути:** `id` (int)

**Входные данные:**

```json
{
  "code": "string",
  "name": "string"
}
```

**Возвращаемые данные:** `204 NoContent`

---

## 3. Вложения файлов (Attachments)

**Базовый путь:** `api/v1/works/{workId}/attachments`

### GET `/`

Получить все вложения работы.

**Параметры пути:** `workId` (long)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "workId": 0,
    "stateId": 0,
    "attachmentType": "Draft",
    "fileName": "string",
    "fileStoragePath": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": 0,
    "lastModifiedAt": "2024-01-01T00:00:00Z",
    "lastModifiedBy": 0
  }
]
```

### GET `/{attachmentId}`

Получить вложение по ID.

**Параметры пути:** `workId` (long), `attachmentId` (long)

**Возвращаемые данные:** `AttachmentResponse`

### GET `/{attachmentId}/download`

Скачать файл.

**Параметры пути:** `workId` (long), `attachmentId` (long)

**Возвращаемые данные:** File Stream

### POST `/`

Загрузить файл (multipart/form-data).

**Параметры пути:** `workId` (long)

**Входные данные (form-data):**

- `AttachmentType` (int): 0=Draft, 1=Final, 2=Presentation, 3=Software
- `File` (IFormFile)

**Возвращаемые данные:** `long` (Id)

### DELETE `/{attachmentId}`

Удалить вложение.

**Параметры пути:** `workId` (long), `attachmentId` (long)

**Возвращаемые данные:** `204 NoContent`

---

## 4. Комиссии (Commissions)

**Базовый путь:** `api/v1/commissions`

### GET `/`

Получить комиссии кафедры.

**Параметры запроса (query):**

- `departmentId` (int)
- `academicYearId` (int)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "departmentId": 0,
    "academicYearId": 0,
    "commissionType": "PreDefense",
    "name": "string",
    "preDefenseNumber": 0,
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": 0,
    "lastModifiedAt": "2024-01-01T00:00:00Z",
    "lastModifiedBy": 0,
    "members": []
  }
]
```

### GET `/{id}`

Получить комиссию с деталями.

**Параметры пути:** `id` (int)

**Возвращаемые данные:**

```json
{
  "id": 0,
  "departmentId": 0,
  "academicYearId": 0,
  "commissionType": "PreDefense",
  "name": "string",
  "preDefenseNumber": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "createdBy": 0,
  "lastModifiedAt": "2024-01-01T00:00:00Z",
  "lastModifiedBy": 0,
  "members": [
    {
      "id": 0,
      "commissionId": 0,
      "userId": 0,
      "roleInCommission": "Member",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST `/`

Создать комиссию.

**Входные данные:**

```json
{
  "departmentId": 0,
  "academicYearId": 0,
  "commissionType": "PreDefense",
  "name": "string",
  "preDefenseNumber": 0
}
```

**Возвращаемые данные:** `int` (Id)

### PUT `/{id}`

Обновить название комиссии.

**Параметры пути:** `id` (int)

**Входные данные:**

```json
{
  "name": "string"
}
```

**Возвращаемые данные:** `204 NoContent`

### POST `/{id}/members`

Добавить члена комиссии.

**Параметры пути:** `id` (int)

**Входные данные:**

```json
{
  "userId": 0,
  "roleInCommission": "Member"
}
```

**Возвращаемые данные:** `int` (MemberId)

### DELETE `/{id}/members/{memberId}`

Удалить члена комиссии.

**Параметры пути:** `id` (int), `memberId` (int)

**Возвращаемые данные:** `204 NoContent`

---

## 5. Расписание защит (DefenseSchedule)

**Базовый путь:** `api/v1/defense-schedule`

### GET `/`

Получить расписание комиссии.

**Параметры запроса (query):**

- `commissionId` (int)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "commissionId": 0,
    "workId": 0,
    "defenseDate": "2024-01-01T00:00:00Z",
    "location": "string",
    "averageScore": 0,
    "gradeCount": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET `/{slotId}`

Получить слот защиты с оценками.

**Параметры пути:** `slotId` (long)

**Возвращаемые данные:**

```json
{
  "id": 0,
  "commissionId": 0,
  "workId": 0,
  "defenseDate": "2024-01-01T00:00:00Z",
  "location": "string",
  "averageScore": 0,
  "grades": [
    {
      "id": 0,
      "scheduleId": 0,
      "memberId": 0,
      "criteriaId": 0,
      "score": 0,
      "comment": "string",
      "gradedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### POST `/`

Создать слот расписания.

**Входные данные:**

```json
{
  "commissionId": 0,
  "defenseDate": "2024-01-01T00:00:00Z",
  "location": "string"
}
```

**Возвращаемые данные:** `long` (Id)

### PUT `/{scheduleId}`

Обновить (перенести) слот.

**Параметры пути:** `scheduleId` (long)

**Входные данные:**

```json
{
  "defenseDate": "2024-01-01T00:00:00Z",
  "location": "string"
}
```

**Возвращаемые данные:** `204 NoContent`

### POST `/{scheduleId}/assign`

Назначить работу на слот.

**Параметры пути:** `scheduleId` (long)

**Входные данные:**

```json
{
  "workId": 0
}
```

**Возвращаемые данные:** `204 NoContent`

---

## 6. Уровни образования (DegreeLevels)

**Базовый путь:** `api/v1/degree-levels`

### GET `/`

Получить уровни образования.

**Параметры запроса (query):**

- `name` (string, optional)
- `minDurationYears` (int, optional)
- `maxDurationYears` (int, optional)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "name": "Bachelor",
    "durationYears": 0,
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": 0,
    "lastModifiedAt": "2024-01-01T00:00:00Z",
    "lastModifiedBy": 0
  }
]
```

### POST `/`

Создать уровень образования.

**Входные данные:**

```json
{
  "name": "Bachelor",
  "durationYears": 0
}
```

**Возвращаемые данные:** `int` (Id)

---

## 7. Кафедры (Departments)

**Базовый путь:** `api/v1/institutes/{instituteId}/departments`

### GET `/api/v1/institutes/{instituteId}/departments`

Получить кафедры института.

**Параметры пути:** `instituteId` (int)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "instituteId": 0,
    "name": "string",
    "code": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": 0,
    "lastModifiedAt": "2024-01-01T00:00:00Z",
    "lastModifiedBy": 0
  }
]
```

### POST `/api/v1/institutes/{instituteId}/departments`

Создать кафедру.

**Параметры пути:** `instituteId` (int)

**Входные данные:**

```json
{
  "instituteId": 0,
  "name": "string",
  "code": "string"
}
```

**Возвращаемые данные:** `int` (Id)

### PUT `/{departmentId}`

Обновить кафедру.

**Параметры пути:** `departmentId` (int)

**Входные данные:**

```json
{
  "name": "string",
  "code": "string"
}
```

**Возвращаемые данные:** `204 NoContent`

### DELETE `/{departmentId}`

Удалить кафедру (soft delete).

**Параметры пути:** `departmentId` (int)

**Возвращаемые данные:** `204 NoContent`

---

## 8. Направления исследований (Directions)

**Базовый путь:** `api/v1/directions`

### GET `/by-department`

Получить направления кафедры.

**Параметры запроса (query):**

- `departmentId` (int)
- `academicYearId` (int)
- `workTypeId` (int, optional)
- `stateId` (int, optional)
- `supervisorId` (int, optional)
- `includeDeleted` (bool, optional)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "departmentId": 0,
    "supervisorId": 0,
    "academicYearId": 0,
    "workTypeId": 0,
    "titleRu": "string",
    "titleKz": "string",
    "titleEn": "string",
    "currentStateId": 0,
    "submittedAt": "2024-01-01T00:00:00Z",
    "reviewedAt": "2024-01-01T00:00:00Z",
    "reviewedBy": 0,
    "createdAt": "2024-01-01T00:00:00Z",
    "isDeleted": true
  }
]
```

### GET `/by-supervisor`

Получить направления руководителя.

**Параметры запроса (query):**

- `supervisorId` (int)
- `academicYearId` (int)
- `workTypeId` (int, optional)
- `stateId` (int, optional)
- `includeDeleted` (bool, optional)

**Возвращаемые данные:** `IReadOnlyList<DirectionResponse>`

### GET `/{id}`

Получить направление по ID.

**Параметры пути:** `id` (long)

**Параметры запроса (query):**

- `includeDeleted` (bool, optional)

**Возвращаемые данные:**

```json
{
  "id": 0,
  "departmentId": 0,
  "supervisorId": 0,
  "academicYearId": 0,
  "workTypeId": 0,
  "titleRu": "string",
  "titleKz": "string",
  "titleEn": "string",
  "currentStateId": 0,
  "submittedAt": "2024-01-01T00:00:00Z",
  "reviewedAt": "2024-01-01T00:00:00Z",
  "reviewedBy": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "isDeleted": true,
  "descriptionRu": "string",
  "descriptionKz": "string",
  "descriptionEn": "string",
  "reviewComment": "string",
  "createdBy": 0,
  "lastModifiedAt": "2024-01-01T00:00:00Z",
  "lastModifiedBy": 0,
  "deletedAt": "2024-01-01T00:00:00Z",
  "deletedBy": 0,
  "topicsCount": 0
}
```

### POST `/`

Создать направление.

**Входные данные:**

```json
{
  "departmentId": 0,
  "supervisorId": 0,
  "academicYearId": 0,
  "workTypeId": 0,
  "titleRu": "string",
  "titleKz": "string",
  "titleEn": "string",
  "descriptionRu": "string",
  "descriptionKz": "string",
  "descriptionEn": "string"
}
```

**Возвращаемые данные:** `long` (Id)

### PUT `/{id}`

Обновить направление.

**Параметры пути:** `id` (long)

**Входные данные:**

```json
{
  "titleRu": "string",
  "titleKz": "string",
  "titleEn": "string",
  "descriptionRu": "string",
  "descriptionKz": "string",
  "descriptionEn": "string"
}
```

**Возвращаемые данные:** `204 NoContent`

### POST `/{id}/submit`

Отправить на проверку.

**Параметры пути:** `id` (long)

**Возвращаемые данные:** `204 NoContent`

### POST `/{id}/approve`

Утвердить направление.

**Параметры пути:** `id` (long)

**Возвращаемые данные:** `204 NoContent`

### POST `/{id}/reject`

Отклонить направление.

**Параметры пути:** `id` (long)

**Входные данные:**

```json
{
  "comment": "string"
}
```

**Возвращаемые данные:** `204 NoContent`

### POST `/{id}/request-revision`

Запросить доработку.

**Параметры пути:** `id` (long)

**Входные данные:**

```json
{
  "comment": "string"
}
```

**Возвращаемые данные:** `204 NoContent`

---

## 9. Оценивание (Evaluation)

**Базовый путь:** `api/v1/evaluation`

### GET `/criteria`

Получить критерии оценивания.

**Параметры запроса (query):**

- `workTypeId` (int)
- `departmentId` (int, optional)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "workTypeId": 0,
    "departmentId": 0,
    "criteriaName": "string",
    "maxScore": 0,
    "weight": 0
  }
]
```

### GET `/schedule/{scheduleId}/grades`

Получить оценки защиты.

**Параметры пути:** `scheduleId` (long)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "scheduleId": 0,
    "memberId": 0,
    "criteriaId": 0,
    "score": 0,
    "comment": "string",
    "gradedAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST `/schedule/{scheduleId}/grades`

Подать оценку.

**Параметры пути:** `scheduleId` (long)

**Входные данные:**

```json
{
  "memberId": 0,
  "criteriaId": 0,
  "score": 0,
  "comment": "string"
}
```

**Возвращаемые данные:** `long` (Id)

### PUT `/schedule/{scheduleId}/finalize`

Завершить защиту.

**Параметры пути:** `scheduleId` (long)

**Возвращаемые данные:** `204 NoContent`

---

## 10. Институты (Institutes)

**Базовый путь:** `api/v1/institutes`

### GET `/`

Получить все институты.

**Параметры запроса (query):**

- `universityId` (int)
- `includeDepartments` (bool, optional)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "universityId": 0,
    "name": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": 0,
    "lastModifiedAt": "2024-01-01T00:00:00Z",
    "lastModifiedBy": 0,
    "departments": []
  }
]
```

### GET `/{instituteId}`

Получить институт по ID.

**Параметры пути:** `instituteId` (int)

**Параметры запроса (query):**

- `includeDepartments` (bool, optional)

**Возвращаемые данные:** `InstituteResponse`

### POST `/`

Создать институт.

**Входные данные:**

```json
{
  "universityId": 0,
  "name": "string"
}
```

**Возвращаемые данные:** `int` (Id)

### PUT `/{instituteId}`

Обновить институт.

**Параметры пути:** `instituteId` (int)

**Входные данные:**

```json
{
  "name": "string"
}
```

**Возвращаемые данные:** `204 NoContent`

### DELETE `/{instituteId}`

Удалить институт (soft delete).

**Параметры пути:** `instituteId` (int)

**Возвращаемые данные:** `204 NoContent`

---

## 11. Уведомления (Notifications)

**Базовый путь:** `api/v1/notifications`

### GET `/`

Получить уведомления пользователя.

**Параметры запроса (query):**

- `skip` (int, optional)
- `take` (int, optional)
- `onlyUnread` (bool, optional)

**Возвращаемые данные:**

```json
{
  "unreadCount": 0,
  "items": [
    {
      "id": 0,
      "userId": 0,
      "templateId": 0,
      "title": "string",
      "body": "string",
      "relatedEntityType": "string",
      "relatedEntityId": 0,
      "isRead": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "createdBy": 0,
      "lastModifiedAt": "2024-01-01T00:00:00Z",
      "lastModifiedBy": 0
    }
  ]
}
```

### GET `/unread-count`

Получить количество непрочитанных.

**Возвращаемые данные:** `int`

### PATCH `/{notificationId}/read`

Отметить как прочитанное.

**Параметры пути:** `notificationId` (long)

**Возвращаемые данные:** `204 NoContent`

### PATCH `/read-all`

Отметить все как прочитанные.

**Возвращаемые данные:** `204 NoContent`

---

## 12. Периоды workflow (Periods)

**Базовый путь:** `api/v1/departments/{departmentId}/periods`

### GET `/`

Получить периоды кафедры.

**Параметры пути:** `departmentId` (int)

**Параметры запроса (query):**

- `academicYearId` (int)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "departmentId": 0,
    "academicYearId": 0,
    "workflowStage": "string",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-01T00:00:00Z",
    "isActive": true,
    "isCurrentlyOpen": true
  }
]
```

### GET `/active`

Получить активный период.

**Параметры пути:** `departmentId` (int)

**Параметры запроса (query):**

- `academicYearId` (int)
- `stage` (string, optional) — если передан, вернуть период именно для этого этапа. Если не передан, вернуть любой текущий активный период.

**Возвращаемые данные:** `PeriodResponse`

### POST `/`

Создать период.

**Параметры пути:** `departmentId` (int)

**Входные данные:**

```json
{
  "departmentId": 0,
  "academicYearId": 0,
  "workflowStage": "string",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-01T00:00:00Z"
}
```

**Возвращаемые данные:** `int` (Id)

### PUT `/{periodId}`

Обновить период.

**Параметры пути:** `periodId` (int), `departmentId` (int)

**Входные данные:**

```json
{
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-01T00:00:00Z",
  "isActive": true
}
```

**Возвращаемые данные:** `204 NoContent`

### POST `/approve-initial`

Утвердить начальные сроки (создание направлений, тем, выбор тем) разом. Использует логику **upsert** (обновляет существующие этапы или создает новые).

**Описание:**

- Метод безопасен для повторного вызова.
- Если для указанного `workflowStage` период уже существует — будут обновлены даты `startDate`/`endDate`.
- Если не существует — будет создан новый период.
- Дубликаты этапов в теле запроса игнорируются (берется первый встреченный).

**Параметры пути:** `departmentId` (int)

**Параметры запроса (query):**

- `academicYearId` (int)

**Входные данные:**

```json
{
  "periods": [
    {
      "workflowStage": "DirectionSubmission",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Возвращаемые данные:** `204 NoContent`

---

## 13. Предзащиты (PreDefense)

**Базовый путь:** `api/v1/pre-defense`

### GET `/schedule`

Получить расписание предзащит.

**Параметры запроса (query):**

- `commissionId` (int)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "commissionId": 0,
    "workId": 0,
    "defenseDate": "2024-01-01T00:00:00Z",
    "location": "string",
    "averageScore": 0,
    "gradeCount": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET `/works/{workId}/attempts`

Получить попытки предзащиты.

**Параметры пути:** `workId` (long)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "workId": 0,
    "preDefenseNumber": 0,
    "scheduleId": 0,
    "attendanceStatus": "Attended",
    "averageScore": 0,
    "isPassed": true,
    "needsRetake": true,
    "attemptDate": "2024-01-01T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST `/works/{workId}/schedule`

Запланировать предзащиту.

**Параметры пути:** `workId` (long)

**Входные данные:**

```json
{
  "commissionId": 0,
  "defenseDate": "2024-01-01T00:00:00Z",
  "location": "string"
}
```

**Возвращаемые данные:** `long` (Id)

### PUT `/attempts/{attemptId}/attendance`

Записать посещаемость.

**Параметры пути:** `attemptId` (long)

**Входные данные:**

```json
{
  "attendanceStatus": "Attended",
  "isExcused": true
}
```

**Возвращаемые данные:** `204 NoContent`

### POST `/schedule/{scheduleId}/grades`

Подать оценку предзащиты.

**Параметры пути:** `scheduleId` (long)

**Входные данные:**

```json
{
  "memberId": 0,
  "criteriaId": 0,
  "score": 0,
  "comment": "string"
}
```

**Возвращаемые данные:** `long` (Id)

### PUT `/attempts/{attemptId}/finalize`

Завершить попытку предзащиты.

**Параметры пути:** `attemptId` (long)

**Входные данные:**

```json
{
  "averageScore": 0,
  "isPassed": true
}
```

**Возвращаемые данные:** `204 NoContent`

---

## 14. Протоколы (Protocols)

**Базовый путь:** `api/v1/protocols`

### GET `/{protocolId}`

Получить протокол по ID.

**Параметры пути:** `protocolId` (long)

**Возвращаемые данные:**

```json
{
  "id": 0,
  "scheduleId": 0,
  "commissionId": 0,
  "sessionDate": "2024-01-01T00:00:00Z",
  "documentPath": "string",
  "isFinalized": true,
  "finalizedBy": 0,
  "finalizedAt": "2024-01-01T00:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### POST `/`

Сгенерировать протокол.

**Входные данные:**

```json
{
  "scheduleId": 0,
  "commissionId": 0
}
```

**Возвращаемые данные:** `long` (Id)

---

## 15. Контроль качества (QualityChecks)

**Базовый путь:** `api/v1/quality-checks`

### GET `/by-work/{workId}`

Получить проверки работы.

**Параметры пути:** `workId` (long)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "workId": 0,
    "checkType": "NormControl",
    "attemptNumber": 0,
    "isPassed": true,
    "resultValue": 0,
    "comment": "string",
    "documentPath": "string",
    "assignedExpertId": 0,
    "checkedAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET `/pending`

Получить ожидающие проверки.

**Параметры запроса (query):**

- `departmentId` (int)
- `academicYearId` (int)
- `checkType` (int, optional)

**Возвращаемые данные:** `IReadOnlyList<QualityCheckDto>`

### POST `/works/{workId}/submit`

Отправить на проверку.

**Параметры пути:** `workId` (long)

**Входные данные:**

```json
{
  "checkType": "NormControl",
  "comment": "string"
}
```

**Возвращаемые данные:** `long` (Id)

### PUT `/works/{workId}/checks/{checkId}/record`

Записать результат проверки.

**Параметры пути:** `workId` (long), `checkId` (long)

**Входные данные:**

```json
{
  "isPassed": true,
  "resultValue": 0,
  "comment": "string",
  "documentPath": "string"
}
```

**Возвращаемые данные:** `long` (Id)

---

## 16. Рецензии (Reviews)

**Базовый путь:** `api/v1/works/{workId}/reviews`

### GET `/`

Получить все рецензии работы.

**Параметры пути:** `workId` (long)

**Возвращаемые данные:**

```json
{
  "supervisorReview": {
    "id": 0,
    "workId": 0,
    "supervisorId": 0,
    "reviewText": "string",
    "fileStoragePath": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": 0,
    "lastModifiedAt": "2024-01-01T00:00:00Z",
    "lastModifiedBy": 0
  },
  "reviews": [
    {
      "id": 0,
      "workId": 0,
      "reviewerId": 0,
      "reviewText": "string",
      "fileStoragePath": "string",
      "isUploaded": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "createdBy": 0,
      "lastModifiedAt": "2024-01-01T00:00:00Z",
      "lastModifiedBy": 0
    }
  ]
}
```

### POST `/supervisor`

Создать/обновить рецензию руководителя (multipart/form-data).

**Параметры пути:** `workId` (long)

**Входные данные (form-data):**

- `ReviewText` (string)
- `File` (IFormFile, optional)

**Возвращаемые данные:** `long` (Id)

### POST `/external/{reviewId}`

Загрузить внешнюю рецензию (multipart/form-data).

**Параметры пути:** `workId` (long), `reviewId` (long)

**Входные данные (form-data):**

- `ReviewText` (string, optional)
- `File` (IFormFile, optional)

**Возвращаемые данные:** `204 NoContent`

---

## 17. Преподаватели (Staff)

**Базовый путь:** `api/v1/staff`

### GET `/`

Получить преподавателей кафедры.

**Параметры запроса (query):**

- `departmentId` (int)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "userId": 0,
    "fullName": "string",
    "email": "string",
    "position": "string",
    "academicDegree": "string",
    "departmentId": 0,
    "departmentName": "string",
    "maxStudentsLoad": 0
  }
]
```

### GET `/supervisors`

Получить список утвержденных научных руководителей кафедры.

**Параметры запроса (query):**

- `departmentId` (int)

**Возвращаемые данные:** `IReadOnlyList<StaffResponse>` (см. схему StaffResponse)

### POST `/`

Создать преподавателя.

**Входные данные:**

```json
{
  "userId": 0,
  "departmentId": 0,
  "position": "string",
  "academicDegree": "string",
  "isSupervisor": true,
  "maxStudentsLoad": 5
}
```

**Возвращаемые данные:** `int` (Id)

### PUT `/{staffId}`

Обновить преподавателя.

**Параметры пути:** `staffId` (int)

**Входные данные:**

```json
{
  "position": "string",
  "academicDegree": "string",
  "maxStudentsLoad": 0,
  "isSupervisor": true,
  "departmentId": 0
}
```

**Возвращаемые данные:** `204 NoContent`

### PATCH `/{staffId}/workload`

Обновить только лимит нагрузки (количество студентов) преподавателя.

**Параметры пути:** `staffId` (int)

**Входные данные:**

```json
{
  "maxStudentsLoad": 0
}
```

**Возвращаемые данные:** `204 NoContent`

### POST `/approve-supervisors`

Утвердить преподавателей в качестве научных руководителей (полная замена состава кафедры).

**Описание:**
Заменяет весь список научных руководителей кафедры.

- Для `staffIds` в списке назначается роль "Supervisor".
- У остальных преподавателей этой кафедры, не вошедших в список, данная роль снимается.

**Входные данные:**

```json
{
  "departmentId": 0,
  "staffIds": [0]
}
```

**Возвращаемые данные:** `204 NoContent`

---

## 18. Студенты (Students)

**Базовый путь:** `api/v1/students`

### GET `/{studentId}`

Получить студента по ID.

**Параметры пути:** `studentId` (int)

**Возвращаемые данные:**

```json
{
  "id": 0,
  "userId": 0,
  "fullName": "string",
  "email": "string",
  "groupCode": "string",
  "programId": 0,
  "programName": "string",
  "admissionYear": 0,
  "currentCourse": 0,
  "status": "string"
}
```

### GET `/`

Получить студентов программы.

**Параметры запроса (query):**

- `programId` (int)

**Возвращаемые данные:** `IReadOnlyList<StudentResponse>`

### POST `/`

Создать студента.

**Входные данные:**

```json
{
  "userId": 0,
  "programId": 0,
  "admissionYear": 0,
  "currentCourse": 0,
  "groupCode": "string"
}
```

**Возвращаемые данные:** `int` (Id)

### PUT `/{studentId}`

Обновить студента.

**Параметры пути:** `studentId` (int)

**Входные данные:**

```json
{
  "programId": 0,
  "groupCode": "string",
  "currentCourse": 0
}
```

**Возвращаемые данные:** `204 NoContent`

---

## 19. Дипломные работы (StudentWorks)

**Базовый путь:** `api/v1/works`

### GET `/supervisor/{supervisorId}`

Получить работы руководителя.

**Параметры пути:** `supervisorId` (int)

**Параметры запроса (query):**

- `academicYearId` (int, optional)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "topicId": 0,
    "academicYearId": 0,
    "departmentId": 0,
    "currentStateId": 0,
    "isDefended": true,
    "finalGrade": "string",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET `/{id}`

Получить работу по ID.

**Параметры пути:** `id` (long)

**Возвращаемые данные:**

```json
{
  "id": 0,
  "topicId": 0,
  "academicYearId": 0,
  "departmentId": 0,
  "currentStateId": 0,
  "isDefended": true,
  "finalGrade": "string",
  "createdAt": "2024-01-01T00:00:00Z",
  "createdBy": 0,
  "lastModifiedAt": "2024-01-01T00:00:00Z",
  "lastModifiedBy": 0,
  "participants": [
    {
      "id": 0,
      "studentId": 0,
      "role": "Leader",
      "isLeader": true,
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET `/by-department`

Получить работы кафедры.

**Параметры запроса (query):**

- `departmentId` (int)
- `academicYearId` (int)

**Возвращаемые данные:** `IReadOnlyList<StudentWorkResponse>`

### GET `/my`

Получить мои работы.

**Возвращаемые данные:** `IReadOnlyList<StudentWorkResponse>`

### POST `/`

Создать работу.

> **Важно:** `studentId` — это `Edu.Students.Id` (из таблицы `Students`), **не** `Auth.Users.Id`. Используйте `/api/v1/students` или `GET /api/v1/users/me` (поле `studentId`) для получения корректного значения.

**Входные данные:**

```json
{
  "topicId": 0,
  "academicYearId": 0,
  "departmentId": 0,
  "studentId": 0
}
```

**Возвращаемые данные:** `long` (Id)

### POST `/{workId}/participants`

Добавить участника.

**Параметры пути:** `workId` (long)

**Входные данные:**

```json
{
  "studentId": 0,
  "role": "Leader"
}
```

**Возвращаемые данные:** `long` (Id)

### DELETE `/{workId}/participants/{studentId}`

Удалить участника.

**Параметры пути:** `workId` (long), `studentId` (int)

**Возвращаемые данные:** `204 NoContent`

---

## 20. Заявки на темы (TopicApplications)

**Базовый путь:** `api/v1/applications`

### POST `/`

Создать заявку на тему.

**Входные данные:**

```json
{
  "topicId": 0,
  "motivationLetter": "string"
}
```

**Возвращаемые данные:** `long` (Id)

### GET `/by-topic/{topicId}`

Получить заявки темы.

**Параметры пути:** `topicId` (long)

**Параметры запроса (query):**

- `status` (string, optional)

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "topicId": 0,
    "studentId": 0,
    "motivationLetter": "string",
    "appliedAt": "2024-01-01T00:00:00Z",
    "status": "Pending",
    "isPending": true,
    "isAccepted": true,
    "reviewedAt": "2024-01-01T00:00:00Z",
    "reviewedBy": 0,
    "reviewComment": "string"
  }
]
```

### GET `/my`

Получить мои заявки.

**Параметры запроса (query):**

- `academicYearId` (int, optional)

**Возвращаемые данные:** `IReadOnlyList<TopicApplicationResponse>`

### POST `/{applicationId}/accept`

Принять заявку.

**Параметры пути:** `applicationId` (long)

**Возвращаемые данные:** `204 NoContent`

### POST `/{applicationId}/reject`

Отклонить заявку.

**Параметры пути:** `applicationId` (long)

**Входные данные:**

```json
{
  "rejectReason": "string"
}
```

**Возвращаемые данные:** `204 NoContent`

### DELETE `/{applicationId}`

Отозвать заявку.

**Параметры пути:** `applicationId` (long)

**Возвращаемые данные:** `204 NoContent`

---

## 21. Темы дипломных работ (Topics)

**Базовый путь:** `api/v1/topics`

### GET `/{id}`

Получить тему по ID.

**Параметры пути:** `id` (long)

**Возвращаемые данные:**

```json
{
  "id": 0,
  "directionId": 0,
  "departmentId": 0,
  "supervisorId": 0,
  "academicYearId": 0,
  "workTypeId": 0,
  "titleRu": "string",
  "titleEn": "string",
  "titleKz": "string",
  "descriptionRu": "string",
  "descriptionKz": "string",
  "descriptionEn": "string",
  "maxParticipants": 0,
  "availableSpots": 0,
  "isApproved": true,
  "isClosed": true,
  "isTeamTopic": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "createdBy": 0,
  "lastModifiedAt": "2024-01-01T00:00:00Z",
  "lastModifiedBy": 0,
  "applications": []
}
```

### GET `/available`

Получить доступные темы. Если параметры не указаны, данные подставляются автоматически из контекста текущего пользователя (JWT).

**Параметры запроса (query):**

- `departmentId` (int, optional) - ID кафедры. Если не указан, берется из текущей роли пользователя.
- `academicYearId` (int, optional) - ID учебного года. Если не указан, берется текущий активный год университета.

**Возвращаемые данные:**

```json
[
  {
    "id": 0,
    "directionId": 0,
    "departmentId": 0,
    "supervisorId": 0,
    "academicYearId": 0,
    "workTypeId": 0,
    "titleRu": "string",
    "titleEn": "string",
    "titleKz": "string",
    "maxParticipants": 0,
    "availableSpots": 0,
    "isApproved": true,
    "isClosed": true,
    "isTeamTopic": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET `/by-direction/{directionId}`

Получить темы направления.

**Параметры пути:** `directionId` (long)

**Возвращаемые данные:** `IReadOnlyList<TopicResponse>`

### POST `/`

Создать тему.

**Входные данные:**

```json
{
  "departmentId": 0,
  "supervisorId": 0,
  "academicYearId": 0,
  "workTypeId": 0,
  "directionId": 0,
  "titleRu": "string",
  "titleKz": "string",
  "titleEn": "string",
  "descriptionRu": "string",
  "descriptionKz": "string",
  "descriptionEn": "string",
  "maxParticipants": 1
}
```

**Возвращаемые данные:** `long` (Id)

### PUT `/{id}`

Обновить тему.

**Параметры пути:** `id` (long)

**Входные данные:**

```json
{
  "titleRu": "string",
  "titleKz": "string",
  "titleEn": "string",
  "descriptionRu": "string",
  "descriptionKz": "string",
  "descriptionEn": "string",
  "maxParticipants": 0
}
```

**Возвращаемые данные:** `204 NoContent`

### POST `/{id}/approve`

Утвердить тему.

**Параметры пути:** `id` (long)

**Возвращаемые данные:** `204 NoContent`

### POST `/{id}/close`

Закрыть тему.

**Параметры пути:** `id` (long)

**Возвращаемые данные:** `204 NoContent`

### POST `/{id}/deactivate`

Деактивировать тему без привязанных студентов (действие кафедры).

**Параметры пути:** `id` (long)

**Возвращаемые данные:** `204 NoContent`

### POST `/submit-for-approval`

Пакетная подача тем на утверждение (действие руководителя).

**Входные данные:**

```json
{
  "topicIds": [0]
}
```

**Возвращаемые данные:** `204 NoContent`

### POST `/bulk-approve`

Пакетное утверждение тем (действие кафедры).

**Входные данные:**

```json
{
  "topicIds": [0]
}
```

**Возвращаемые данные:** `204 NoContent`

### GET `/coordination-summary`

Получить сводку по координации тем кафедры: статистику по заявкам, занятые и свободные места.

**Параметры запроса (query):**

- `departmentId` (int)
- `academicYearId` (int)

**Возвращаемые данные:**

```json
{
  "totalTopics": 0,
  "approvedTopics": 0,
  "topicsWithStudents": 0,
  "topicsWithoutStudents": 0,
  "closedTopics": 0,
  "totalAcceptedApplications": 0,
  "totalAvailableSpots": 0,
  "topics": [
    {
      "topicId": 0,
      "titleRu": "string",
      "supervisorId": 0,
      "maxParticipants": 0,
      "acceptedCount": 0,
      "pendingCount": 0,
      "availableSpots": 0,
      "isApproved": true,
      "isClosed": true
    }
  ]
}
```

### POST `/complete-coordination`

Завершить координацию тем кафедры: закрывает все открытые темы, отклоняет ожидающие заявки, уведомляет участников.

**Входные данные:**

```json
{
  "departmentId": 0,
  "academicYearId": 0
}
```

**Возвращаемые данные:** `204 NoContent`

---

## 22. Типы работ (WorkTypes)

**Базовый путь:** `api/v1/WorkTypes`

### GET `/`

Получить список всех типов работ (дипломная, магистерская и т.д.). Используется для маппинга ID на названия на фронтенде.

**Возвращаемые данные:**

```json
[
  {
    "id": 1,
    "name": "CourseWork",
    "degreeLevelId": null
  },
  {
    "id": 2,
    "name": "DiplomaWork",
    "degreeLevelId": 1
  }
]
```

---

## 23. Пользователи (Users)

**Базовый путь:** `api/v1/Users`

### GET `/me`

Получить профиль текущего пользователя со всеми привязками (кафедра, год, группа).

**Возвращаемые данные:**

```json
{
  "userId": 9,
  "login": "student1",
  "email": "student1@test.edu",
  "roles": ["Student"],
  "departmentId": 1,
  "departmentName": "Компьютерные науки",
  "instituteId": 1,
  "instituteName": "Институт информационных технологий",
  "currentAcademicYearId": 1,
  "currentAcademicYearName": "2025-2026",
  "studentId": 1,
  "groupCode": "CS-22-1"
}
```

---

## 23. Пользователи (Users)

**Базовый путь:** `api/v1/users`

### GET `/me`

Получить полный профиль авторизованного пользователя.

**Возвращаемые данные:**

```json
{
  "userId": 0,
  "login": "string",
  "email": "string",
  "roles": ["string"],
  "departmentId": 0,
  "departmentName": "string",
  "instituteId": 0,
  "instituteName": "string",
  "currentAcademicYearId": 0,
  "currentAcademicYearName": "string",
  "staffId": 0,
  "position": "string",
  "academicDegree": "string",
  "isSupervisor": true,
  "studentId": 0,
  "groupCode": "string"
}
```

---

## Сводная таблица всех endpoints

| Контроллер | Кол-во endpoints | Основные операции |
|------------|------------------|-------------------|
| Auth | 2 | Login, Register |
| AcademicPrograms | 3 | CRUD программ |
| Attachments | 5 | CRUD файлов |
| Commissions | 6 | CRUD комиссий + члены |
| DefenseSchedule | 5 | Расписание ГАК |
| DegreeLevels | 2 | Уровни образования |
| Departments | 4 | CRUD кафедр |
| Directions | 9 | Направления + workflow |
| Evaluation | 4 | Оценивание + критерии |
| Institutes | 5 | CRUD институтов |
| Notifications | 4 | Уведомления |
| Periods | 4 | Периоды workflow |
| PreDefense | 6 | Предзащиты |
| Protocols | 2 | Протоколы |
| QualityChecks | 4 | Контроль качества |
| Reviews | 3 | Рецензии |
| Staff | 4 | Преподаватели |
| Students | 4 | Студенты |
| StudentWorks | 7 | Работы + участники |
| TopicApplications | 6 | Заявки на темы |
| Topics | 12 | Темы + workflow + координация |
| WorkTypes | 1 | Словарь типов работ |
| Users | 1 | Профиль текущего пользователя |

**Итого: ~108 API endpoints**

---

## Перечисления (Enums)

### AttachmentType

- `0` - Draft
- `1` - Final
- `2` - Presentation
- `3` - Software

### CommissionType

- `0` - PreDefense
- `1` - GAK

### RoleInCommission

- `0` - Member
- `1` - Chairman
- `2` - Secretary

### AttendanceStatus

- `0` - Attended
- `1` - Absent
- `2` - Excused

### ParticipantRole

- `Leader`
- `Member`

### CheckType

- `0` - NormControl
- `1` - SoftwareCheck
- `2` - AntiPlagiarism

### WorkflowStage

- Определяет этап workflow дипломной работы

---

## Архитектурные особенности

1. **Версионирование API:** Используется URL версионирование (`v{version:apiVersion}`)
2. **CQRS паттерн:** Все контроллеры используют MediatR ISender
3. **Авторизация:** Атрибуты `[RequirePermission]` и `[RequireDepartmentPermission]`
4. **DTO разделение:** Отдельные модели для Request и Response
5. **Mapster:** Автоматическое маппирование между DTO и доменными моделями
6. **Soft Delete:** Поддержка мягкого удаления сущностей
7. **Workflow:** Система состояний и переходов для дипломных работ
