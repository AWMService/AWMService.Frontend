---
stage_id: 8
stage_key: predefense
frontend_route: /workflow/pre-defense
source_stage_title: "Этап Предзащит"
---

# Этап 8. Предзащиты

## Цель этапа

Провести предзащиты (1, 2 и при необходимости 3-ю пересдачу), зафиксировать оценки, посещаемость и протоколы.

## Роли и интерфейсы

- Студент: страница `Моя предзащита`.
- Член комиссии: страница `Предзащиты`.
- Секретарь: экран согласования и формирования ведомости.
- Кафедра: экран `Результаты предзащит` для пересдачи.

## API для интеграции

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/api/v{version}/pre-defense/schedule?commissionId={id}` | Слоты предзащит по комиссии. |
| POST | `/api/v{version}/pre-defense/works/{workId}/schedule` | Назначить/переназначить студента в слот. |
| GET | `/api/v{version}/pre-defense/works/{workId}/attempts` | История попыток (1/2/3). |
| PUT | `/api/v{version}/pre-defense/attempts/{attemptId}/attendance` | Отметить явку/неявку. |
| GET | `/api/v{version}/evaluation/criteria?workTypeId={id}` | Критерии оценивания. |
| POST | `/api/v{version}/pre-defense/schedule/{scheduleId}/grades` | Сохранить оценку члена комиссии. |
| PUT | `/api/v{version}/pre-defense/schedule/{scheduleId}/start-reconciliation` | Предварительное согласование оценок. |
| PUT | `/api/v{version}/pre-defense/attempts/{attemptId}/finalize` | Окончательное согласование и фиксация итога. |
| POST | `/api/v{version}/pre-defense/protocols` | Сформировать ведомость/протокол предзащиты. |
| GET | `/api/v{version}/pre-defense/failed-students` | Список не прошедших для пересдачи. |
| POST | `/api/v{version}/works/{workId}/Attachments` | Загрузка материалов студентом. |

### Request schema (ключевые)

`SubmitPreDefenseGradeRequest`
- `MemberId`, `CriteriaId`, `Score`, `Comment?`

`FinalizePreDefenseRequest`
- `AverageScore: decimal`
- `IsPassed: bool`

`RecordAttendanceRequest`
- `AttendanceStatus`, `IsExcused`

## Детальные требования к фронтенду

1. Для студента показывать дату/время/комиссию/место и кнопку загрузки материалов.
2. Для комиссии показывать список студентов текущей сессии и форму оценивания по критериям.
3. Для секретаря добавить двухфазный процесс: `start-reconciliation` -> `finalize`.
4. Для пересдачи (предзащита 3) вывести отдельный список из `failed-students`.
5. Отображать номер попытки и итог по каждой попытке.

## Бизнес-правила и валидации

- Оценку можно отправлять только для назначенного `scheduleId`.
- Финализация возможна только после заполнения оценок комиссии.
- Студенты с `IsPassed = false` не переходят к следующему этапу.

## Чек-лист делегирования (для сокомандника)

1. Реализовать загрузку материалов предзащиты студентом.
2. Реализовать интерфейс оценивания комиссии.
3. Реализовать flow согласования секретаря.
4. Реализовать экран пересдачи для кафедры.
5. Добавить тесты на успешную и неуспешную предзащиту.

## Definition of Done

- Полный цикл предзащиты фиксируется в системе без ручных правок.
- Итог и статус попытки доступны всем нужным ролям.
- Протокол можно сгенерировать и скачать.
