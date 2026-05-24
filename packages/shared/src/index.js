// Shared styles
import './styles/theme.css';

// Shared assets
// Icons can be imported directly from '@awm/shared/src/assets/icons/...'

// i18n
export { default as i18n } from './i18n';
export { 
  resources, 
  supportedLanguages, 
  defaultLanguage, 
  changeLanguage,
  getCurrentLanguage,
  getIntlLocale,
  getLocalizedValue,
  normalizeLanguage
} from './i18n';

// Context
export {
  RoleProvider,
  useRole,
  ROLES,
  UNIVERSAL_ROLES,
  ROLE_META
} from './context/RoleContext';

export {
  AuthProvider,
  useAuth
} from './context/AuthContext';

// Components
export { LanguageSelector } from './components/LanguageSelector';
export { RoleSelector } from './components/RoleSelector';
export { ProtectedRoute } from './components/ProtectedRoute';
export { RequireAuth, LoginRedirect } from './components/RequireAuth';
export { SingleSignOnPage } from './components/SingleSignOnPage';
export { ConfirmModal } from './components/ConfirmModal/ConfirmModal';
// Re-export react-i18next hooks for convenience
export { useTranslation, Trans } from 'react-i18next';

// API
export * from './api';
export * from './auth/authRouting';
export * from './auth/roles';

// Utils
export { getLocalizedText } from './utils/localization';

// Shared Pages
export { default as NotificationsPage } from './pages/NotificationsPage/NotificationsPage';

// Shared Layouts
export { SharedHeader } from './layouts/SharedHeader';
export { SharedSidebar } from './layouts/SharedSidebar';

// Domain Components
export { default as DirectionCard } from './components/domain/Directions/DirectionCard/DirectionCard';
export { default as DirectionModal } from './components/domain/Directions/DirectionModal/DirectionModal';
export { default as DirectionStatusBadge } from './components/domain/Directions/DirectionStatusBadge/DirectionStatusBadge';
export { default as ThemeModal } from './components/domain/Themes/ThemeModal/ThemeModal';
export { default as CommissionCard } from './components/domain/TimePeriods/SetUp/CommissionCard';
export { default as CommissionScheduleCard } from './components/domain/TimePeriods/SetUp/CommissionScheduleCard/CommissionScheduleCard';
export { default as MembersModal } from './components/domain/TimePeriods/SetUp/MembersModal';
export { default as TimePeriodCard } from './components/domain/TimePeriods/TimePeriodCard/TimePeriodCard';
export { default as TimePeriodFormDialog } from './components/domain/TimePeriods/TimePeriodFormDialog/TimePeriodFormDialog';
export { SupervisorCard } from './components/domain/supervisors/SupervisorCard';
export { SupervisorSelectionDialog } from './components/domain/supervisors/SupervisorSelectionDialog';
export { TeacherSelectionItem } from './components/domain/supervisors/TeacherSelectionItem';
export { getInitials } from './utils/user';
