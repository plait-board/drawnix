import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';
import {
  zhTranslations,
  enTranslations,
  ruTranslations,
  arTranslations,
  viTranslations,
} from './translations';
import { Language, Translations, I18nContextType, I18nProviderProps } from './types';

const DEFAULT_LANGUAGE: Language = 'zh';
const boardLanguageMap = new WeakMap<object, Language>();

// Translation data
const translations: Record<Language, Translations> = {
  zh: zhTranslations,
  en: enTranslations,
  ru: ruTranslations,
  ar: arTranslations,
  vi: viTranslations,
};

// Create the context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const setBoardLanguage = (board: object, language: Language) => {
  boardLanguageMap.set(board, language);
};

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLanguage = DEFAULT_LANGUAGE,
  initialLanguage,
  onLanguageChange,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const initial = initialLanguage ?? defaultLanguage;
    return initial;
  });

  const setLanguage = useCallback(
    (newLanguage: Language) => {
      setLanguageState(newLanguage);
      onLanguageChange?.(newLanguage);
    },
    [onLanguageChange]
  );

  const t = useCallback(
    (key: keyof Translations): string => {
      return translations[language][key] || key;
    },
    [language]
  );

  const value: I18nContextType = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
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

export const i18nInsidePlaitHook = (board?: object | null) => {
  const resolveLanguage = () => {
    return (board ? boardLanguageMap.get(board) : undefined) ?? DEFAULT_LANGUAGE;
  };
  const i18n = {
    t: (key: keyof Translations): string => {
      const resolvedLanguage = resolveLanguage();
      return translations[resolvedLanguage][key] || key;
    },
    get language(): Language {
      return resolveLanguage();
    },
  };

  return i18n;
};

export type { Language, Translations, I18nContextType };
