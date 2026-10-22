import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../utils/translations';
import { getCropName as getCropNameUtil, getCategoryName as getCategoryNameUtil } from '../utils/crops';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('agrolink_lang') || 'en';
  });

  const setLanguage = (code) => {
    if (SUPPORTED_LANGUAGES.some(l => l.code === code)) {
      setLanguageState(code);
      localStorage.setItem('agrolink_lang', code);
    }
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  const getCropName = (cropInput) => {
    return getCropNameUtil(cropInput, language);
  };

  const getCategoryName = (catInput) => {
    return getCategoryNameUtil(catInput, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCropName, getCategoryName, SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
