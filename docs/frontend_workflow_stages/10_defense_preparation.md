---
stage_id: 10
stage_key: defense_preparation
frontend_route: /workflow/defense-preparation
source_stage_title: "10. Этап Подготовка к защите"
---

# Этап 10. Подготовка к защите

## Цель этапа

Проверить готовность студентов, сформировать допуск, создать ГАК и расписание защиты.

## Роли и интерфейсы

- Кафедра: страница `Готовность к защите`.
- Кафедра: модалки `Создать комиссию ГАК`, `Утвердить расписание`.

## API для интеграции

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/api/v{version}/works/defense-readiness?departmentId={id}&academicYearId={id}` | Сводка готовности по этапам. |
| POST | `/api/v{version}/works/send-readiness-reminders` | Персонализированные напоминания. |
| GET | `/api/v{version}/works/admitted-students?departmentId={id}&academicYearId={id}` | Список допущенных к защите. |
| POST | `/api/v{version}/commissions` | Создать комиссию ГАК (`CommissionType = GAK`). |
| POST | `/api/v{version}/defense-schedule` | Создать базовый слот/запись расписания. |
| POST | `/api/v{version}/defense-schedule/generate-slots` | Массово сгенерировать слоты защиты. |
| POST | `/api/v{version}/defense-schedule/{scheduleId}/assign` | Закрепить работу за слотом. |
| PUT | `/api/v{version}/defense-schedule/{scheduleId}` | Корректировка даты/места. |
| PUT | `/api/v{version}/defense-schedule/{scheduleId}/start-reconciliation` | Предварительное согласование расписания. |
| GET | `/api/v{version}/defense-schedule?commissionId={id}` | Проверка итогового расписания. |

### Request schema (ключевые)

`SendReadinessRemindersRequest`
- `DepartmentId: int`
- `AcademicYearId: int`

`GenerateDefenseSlotsRequest`
- `CommissionId`, `Date`, `StartTime`, `EndTime`, `SlotDurationMinutes`, `Location?`

## Детальные требования к фронтенду

1. На readiness-экране показывать флаги:
   `PreDefensePassed`, `NormControlPassed`, `SoftwareCheckPassed`, `AntiPlagiarismPassed`, `HasReview`.
2. Для неготовых студентов поддержать массовую отправку напоминаний.
3. Для ГАК использовать отдельный мастер создания комиссии.
4. Для расписания защиты поддержать:
   генерацию слотов, drag/drop распределение студентов, ручную правку времени/локации.
5. Перед финальным утверждением показывать конфликт-детектор по слотам.

## Бизнес-правила и валидации

- В расписание допускаются только студенты из `admitted-students`.
- Защиты должны лежать в пределах утвержденного периода защиты.
- Один студент не может быть назначен в два слота одновременно.

## Чек-лист делегирования (для сокомандника)

1. Реализовать readiness dashboard и фильтры.
2. Подключить reminders и admitted-students.
3. Реализовать мастер создания комиссии ГАК.
4. Реализовать конфигуратор слотов защиты и назначение студентов.
5. Добавить тесты на конфликты расписания.

## Definition of Done

- Кафедра видит полную картину готовности.
- Список допущенных формируется и используется при планировании.
- Расписание защиты можно утвердить без ручных правок в backend.
