import { ReactNode } from 'react';

// Define supported languages
export type Language = 'zh' | 'en' | 'ru';

// Define translation keys and their corresponding values
export interface Translations {
  // Toolbar items
  'toolbar.hand': string;
  'toolbar.selection': string;
  'toolbar.mind': string;
  'toolbar.text': string;
  'toolbar.arrow': string;
  'toolbar.shape': string;
  'toolbar.image': string;
  'toolbar.extraTools': string;

  'toolbar.pen': string;
  'toolbar.eraser': string;
  
  'toolbar.arrow.straight': string,
  'toolbar.arrow.elbow': string,
  'toolbar.arrow.curve': string,

  'toolbar.shape.rectangle': string,
  'toolbar.shape.ellipse': string,
  'toolbar.shape.triangle': string,
  'toolbar.shape.terminal': string,
  'toolbar.shape.diamond': string,
  'toolbar.shape.parallelogram': string,
  'toolbar.shape.roundRectangle': string,

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

  // Colors
  'color.none': string,
  'color.unknown': string,
  'color.default': string,
  'color.white': string,
  'color.gray': string,
  'color.deepBlue': string,
  'color.red': string,
  'color.green': string,
  'color.yellow': string,
  'color.purple': string,
  'color.orange': string,
  'color.pastelPink': string,
  'color.cyan': string,
  'color.brown': string,
  'color.forestGreen': string,
  'color.lightGray': string,

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
  'language.russian': string;

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

  // Clean confirm dialog
  'cleanConfirm.title': string;
  'cleanConfirm.description': string;
  'cleanConfirm.cancel': string;
  'cleanConfirm.ok': string;

  // Link popup items
  'popupLink.delLink': string,

  // Tool popup items
  'popupToolbar.fillColor': string;
  'popupToolbar.fontColor': string;
  'popupToolbar.link': string;
  'popupToolbar.stroke': string;

  // Text placeholders
  'textPlaceholders.link': string,
  'textPlaceholders.text': string,

  // Line tool
  'line.source': string;
  'line.target': string;
  'line.arrow': string;
  'line.none': string;

  // Stroke style
  'stroke.solid': string;
  'stroke.dashed': string;
  'stroke.dotted': string;

  //markdown example
  'markdown.example': string;

  // Draw elements text
  'draw.lineText': string;
  'draw.geometryText': string;
  
  // Mind map elements text
  'mind.centralText': string;
  'mind.abstractNodeText': string;
}

// I18n context interface
export interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations) => string;
}

// Provider props
export interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}