---
stage_id: 6
stage_key: topic_coordination
frontend_route: /workflow/topic-coordination
source_stage_title: "Этап Согласование тем"
---

# Этап 6. Согласование тем

## Цель этапа

Кафедра проводит массовое согласование тем, закрывает проблемные кейсы и завершает этап распределения.

## Роли и интерфейсы

- Кафедра: страница `Согласование тем`.
- Кафедра: таблица с групповыми фильтрами и массовыми действиями.

## API для интеграции

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/api/v{version}/Topics/coordination-summary?departmentId={id}&academicYearId={id}` | Сводка по темам и заявкам. |
| POST | `/api/v{version}/Topics/bulk-approve` | Массово утвердить выбранные темы. |
| POST | `/api/v{version}/Topics/complete-coordination` | Завершить этап согласования. |
| POST | `/api/v{version}/Topics/{id}/deactivate` | Пометить тему как неактуальную/исключить. |
| POST | `/api/v{version}/Topics/{id}/close` | Закрыть тему для новых заявок. |

### Request schema

`BulkApproveTopicsRequest`
- `TopicIds: IReadOnlyList<long>`

`CompleteTopicCoordinationRequest`
- `DepartmentId: int`
- `AcademicYearId: int`

## Детальные требования к фронтенду

1. Сводка сверху: `TotalTopics`, `TopicsWithStudents`, `TopicsWithoutStudents`, `TotalAcceptedApplications`.
2. В таблице тем поддержать множественный выбор чекбоксами.
3. Массовое действие `Утвердить выбранные темы` отправляет `TopicIds`.
4. Для проблемных тем дать явные действия: `close` или `deactivate`.
5. Кнопка `Завершить согласование` доступна только кафедре и требует confirm.

## Бизнес-правила и валидации

- Нельзя завершить этап без подтверждения пользователя.
- Массовое утверждение требует непустого списка.
- После `complete-coordination` редактирование состава участников блокируется на уровне UI.

## API Gap / Уточнение

- В воркфлоу есть кейс `направить НР на окончательный выбор` и `доработка с комментариями`.
  Отдельных API для комментария в этапе согласования нет, нужен доп. endpoint или workaround.

## Чек-лист делегирования (для сокомандника)

1. Реализовать summary + таблицу с фильтрами.
2. Подключить bulk approve.
3. Подключить close/deactivate для проблемных тем.
4. Подключить complete-coordination с confirm modal.
5. Добавить тесты на массовые операции и защиту от пустых payload.

## Definition of Done

- Кафедра может массово согласовывать темы.
- Проблемные темы обрабатываются без ручной админки.
- Завершение этапа переводит процесс в следующую фазу без UI-рассинхрона.
