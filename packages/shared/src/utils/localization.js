
export const getLocalizedText = (item, fieldBaseName, currentLang = 'ru') => {
  if (!item) return '';


  const newFormatObj = item[fieldBaseName];
  if (newFormatObj && typeof newFormatObj === 'object') {
    const value = newFormatObj[currentLang];
    if (value) return value;

    if (newFormatObj.ru) return newFormatObj.ru;
  }



  const capitalizedBase = fieldBaseName.charAt(0).toUpperCase() + fieldBaseName.slice(1);


  const legacySuffixMap = {
    'ru': 'Ru',
    'kk': 'Kz',
    'kk': 'Kz',
    'kz': 'Kz',
    'en': 'En'
  };
  const suffix = legacySuffixMap[currentLang] || 'Ru';
  const legacyField = `${capitalizedBase}${suffix}`;
  const legacyFallbackField = `${capitalizedBase}Ru`;
  if (item[legacyField]) return item[legacyField];
  if (item[legacyFallbackField]) return item[legacyFallbackField];


  const camelLegacyField = `${fieldBaseName}${suffix}`;
  const camelLegacyFallback = `${fieldBaseName}Ru`;
  if (item[camelLegacyField]) return item[camelLegacyField];
  if (item[camelLegacyFallback]) return item[camelLegacyFallback];
  return '';
};
