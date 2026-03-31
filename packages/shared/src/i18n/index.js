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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    supportedLngs: ['ru', 'en', 'kk'],
    
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
  i18n.changeLanguage(lang);
  localStorage.setItem('awm-language', lang);
};

// Get current language
export const getCurrentLanguage = () => {
  return i18n.language || defaultLanguage;
};
