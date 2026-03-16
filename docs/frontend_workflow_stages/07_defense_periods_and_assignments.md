---
stage_id: 7
stage_key: defense_periods_and_assignments
frontend_route: /workflow/defense-setup
source_stage_title: "Этап Утверждение периодов Предзащит, проверок и защиты"
---

# Этап 7. Периоды предзащит, проверок и защиты

## Цель этапа

Кафедра настраивает календарь предзащит/защиты, комиссии, распределение студентов, экспертов и рецензентов.

## Роли и интерфейсы

- Кафедра: страница `Периоды защит и проверок`.
- Кафедра: разделы `Комиссии`, `Распределение`, `Эксперты`, `Рецензенты`.

## API для интеграции

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| POST | `/api/v{version}/departments/{departmentId}/Periods/approve-defense?academicYearId={id}` | Утвердить периоды предзащит/проверок/защиты. |
| GET | `/api/v{version}/commissions?departmentId={id}&academicYearId={id}` | Список комиссий. |
| POST | `/api/v{version}/commissions` | Создать комиссию (`CreateCommissionRequest`). |
| PUT | `/api/v{version}/commissions/{id}` | Обновить комиссию. |
| POST | `/api/v{version}/commissions/{id}/members` | Добавить члена комиссии (`AddCommissionMemberRequest`). |
| DELETE | `/api/v{version}/commissions/{id}/members/{memberId}` | Удалить члена комиссии. |
| POST | `/api/v{version}/pre-defense/distribute` | Автораспределение студентов по комиссиям. |
| POST | `/api/v{version}/pre-defense/generate-slots` | Генерация слотов предзащиты. |
| POST | `/api/v{version}/quality-checks/assign-experts` | Назначить экспертов по проверкам. |
| POST | `/api/v{version}/works/{workId}/assign-reviewer` | Назначить рецензента работе. |

### Request schema (ключевые)

`CreateCommissionRequest`
- `DepartmentId`, `AcademicYearId`, `CommissionType`, `Name?`, `PreDefenseNumber?`

`AssignExpertsRequest`
- `DepartmentId`
- `Assignments: [{ UserId, ExpertiseType }]`

`ApproveDefensePeriodsRequest`
- `Periods: IReadOnlyList<PeriodDto>`

## Детальные требования к фронтенду

1. На форме периодов поддержать отдельные блоки: `Предзащита 1`, `Предзащита 2`, `Защита`.
2. Для комиссий предзащиты использовать `CommissionType = PreDefense`.
3. Поддержать добавление ролей в комиссии: председатель, член, секретарь.
4. Для распределения студентов дать кнопку авто-распределения + ручную корректировку.
5. Для экспертов предусмотреть раздельные назначения по типам:
   `NormControl`, `SoftwareCheck`, `AntiPlagiarism`.
6. Назначение рецензента должно быть связано с конкретной работой (`workId`).

## Бизнес-правила и валидации

- В комиссии предзащиты минимум 1 председатель и 1 секретарь.
- Даты расписаний должны лежать внутри утвержденных периодов.
- Один эксперт может быть назначен на несколько типов проверок только по решению кафедры.

## API Gap / Уточнение

- В воркфлоу есть ввод внешних данных рецензента (организация, контакты).
  В текущем API это не отдельная сущность; требуется уточнить источник `ReviewerId`.

## Чек-лист делегирования (для сокомандника)

1. Собрать UI конфигуратора периодов и комиссий.
2. Подключить API комиссий и управление составом.
3. Подключить авто-распределение и генерацию слотов.
4. Реализовать назначение экспертов и рецензентов.
5. Добавить проверки валидности дат и состава комиссий.

## Definition of Done

- Кафедра может полностью настроить этапы предзащит/проверок/защиты через UI.
- Все назначения сохраняются через API и корректно перечитываются.
- Валидации защищают от некорректных периодов и пустых комиссий.
