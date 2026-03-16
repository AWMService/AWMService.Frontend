---
stage_id: 9
stage_key: quality_checks
frontend_route: /workflow/quality-checks
source_stage_title: "Этап Проверок"
---

# Этап 9. Проверки (нормоконтроль, ПО, антиплагиат, рецензия)

## Цель этапа

Провести контроль качества материалов, учесть циклы доработок и подготовить комплект для допуска к защите.

## Роли и интерфейсы

- Студент: страница `Мои проверки`, `Моя рецензия`.
- Эксперт: страницы проверки по типам.
- Кафедра: контроль статусов и назначений.

## API для интеграции

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| POST | `/api/v{version}/quality-checks/works/{workId}/submit` | Отправка работы на проверку (`SubmitForCheckRequest`). |
| GET | `/api/v{version}/quality-checks/pending?departmentId={id}&academicYearId={id}&checkType={type}` | Очередь проверок эксперта. |
| GET | `/api/v{version}/quality-checks/by-work/{workId}` | Статусы всех проверок по работе. |
| PUT | `/api/v{version}/quality-checks/works/{workId}/checks/{checkId}/record` | Решение эксперта (`RecordCheckResultRequest`). |
| PUT | `/api/v{version}/works/{workId}/repository-url` | Ссылка на репозиторий для проверки ПО. |
| POST | `/api/v{version}/works/{workId}/Attachments` | Загрузка файлов (работа, архивы, справки). |
| POST | `/api/v{version}/works/{workId}/Reviews/supervisor` | Загрузка отзыва НР. |
| GET | `/api/v{version}/works/{workId}/Reviews` | Получить рецензии/отзыв по работе. |
| POST | `/api/v{version}/works/{workId}/Reviews/external/{reviewId}` | Загрузить внешнюю рецензию. |
| GET | `/api/v{version}/works/{workId}/assigned-reviewer` | Данные назначенного рецензента. |

### Request schema (ключевые)

`SubmitForCheckRequest`
- `CheckType: CheckType` (`NormControl`, `SoftwareCheck`, `AntiPlagiarism`)
- `Comment?`

`RecordCheckResultRequest`
- `IsPassed: bool`
- `ResultValue: decimal?` (например, % оригинальности)
- `Comment?`, `DocumentPath?`

## Детальные требования к фронтенду

1. На стороне студента сделать отдельные карточки для 4 потоков: нормоконтроль, ПО, антиплагиат, рецензия.
2. Для проверки ПО поддержать два сценария: `repository-url` и загрузка ZIP + README.
3. Для эксперта сделать единый экран queue с фильтром `checkType`.
4. Для антиплагиата показывать числовой показатель `ResultValue` и документ-подтверждение.
5. Для рецензии студента: показать контакты рецензента, загрузку полученного скана рецензии.

## Бизнес-правила и валидации

- Антиплагиат запускается после успешного нормоконтроля.
- При `Незачет` этап возвращается в доработку (повторный submit).
- После `Зачет` блокировать редактирование соответствующего набора материалов.
- Повторная проверка ПО при провале антиплагиата не обязательна (по воркфлоу).

## API Gap / Уточнение

- Шаг `Материалы отправлены рецензенту` в воркфлоу не имеет отдельного endpoint статуса.
  Нужен backend-флаг или временная реализация на фронте через локальный статус.

## Чек-лист делегирования (для сокомандника)

1. Реализовать dashboard статусов проверок студента.
2. Подключить submit и cycle re-submit для каждого check type.
3. Реализовать экран эксперта для вынесения результата.
4. Реализовать блок рецензии и загрузки документов.
5. Проверить переходы `pending -> pass/fail -> resubmit`.

## Definition of Done

- Все проверки можно пройти полностью через UI.
- Статусы по проверкам корректно отображаются и обновляются.
- Негативные кейсы (незачет/повторная отправка) работают без рассинхрона.
