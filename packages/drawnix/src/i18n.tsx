import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// Define supported languages
export type Language = 'zh' | 'en';

// Define translation keys and their corresponding values
export interface Translations {
  // Toolbar items
  'toolbar.hand': string;
  'toolbar.selection': string;
  'toolbar.mind': string;
  'toolbar.text': string;
  'toolbar.pen': string;
  'toolbar.arrow': string;
  'toolbar.shape': string;
  'toolbar.image': string;
  'toolbar.extraTools': string;
  
  // Zoom controls
  'zoom.in': string;
  'zoom.out': string;
  'zoom.fit': string;
  'zoom.100': string;
  
  // Themes
  'theme.default': string;
  'theme.colorful': string;
  'theme.soft': string;
  'theme.retro': string;
  'theme.dark': string;
  'theme.starry': string;
  
  // General
  'general.undo': string;
  'general.redo': string;
  'general.menu': string;
  'general.duplicate': string;
  'general.delete': string;
  
  // Language
  'language.switcher': string;
  'language.chinese': string;
  'language.english': string;
  
  // Menu items
  'menu.open': string;
  'menu.saveFile': string;
  'menu.exportImage': string;
  'menu.exportImage.png': string;
  'menu.exportImage.jpg': string;
  'menu.cleanBoard': string;
  'menu.github': string;
  
  // Dialog translations
  'dialog.mermaid.title': string;
  'dialog.mermaid.description': string;
  'dialog.mermaid.flowchart': string;
  'dialog.mermaid.sequence': string;
  'dialog.mermaid.class': string;
  'dialog.mermaid.otherTypes': string;
  'dialog.mermaid.syntax': string;
  'dialog.mermaid.placeholder': string;
  'dialog.mermaid.preview': string;
  'dialog.mermaid.insert': string;
  'dialog.markdown.description': string;
  'dialog.markdown.syntax': string;
  'dialog.markdown.placeholder': string;
  'dialog.markdown.preview': string;
  'dialog.markdown.insert': string;
  'dialog.error.loadMermaid': string;
  
  // Extra tools menu items
  'extraTools.mermaidToDrawnix': string;
  'extraTools.markdownToDrawnix': string;
}

// Translation data
const translations: Record<Language, Translations> = {
  zh: {
    // Toolbar items
    'toolbar.hand': '手形工具 — H',
    'toolbar.selection': '选择 — V',
    'toolbar.mind': '思维导图 — M',
    'toolbar.text': '文本 — T',
    'toolbar.pen': '画笔 — P',
    'toolbar.arrow': '箭头 — A',
    'toolbar.shape': '形状',
    'toolbar.image': '图片 — Cmd+U',
    'toolbar.extraTools': '更多工具',
    
    // Zoom controls
    'zoom.in': '放大 — Cmd++',
    'zoom.out': '缩小 — Cmd+-',
    'zoom.fit': '自适应',
    'zoom.100': '缩放至 100%',
    
    // Themes
    'theme.default': '默认',
    'theme.colorful': '缤纷',
    'theme.soft': '柔和',
    'theme.retro': '复古',
    'theme.dark': '暗夜',
    'theme.starry': '星空',
    
    // General
    'general.undo': '撤销',
    'general.redo': '重做',
    'general.menu': '应用菜单',
    'general.duplicate': '复制',
    'general.delete': '删除',
    
    // Language
    'language.switcher': '语言',
    'language.chinese': '中文',
    'language.english': 'English',
    
    // Menu items
    'menu.open': '打开',
    'menu.saveFile': '保存文件',
    'menu.exportImage': '导出图片',
    'menu.exportImage.png': 'PNG',
    'menu.exportImage.jpg': 'JPG',
    'menu.cleanBoard': '清除画布',
    'menu.github': 'GitHub',
    
    // Dialog translations
    'dialog.mermaid.title': 'Mermaid 转 Drawnix',
    'dialog.mermaid.description': '目前仅支持',
    'dialog.mermaid.flowchart': '流程图',
    'dialog.mermaid.sequence': '序列图',
    'dialog.mermaid.class': '类图',
    'dialog.mermaid.otherTypes': '。其他类型在 Drawnix 中将以图片呈现。',
    'dialog.mermaid.syntax': 'Mermaid 语法',
    'dialog.mermaid.placeholder': '在此处编写 Mermaid 图表定义...',
    'dialog.mermaid.preview': '预览',
    'dialog.mermaid.insert': '插入',
    'dialog.markdown.description': '支持 Markdown 语法自动转换为思维导图。',
    'dialog.markdown.syntax': 'Markdown 语法',
    'dialog.markdown.placeholder': '在此处编写 Markdown 文本定义...',
    'dialog.markdown.preview': '预览',
    'dialog.markdown.insert': '插入',
    'dialog.error.loadMermaid': '加载 Mermaid 库失败',
    
    // Extra tools menu items
    'extraTools.mermaidToDrawnix': 'Mermaid 到 Drawnix',
    'extraTools.markdownToDrawnix': 'Markdown 到 Drawnix',
  },
  en: {
    // Toolbar items
    'toolbar.hand': 'Hand — H',
    'toolbar.selection': 'Selection — V',
    'toolbar.mind': 'Mind — M',
    'toolbar.text': 'Text — T',
    'toolbar.pen': 'Pen — P',
    'toolbar.arrow': 'Arrow — A',
    'toolbar.shape': 'Shape',
    'toolbar.image': 'Image — Cmd+U',
    'toolbar.extraTools': 'Extra Tools',
    
    // Zoom controls
    'zoom.in': 'Zoom In — Cmd++',
    'zoom.out': 'Zoom Out — Cmd+-',
    'zoom.fit': 'Fit to Screen',
    'zoom.100': 'Zoom to 100%',
    
    // Themes
    'theme.default': 'Default',
    'theme.colorful': 'Colorful',
    'theme.soft': 'Soft',
    'theme.retro': 'Retro',
    'theme.dark': 'Dark',
    'theme.starry': 'Starry',
    
    // General
    'general.undo': 'Undo',
    'general.redo': 'Redo',
    'general.menu': 'App Menu',
    'general.duplicate': 'Duplicate',
    'general.delete': 'Delete',
    
    // Language
    'language.switcher': 'Language',
    'language.chinese': '中文',
    'language.english': 'English',
    
    // Menu items
    'menu.open': 'Open',
    'menu.saveFile': 'Save File',
    'menu.exportImage': 'Export Image',
    'menu.exportImage.png': 'PNG',
    'menu.exportImage.jpg': 'JPG',
    'menu.cleanBoard': 'Clear Board',
    'menu.github': 'GitHub',
    
    // Dialog translations
    'dialog.mermaid.title': 'Mermaid to Drawnix',
    'dialog.mermaid.description': 'Currently supports',
    'dialog.mermaid.flowchart': 'flowcharts',
    'dialog.mermaid.sequence': 'sequence diagrams', 
    'dialog.mermaid.class': 'class diagrams',
    'dialog.mermaid.otherTypes': ', and other diagram types (rendered as images).',
    'dialog.mermaid.syntax': 'Mermaid Syntax',
    'dialog.mermaid.placeholder': 'Write your Mermaid chart definition here...',
    'dialog.mermaid.preview': 'Preview',
    'dialog.mermaid.insert': 'Insert',
    'dialog.markdown.description': 'Supports automatic conversion of Markdown syntax to mind map.',
    'dialog.markdown.syntax': 'Markdown Syntax',
    'dialog.markdown.placeholder': 'Write your Markdown text definition here...',
    'dialog.markdown.preview': 'Preview',
    'dialog.markdown.insert': 'Insert',
    'dialog.error.loadMermaid': 'Failed to load Mermaid library',
    
    // Extra tools menu items
    'extraTools.mermaidToDrawnix': 'Mermaid to Drawnix',
    'extraTools.markdownToDrawnix': 'Markdown to Drawnix',
  },
};

// I18n context interface
interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations) => string;
}

// Create the context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider props
interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

// I18nProvider component
export const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  defaultLanguage = 'zh' 
}) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = (key: keyof Translations): string => {
    return translations[language][key] || key;
  };

  const value: I18nContextType = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// useI18n hook
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  
  return context;
};

// Export types for external use
export type { I18nContextType };