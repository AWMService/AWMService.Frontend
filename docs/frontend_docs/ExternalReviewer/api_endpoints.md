# External Reviewer API Endpoints

Базовый префикс: `api/v{version:apiVersion}`

## Доступные endpoint (текущий API)

| Method | Endpoint | Назначение |
| --- | --- | --- |
| POST | `/works/{workId:long}/Reviews/external/{reviewId:long}` | Загрузить файл внешней рецензии (`UploadReviewRequest`). |
| GET | `/works/{workId:long}/Reviews` | Проверить, что рецензия привязана к работе. |

## Связанные административные endpoint

| Method | Endpoint | Назначение |
| --- | --- | --- |
| POST | `/works/{workId:long}/assign-reviewer` | Назначение рецензента кафедрой. |
| GET | `/works/{workId:long}/assigned-reviewer` | Получение данных назначенного рецензента. |

## API Gap

1. Нет выделенного профиля/кабинета рецензента с endpoint типа `my assigned reviews`.
2. Нет отдельного endpoint для подтверждения шага `материалы отправлены рецензенту`.
