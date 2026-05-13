import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru.json';
import en from './locales/en.json';
import kk from './locales/kk.json';

export const resources = {
  ru: { translation: ru },
  en: { translation: en },
  kk: { translation: kk },
};

export const supportedLanguages = [
  { code: 'ru', name: 'Русский', short: 'RU' },
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'kk', name: 'Қазақша', short: 'KZ' },
];

export const defaultLanguage = 'ru';

export const normalizeLanguage = (lang) => {
  if (!lang) return defaultLanguage;
  const base = String(lang).toLowerCase().split('-')[0];
  return supportedLanguages.some(({ code }) => code === base) ? base : defaultLanguage;
};

export const getIntlLocale = (lang) => {
  const normalized = normalizeLanguage(lang || getCurrentLanguage());
  if (normalized === 'en') return 'en-US';
  if (normalized === 'kk') return 'kk-KZ';
  return 'ru-RU';
};

export const getLocalizedValue = (value, lang) => {
  if (value == null) return '';
  if (typeof value !== 'object') return value;

  const normalized = normalizeLanguage(lang || getCurrentLanguage());
  return (
    value[normalized] ||
    value.kk ||
    value.kz ||
    value.ru ||
    value.en ||
    ''
  );
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    supportedLngs: ['ru', 'en', 'kk'],
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'awm-language',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Hook for changing language
export const changeLanguage = (lang) => {
  const normalized = normalizeLanguage(lang);
  i18n.changeLanguage(normalized);
  localStorage.setItem('awm-language', normalized);
};

// Get current language
export const getCurrentLanguage = () => {
  return normalizeLanguage(i18n.language || defaultLanguage);
};
