# Frontend Workflow Docs (v2)

Этот набор файлов разбивает `docs/Воркфлоу_версия_2.txt` на этапы и связывает каждый этап с API из:
- `docs/API_Documentation.md`
- `docs/api_endpoints.md`
- `docs/ТЗ_текст.txt`

## Как использовать для фронтенда

1. В коде фронтенда хранить `stage_key`.
2. Для каждого `stage_key` открывать соответствующий `.md` (через меню, help-link, onboarding).
3. Использовать разделы `API`, `Валидации`, `Чек-лист делегирования` как source of truth для задач команды.

## Карта этапов

| Этап | stage_key | Файл | Рекомендуемый route | Основные роли |
| --- | --- | --- | --- | --- |
| 1 | `supervisors_approval` | [01_supervisors_approval.md](01_supervisors_approval.md) | `/workflow/supervisors` | Кафедра |
| 2 | `initial_periods_approval` | [02_initial_periods.md](02_initial_periods.md) | `/workflow/periods/initial` | Кафедра |
| 3 | `directions_formation` | [03_directions.md](03_directions.md) | `/workflow/directions` | НР, Кафедра |
| 4 | `topics_formation` | [04_topics_creation.md](04_topics_creation.md) | `/workflow/topics` | НР |
| 5 | `student_topic_selection` | [05_student_topic_selection.md](05_student_topic_selection.md) | `/workflow/topic-selection` | Студент, НР |
| 6 | `topic_coordination` | [06_topic_coordination.md](06_topic_coordination.md) | `/workflow/topic-coordination` | Кафедра |
| 7 | `defense_periods_and_assignments` | [07_defense_periods_and_assignments.md](07_defense_periods_and_assignments.md) | `/workflow/defense-setup` | Кафедра |
| 8 | `predefense` | [08_predefense.md](08_predefense.md) | `/workflow/pre-defense` | Студент, Комиссия, Секретарь |
| 9 | `quality_checks` | [09_quality_checks.md](09_quality_checks.md) | `/workflow/quality-checks` | Студент, Эксперты, Кафедра |
| 10 | `defense_preparation` | [10_defense_preparation.md](10_defense_preparation.md) | `/workflow/defense-preparation` | Кафедра |
| 11 | `defense` | [11_defense.md](11_defense.md) | `/workflow/defense` | Студент, ГАК, Секретарь |

## JSON-карта для быстрых ссылок

```json
[
  {"stageKey":"supervisors_approval","doc":"docs/frontend_workflow_stages/01_supervisors_approval.md","route":"/workflow/supervisors"},
  {"stageKey":"initial_periods_approval","doc":"docs/frontend_workflow_stages/02_initial_periods.md","route":"/workflow/periods/initial"},
  {"stageKey":"directions_formation","doc":"docs/frontend_workflow_stages/03_directions.md","route":"/workflow/directions"},
  {"stageKey":"topics_formation","doc":"docs/frontend_workflow_stages/04_topics_creation.md","route":"/workflow/topics"},
  {"stageKey":"student_topic_selection","doc":"docs/frontend_workflow_stages/05_student_topic_selection.md","route":"/workflow/topic-selection"},
  {"stageKey":"topic_coordination","doc":"docs/frontend_workflow_stages/06_topic_coordination.md","route":"/workflow/topic-coordination"},
  {"stageKey":"defense_periods_and_assignments","doc":"docs/frontend_workflow_stages/07_defense_periods_and_assignments.md","route":"/workflow/defense-setup"},
  {"stageKey":"predefense","doc":"docs/frontend_workflow_stages/08_predefense.md","route":"/workflow/pre-defense"},
  {"stageKey":"quality_checks","doc":"docs/frontend_workflow_stages/09_quality_checks.md","route":"/workflow/quality-checks"},
  {"stageKey":"defense_preparation","doc":"docs/frontend_workflow_stages/10_defense_preparation.md","route":"/workflow/defense-preparation"},
  {"stageKey":"defense","doc":"docs/frontend_workflow_stages/11_defense.md","route":"/workflow/defense"}
]
```

## Общие правила для всех этапов

- Перед любым этапом брать контекст пользователя через `GET /api/v{version}/Users/me`.
- Для ролевого UI использовать `Roles` из `UserProfileResponse`.
- Для уведомлений использовать `GET /Notifications`, `GET /Notifications/unread-count`, `PATCH /Notifications/{id}/read`.
- Все формы с датами валидировать на `StartDate <= EndDate`.
- Все операции утверждения/финализации делать через явное confirm modal.

## Шаблон делегирования задачи

1. `Scope`: какой stage-файл реализуем.
2. `UI`: какие экраны/модалки/таблицы.
3. `API`: конкретные endpoint + request schema.
4. `State`: какие статусы и переходы.
5. `DoD`: какие сценарии считаются завершенными.

## Важные допущения

- Названия `WorkflowStage` и enum-значения не расшифрованы в явном виде в документации. В stage-файлах указаны ожидаемые значения как рабочая гипотеза, их нужно подтвердить у backend.
- Часть бизнес-действий из воркфлоу (например, некоторые комментарии при согласовании тем) не имеет отдельного endpoint в текущем API; эти места отмечены как `API Gap`.
