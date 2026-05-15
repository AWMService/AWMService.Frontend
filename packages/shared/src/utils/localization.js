/**
 * Resolves a localized string from an API response object.
 * Supports both the new LocalizedTextResponse format ({ ru, kk, en }) 
 * and the legacy flat format (TitleRu, TitleKz, TitleEn).
 * 
 * @param {Object} item - The API response object containing the text.
 * @param {string} fieldBaseName - The base name of the field (e.g., 'title', 'description', 'name').
 * @param {string} currentLang - The current active language ('ru', 'kk', 'en').
 * @returns {string} The resolved localized string.
 */
export const getLocalizedText = (item, fieldBaseName, currentLang = 'ru') => {
  if (!item) return '';

  // 1. Try new format: item[fieldBaseName] as LocalizedTextResponse
  const newFormatObj = item[fieldBaseName];
  if (newFormatObj && typeof newFormatObj === 'object') {
      const value = newFormatObj[currentLang];
      if (value) return value;
      // Fallback to RU
      if (newFormatObj.ru) return newFormatObj.ru;
  }

  // 2. Try legacy format: item[FieldBaseNameRu]
  // Capitalize first letter of fieldBaseName (e.g., 'title' -> 'Title')
  const capitalizedBase = fieldBaseName.charAt(0).toUpperCase() + fieldBaseName.slice(1);
  
  // Map currentLang to legacy suffixes
  const legacySuffixMap = {
      'ru': 'Ru',
      'kk': 'Kz', // backend uses Kz
      'kz': 'Kz',
      'en': 'En'
  };

  const suffix = legacySuffixMap[currentLang] || 'Ru';
  const legacyField = `${capitalizedBase}${suffix}`;
  const legacyFallbackField = `${capitalizedBase}Ru`;

  if (item[legacyField]) return item[legacyField];
  if (item[legacyFallbackField]) return item[legacyFallbackField];

  // Also try camelCase legacy (e.g. titleRu) just in case API returns camelCase
  const camelLegacyField = `${fieldBaseName}${suffix}`;
  const camelLegacyFallback = `${fieldBaseName}Ru`;

  if (item[camelLegacyField]) return item[camelLegacyField];
  if (item[camelLegacyFallback]) return item[camelLegacyFallback];

  return '';
};
