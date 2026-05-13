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
  normalizeLanguage,
} from './i18n';

// Context
export { 
  RoleProvider, 
  useRole, 
  ROLES, 
  UNIVERSAL_ROLES, 
  ROLE_META 
} from './context/RoleContext';

// Components
export { LanguageSelector } from './components/LanguageSelector';
export { RoleSelector } from './components/RoleSelector';
export { ProtectedRoute } from './components/ProtectedRoute';
export { ConfirmModal } from './components/ConfirmModal/ConfirmModal';

// Re-export react-i18next hooks for convenience
export { useTranslation, Trans } from 'react-i18next';
