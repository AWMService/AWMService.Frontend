# Frontend Refactoring Plan: Complete Consolidation

## 1. Duplication Analysis Results

The recent analysis identified significant duplication across the frontend applications (`admin`, `department`, `student`, `universal`), particularly between the `admin` and `department` apps.

### 1.1 Pages
*   **`NotificationsPage.jsx`**: Duplicated across `department`, `student`, and `universal`. The logic and structure are identical, with only the localization keys varying.

### 1.2 Layouts
*   **Headers**: `AdminHeader`, `StudentHeader`, `UniversalHeader` share the same structural and CSS logic. They primarily differ in their navigation arrays and app-specific branding/context.
*   **Sidebars**: `AdminSidebar`, `UniversalSidebar` share structural and CSS logic, differing mainly in the navigation items provided to them.

### 1.3 Domain Components
Exact functional duplicates were found, primarily between the `admin` and `department` apps:
*   **Supervisors**:
    *   `SupervisorCard.jsx`
    *   `SupervisorSelectionDialog.jsx`
    *   `TeacherSelectionItem.jsx`
*   **Time Periods / Commissions**:
    *   `TimePeriodCard.jsx`
    *   `TimePeriodFormDialog.jsx`
    *   `CommissionCard.jsx`
    *   `CommissionScheduleCard.jsx`
    *   `MembersModal.jsx`
*   **Directions / Themes**:
    *   `DirectionCard.jsx`
    *   `DirectionModal.jsx`
    *   `DirectionStatusBadge.jsx`
    *   `ThemeModal.jsx`

---

## 2. Refactoring Plan: Complete Consolidation

This plan outlines the steps to move all identified duplicates, including both exact matches and structural layouts, into the shared workspace package (`@awm/shared`) to maximize code reusability.

### Phase 1: Preparation
1.  Verify the basic setup of the `@awm/shared` package in `packages/shared`.
2.  Ensure export points (e.g., `src/index.js` or `src/components/index.js`) are correctly configured to expose the shared components to the workspace.

### Phase 2: Consolidating Domain Components
1.  **Move**: Transfer the exact duplicate domain components (Supervisors, Time Periods, Directions) from the `admin` and `department` apps into `@awm/shared/src/components/domain/`.
2.  **Export**: Add these components to the exports of `@awm/shared`.
3.  **Update Consumers**: Update the import paths in the `admin` and `department` apps to import these components from `@awm/shared` instead of local paths.

### Phase 3: Consolidating Pages
1.  **Move**: Transfer `NotificationsPage.jsx` to `@awm/shared/src/pages/`.
2.  **Abstract**: Refactor `NotificationsPage` to accept a localization key prefix or a custom translation mechanism via props, abstracting away the app-specific localization differences.
3.  **Update Consumers**: Update the router configurations in `department`, `student`, and `universal` apps to use the newly shared `NotificationsPage`.

### Phase 4: Consolidating Layouts (Generic abstraction)
1.  **Create Generic Layouts**: Create generic `SharedHeader` and `SharedSidebar` components in `@awm/shared/src/layouts/`.
2.  **Define Props Interface**: Design these components to be highly configurable, accepting props for:
    *   `navigationItems`: Array of links to render.
    *   `userProfile`: Object containing user details for the header.
    *   `appTitle`: String or node for the branding area.
    *   `actions`: Custom React nodes for extra buttons or controls in the header.
3.  **Replace Local Headers**: Replace the individual `AdminHeader`, `StudentHeader`, `UniversalHeader` with the `SharedHeader`, passing the specific configurations as props.
4.  **Replace Local Sidebars**: Replace `AdminSidebar`, `UniversalSidebar` with the `SharedSidebar`, passing the specific configurations as props.

### Phase 5: Verification
1.  Run the Vite development servers for all affected applications.
2.  Visually verify that all pages, layouts, and components render as they did before.
3.  Ensure that there are no console errors or build warnings related to missing dependencies.
