import React, { createContext, useContext, useState, useMemo } from 'react';
import { zhTranslations, enTranslations, ruTranslations } from './translations';
import { Language, Translations, I18nContextType, I18nProviderProps } from './types';

// Translation data
const translations: Record<Language, Translations> = {
  zh: zhTranslations,
  en: enTranslations,
  ru: ruTranslations,
};

// Create the context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// I18nProvider component
export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLanguage = 'zh',
}) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = (key: keyof Translations): string => {
    return translations[language][key] || key;
  };

  const value: I18nContextType = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

// useI18n hook
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }

  return context;
};

export const getMarkdownExample = (language: 'zh' | 'en') => {
    if (language === 'zh') {
      return zhTranslations['markdown.example'];
    } else if (language === 'en') {
      return enTranslations['markdown.example'];
    } 
  };

export type { Language, Translations, I18nContextType };
