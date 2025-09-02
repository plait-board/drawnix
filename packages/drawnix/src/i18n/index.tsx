import React, { createContext, useContext, useState, useMemo } from 'react';
import { zhTranslations, enTranslations, ruTranslations,arTranslations } from './translations';
import { Language, Translations, I18nContextType, I18nProviderProps } from './types';

// Translation data
const translations: Record<Language, Translations> = {
  zh: zhTranslations,
  en: enTranslations,
  ru: ruTranslations,
  ar:arTranslations
};

// Create the context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<I18nProviderProps> = ({
    children,
    defaultLanguage = 'zh',
}) => {

    const [language, setLanguageState] = useState<Language>(() => {
        const storedLanguage = localStorage.getItem('language') as Language;
        return storedLanguage || defaultLanguage;
    });

    const setLanguage = (newLanguage: Language) => {
        localStorage.setItem('language', newLanguage);
        setLanguageState(newLanguage);
    };

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

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }

  return context;
};

export const i18nInsidePlaitHook = () => {

    const i18n = {
        t: (key: keyof Translations): string => {  
            const currentLang = localStorage.getItem('language') as Language || 'zh';
            return translations[currentLang][key] || key;
        },
        language: localStorage.getItem('language') as Language || 'zh',
    };

    return i18n;
}

export type { Language, Translations, I18nContextType };
