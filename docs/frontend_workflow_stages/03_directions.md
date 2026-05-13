---
stage_id: 3
stage_key: directions_formation
frontend_route: /workflow/directions
source_stage_title: "Этап Формирование направлений ДП/ДР"
---

# Этап 3. Формирование направлений ДП/ДР

## Цель этапа

НР создают направления исследований, кафедра рассматривает их и переводит в нужный статус.

## Роли и интерфейсы

- НР: страница `Мои направления`.
- Кафедра: страница `Направления ДП/ДР` с фильтрами по статусам.
- Обе роли: модалка просмотра деталей направления.

## API для интеграции

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/api/v{version}/Directions/by-supervisor` | Список направлений НР. |
| GET | `/api/v{version}/Directions/by-department` | Список направлений кафедры (review queue). |
| GET | `/api/v{version}/Directions/{id}` | Детальная карточка направления. |
| POST | `/api/v{version}/Directions` | Создание направления (`CreateDirectionRequest`). |
| PUT | `/api/v{version}/Directions/{id}` | Редактирование направления (`UpdateDirectionRequest`). |
| POST | `/api/v{version}/Directions/{id}/submit` | Отправить направление на рассмотрение. |
| POST | `/api/v{version}/Directions/{id}/approve` | Утвердить направление кафедрой. |
| POST | `/api/v{version}/Directions/{id}/reject` | Отклонить направление (`RejectDirectionRequest`). |
| POST | `/api/v{version}/Directions/{id}/request-revision` | Вернуть на доработку (`RequestRevisionRequest`). |

### Request schema (ключевые)

`CreateDirectionRequest`
- `DepartmentId`, `SupervisorId`, `AcademicYearId`, `WorkTypeId`
- `TitleRu`, `TitleKz?`, `TitleEn?`, `Description?`

`RequestRevisionRequest`
- `Comment: string` (обязателен)

## Детальные требования к фронтенду

1. Для НР: форма создания с мультиязычными полями и описанием.
2. Для кафедры: табы/фильтры по статусам `На рассмотрении`, `Утверждено`, `Отклонено`, `Требует доработки`.
3. Для action-кнопок кафедры:
   `Утвердить`, `Отклонить`, `Требует доработки`.
4. При `request-revision` требовать комментарий.
5. Отдельно подсвечивать направления, требующие доработки.

## Бизнес-правила и валидации

- `TitleRu` обязателен.
- Редактирование НР допустимо до финального решения кафедры.
- После `approve` направление должно стать доступным для создания тем.

## Чек-лист делегирования (для сокомандника)

1. Сделать два режима экрана: НР и кафедра.
2. Подключить CRUD + submit для НР.
3. Подключить review-actions кафедры.
4. Реализовать статусы и цветовые индикаторы.
5. Проверить сценарии: approve, reject, request-revision.

## Definition of Done

- НР создает и отправляет направление без ручных SQL/админ-операций.
- Кафедра может принять любое решение и НР видит обновленный статус.
- Комментарий доработки отображается в карточке направления.
