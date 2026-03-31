import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, changeLanguage, getCurrentLanguage } from '../i18n';
import './LanguageSelector.css';

export const LanguageSelector = ({ variant = 'dropdown' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = supportedLanguages.find(l => l.code === i18n.language) 
    || supportedLanguages.find(l => l.code === 'ru');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === 'buttons') {
    return (
      <div className="language-selector language-selector--buttons">
        {supportedLanguages.map((lang) => (
          <button
            key={lang.code}
            className={`language-btn ${i18n.language === lang.code ? 'language-btn--active' : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.short}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button 
        className="language-selector__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="language-selector__current">{currentLang?.short}</span>
        <svg 
          className={`language-selector__arrow ${isOpen ? 'language-selector__arrow--open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="language-selector__dropdown">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              className={`language-selector__option ${i18n.language === lang.code ? 'language-selector__option--active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-selector__code">{lang.short}</span>
              <span className="language-selector__name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
