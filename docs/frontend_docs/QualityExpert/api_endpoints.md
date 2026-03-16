# Quality Expert API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## Очередь и статусы проверок

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/quality-checks/pending?departmentId={id}&academicYearId={id}&checkType={type}` | Очередь работ на проверку. |
| GET | `/quality-checks/by-work/{workId:long}` | Все проверки и попытки по работе. |

## Вынесение результата

| Method | Endpoint | Назначение |
| --- | --- | --- |
| PUT | `/quality-checks/works/{workId:long}/checks/{checkId:long}/record` | Зафиксировать `Зачет/Незачет`, комментарии, документ. |

## Материалы для проверки

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/works/{workId:long}/Attachments` | Получить материалы работы. |
| GET | `/works/{workId:long}/Attachments/{attachmentId:long}/download` | Скачать вложение. |
| GET | `/works/{workId:long}` | Контекст работы (тип, статус, участники). |

## Уведомления

| Method | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/Notifications` | Лента уведомлений эксперта. |

## Request schemas (ключевые)

- `RecordCheckResultRequest`:
  `IsPassed`, `ResultValue?`, `Comment?`, `DocumentPath?`
- `CheckType`:
  `0=NormControl`, `1=SoftwareCheck`, `2=AntiPlagiarism`
