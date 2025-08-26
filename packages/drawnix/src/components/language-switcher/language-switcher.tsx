import React from 'react';
import { useI18n, Language } from '../../i18n';
import './language-switcher.scss';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <button 
      className="language-switcher"
      onClick={toggleLanguage}
      title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
    >
      {language === 'en' ? '中文' : 'EN'}
    </button>
  );
};