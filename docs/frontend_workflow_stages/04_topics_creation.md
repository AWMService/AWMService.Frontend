---
stage_id: 4
stage_key: topics_formation
frontend_route: /workflow/topics
source_stage_title: "Этап Формирование Тем ДП/ДР"
---

# Этап 4. Формирование тем ДП/ДР

## Цель этапа

НР создают темы в рамках утвержденных направлений и отправляют пакет тем на утверждение кафедры.

## Роли и интерфейсы

- НР: страница `Мои темы`.
- НР: модалка `Создать/Редактировать тему`.
- НР: блок пакетной отправки тем на утверждение.

## API для интеграции

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/api/v{version}/Directions/by-supervisor` | Получить направления НР для выбора. |
| GET | `/api/v{version}/Topics/by-direction/{directionId}` | Список тем по направлению. |
| GET | `/api/v{version}/Topics/{id}` | Детали темы. |
| POST | `/api/v{version}/Topics` | Создать тему (`CreateTopicRequest`). |
| PUT | `/api/v{version}/Topics/{id}` | Редактировать тему (`UpdateTopicRequest`). |
| POST | `/api/v{version}/Topics/submit-for-approval` | Пакетная отправка тем (`SubmitTopicsForApprovalRequest`). |
| GET | `/api/v{version}/WorkTypes` | Справочник типов работ. |

### Request schema (ключевые)

`CreateTopicRequest`
- `DepartmentId`, `SupervisorId`, `AcademicYearId`, `WorkTypeId`
- `DirectionId?`, `TitleRu`, `TitleKz?`, `TitleEn?`
- `Description?`, `MaxParticipants`

`SubmitTopicsForApprovalRequest`
- `TopicIds: IReadOnlyList<long>`

## Детальные требования к фронтенду

1. В форме темы показывать выбор направления только из утвержденных.
2. Поддержать значения `MaxParticipants`: `1` (индивидуальная) и `2-3` (командная).
3. До отправки пакета показывать, какие темы войдут в submit.
4. После `submit-for-approval` блокировать редактирование отправленных тем до решения кафедры.
5. На карточках тем показывать признаки: `isApproved`, `isClosed`, `availableSpots`.

## Бизнес-правила и валидации

- Обязателен `TitleRu`.
- `MaxParticipants >= 1`.
- Отправлять на утверждение можно только созданные темы текущего НР.

## API Gap / Уточнение

- В воркфлоу есть статус `Черновик`; в API явного поля `Draft` нет.
  Рабочая модель: тема считается черновиком, пока не отправлена/не утверждена.

## Чек-лист делегирования (для сокомандника)

1. Реализовать форму темы с мультиязычными полями.
2. Подключить список тем по направлению.
3. Сделать мультивыбор и submit-for-approval.
4. Добавить валидацию `MaxParticipants` и обязательных полей.
5. Прогнать сценарии редактирования до/после отправки.

## Definition of Done

- НР может создать несколько тем и пакетно отправить на согласование.
- Состояние тем после отправки корректно отражается в UI.
- Нет возможности отправить пустой пакет или невалидные темы.
