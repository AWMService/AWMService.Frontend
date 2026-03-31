# Project Next Steps Analysis

## Current Status

- Four frontend apps are in place and build successfully:
  - `apps/student`
  - `apps/universal` (migrated from supervisor and reused core supervisor pages/components)
  - `apps/department`
  - `apps/admin`
- Shared i18n and role infrastructure is created in `packages/shared`.
- Admin styling is aligned with the existing department/student visual language.

## What Is Still Needed

### 1) Complete Internationalization Coverage

Infrastructure exists, but many UI strings are still hardcoded in JSX/CSS-driven content.

Required work:
- Replace hardcoded strings with `t(...)` across all apps.
- Extend locale dictionaries in:
  - `packages/shared/src/i18n/locales/ru.json`
  - `packages/shared/src/i18n/locales/en.json`
  - `packages/shared/src/i18n/locales/kk.json`
- Ensure role-specific pages in `universal` and `admin` fully react to language switching.

Acceptance criteria:
- Language switcher changes text on all major pages in all 4 apps.
- No critical user-facing static labels remain hardcoded.

### 2) Finish Static Functional Flows for All Roles

The goal before API integration is end-to-end static behavior per role.

Required work:
- `student`: complete all stage interactions with consistent mock states (pending/in progress/approved/rejected).
- `universal` roles:
  - supervisor
  - reviewer
  - normocontrol
  - chairman
  - secretary
  - commissionMember
- Add route-level role guards in universal app so each role sees only relevant sections.
- `department`: confirm all sections are complete and consistent in static mode.
- `admin`: finalize static CRUD-like behavior (users, roles, settings, monitoring, departments/faculties).

Acceptance criteria:
- Each role can perform a complete static scenario without dead-end pages.
- Navigation and visible actions match role responsibilities.

### 3) Clean Up Migration Artifacts

After supervisor -> universal migration, old duplicate/unused files remain.

Required work:
- Remove unused legacy supervisor duplicates in `apps/universal` (old header/sidebar variants not used by router).
- Remove unused copied components inside `apps/admin` inherited from department template.
- Decide whether to remove `apps/legacy` now or keep temporarily as reference.

Acceptance criteria:
- No unused duplicate UI shells in active apps.
- Clear app ownership: student/universal/department/admin only.

### 4) Prepare API Integration Layer (Without Connecting Yet)

Before real backend wiring, organize the frontend contract.

Required work:
- Move inline mock data from page components into dedicated mock services/adapters.
- Define per-domain service interfaces (auth, users, topics, reviews, schedules, settings).
- Add consistent loading/error/empty state patterns in all apps.

Acceptance criteria:
- UI components consume service interfaces, not inline constants.
- Replacing mock with API calls later requires minimal page-level refactoring.

## Recommended Execution Order

1. Full i18n sweep across all apps.
2. Complete static role flows and route guards.
3. Cleanup of migration artifacts and optional `legacy` removal.
4. Service/adaptor layering for future API integration.
5. Then start backend API integration.

## Notes

- Keep reusing supervisor-origin pages/components in `universal` as the base for non-student/non-department/non-admin roles.
- Do not start real API integration until static role scenarios are complete and stable.
