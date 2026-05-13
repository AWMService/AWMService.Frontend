# Commission Secretary API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## Предзащита: организация и финализация

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/pre-defense/schedule?commissionId={id}` | Сессии предзащиты комиссии. |
| POST | `/pre-defense/works/{workId:long}/schedule` | Назначить/перекинуть студента в слот. |
| PUT | `/pre-defense/attempts/{attemptId:long}/attendance` | Зафиксировать явку. |
| PUT | `/pre-defense/schedule/{scheduleId:long}/start-reconciliation` | Старт предварительного согласования. |
| PUT | `/pre-defense/attempts/{attemptId:long}/finalize` | Финальная фиксация результата попытки. |
| POST | `/pre-defense/protocols` | Сформировать протокол предзащиты. |
| GET | `/pre-defense/failed-students` | Список студентов на пересдачу. |

## Защита: согласование и протокол

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/defense-schedule?commissionId={id}` | Слоты защиты комиссии. |
| PUT | `/defense-schedule/{scheduleId:long}/start-reconciliation` | Старт согласования по защите. |
| PUT | `/evaluation/schedule/{scheduleId:long}/finalize` | Финализировать оценки защиты. |
| POST | `/protocols` | Сформировать протокол защиты. |
| GET | `/protocols/{protocolId:long}` | Получить протокол для скачивания. |

## Контроль оценок

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/evaluation/schedule/{scheduleId:long}/grades` | Проверить заполнение/свод оценок. |

## API Gap

1. Нужен endpoint со сводным `% заполненности оценок` для удобного dashboard секретаря.
