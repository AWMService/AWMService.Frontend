---
stage_id: 2
stage_key: initial_periods_approval
frontend_route: /workflow/periods/initial
source_stage_title: "Этап Утверждение периодов формирование направлений, тем, выбора тем студентами"
---

# Этап 2. Утверждение начальных периодов

## Цель этапа

Кафедра задает окна дат для:
- формирования направлений;
- формирования тем;
- выбора тем студентами.

## Роли и интерфейсы

- Кафедра: страница `Периоды и сроки`.
- Кафедра: форма с тремя диапазонами дат.

## API для интеграции

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/api/v{version}/Users/me` | Получить `DepartmentId`, `CurrentAcademicYearId`. |
| GET | `/api/v{version}/departments/{departmentId}/Periods?academicYearId={id}` | Получить сохраненные периоды. |
| GET | `/api/v{version}/departments/{departmentId}/Periods/active?academicYearId={id}&stage={stage}` | Проверка текущего открытого этапа. |
| POST | `/api/v{version}/departments/{departmentId}/Periods/approve-initial?academicYearId={id}` | Массово утвердить стартовые периоды (`ApproveInitialPeriodsRequest`). |
| PUT | `/api/v{version}/departments/{departmentId}/Periods/{periodId}` | Точечная правка периода при необходимости. |

### Request schema

`ApproveInitialPeriodsRequest`
- `Periods: IReadOnlyList<PeriodDto>`

## Детальные требования к фронтенду

1. В форме хранить три обязательных диапазона дат.
2. До отправки валидировать порядок: период направлений <= период тем <= период выбора тем (без конфликтов).
3. На submit собирать единый payload `ApproveInitialPeriodsRequest`.
4. После сохранения показывать summary карточку с актуальными периодами.
5. Блокировать редактирование для пользователей без роли кафедры.

## Бизнес-правила и валидации

- В каждом диапазоне `StartDate <= EndDate`.
- Пустые даты запрещены.
- Периоды разных этапов не должны пересекаться.
- Для выбранного учебного года должен существовать ровно один активный период на этап.

## API Gap / Уточнение

- В документации не раскрыт полный enum `WorkflowStage`. Нужна фиксация backend-значений для этапов:
  `Directions`, `Topics`, `TopicSelection` (рабочая гипотеза).

## Чек-лист делегирования (для сокомандника)

1. Реализовать форму периодов с date-range picker.
2. Подключить чтение текущих периодов и отображение active stage.
3. Реализовать submit в `approve-initial`.
4. Добавить клиентскую валидацию конфликтов дат.
5. Добавить тесты на невалидные диапазоны и успешное сохранение.

## Definition of Done

- Кафедра может сохранить и переоткрыть страницу без потери данных.
- Ошибочные диапазоны не отправляются в API.
- Активные периоды корректно отображаются в UI.
