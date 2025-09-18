import { Translations } from '../types';

const enTranslations: Translations = {
  // Toolbar items
  'toolbar.hand': 'Hand — H',
  'toolbar.selection': 'Selection — V',
  'toolbar.mind': 'Mind — M',
  'toolbar.text': 'Text — T',
  'toolbar.arrow': 'Arrow — A',
  'toolbar.shape': 'Shape',
  'toolbar.image': 'Image — Cmd+U',
  'toolbar.extraTools': 'Extra Tools',

  'toolbar.pen': 'Pen — P',
  'toolbar.eraser': 'Eraser — E',

  'toolbar.arrow.straight': 'Straight Arrow Line',
  'toolbar.arrow.elbow': 'Elbow Arrow Line',
  'toolbar.arrow.curve': 'Curve Arrow Line',

  'toolbar.shape.rectangle': 'Rectangle — R',
  'toolbar.shape.ellipse': 'Ellipse — O',
  'toolbar.shape.triangle': 'Triangle',
  'toolbar.shape.terminal': 'Terminal',
  'toolbar.shape.diamond': 'Diamond',
  'toolbar.shape.parallelogram': 'Parallelogram',
  'toolbar.shape.roundRectangle': 'Round Rectangle',

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

  // Colors
  'color.none': 'Topic Color',
  'color.unknown': 'Other Color',
  'color.default': 'Basic Black',
  'color.white': 'White',
  'color.gray': 'Grey',
  'color.deepBlue': 'Deep Blue',
  'color.red': 'Red',
  'color.green': 'Green',
  'color.yellow': 'Yellow',
  'color.purple': 'Purple',
  'color.orange': 'Orange',
  'color.pastelPink': 'Paster Pink',
  'color.cyan': 'Cyan',
  'color.brown': 'Brown',
  'color.forestGreen': 'Forest Green',
  'color.lightGray': 'Light Grey',

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
  'language.russian': 'Русский',
  'language.arabic': 'عربي',
  // Menu items
  'menu.open': 'Open',
  'menu.saveFile': 'Save File',
  'menu.exportImage': 'Export Image',
  'menu.exportImage.png': 'PNG',
  'menu.exportImage.jpg': 'JPG',
  'menu.cleanBoard': 'Clear Board',
  'menu.sync': 'Sync & Files',
  'menu.github': 'GitHub',

  'sync.status.idle': 'Offline',
  'sync.status.connecting': 'Connecting…',
  'sync.status.connected': 'Connected',
  'sync.status.disconnected': 'Reconnecting…',
  'sync.status.error': 'Needs attention',
  'sync.dialog.title': 'Sync & Files',
  'sync.dialog.close': 'Close',
  'sync.dialog.status': 'Status',
  'sync.dialog.lastSyncedPrefix': 'Last synced: ',
  'sync.dialog.password': 'Password',
  'sync.dialog.passwordPlaceholder': 'Enter sync password',
  'sync.dialog.passwordRequired': 'Password is required',
  'sync.dialog.invalidPassword': 'Incorrect password',
  'sync.dialog.connectionError': 'Failed to connect to WebDAV server. Check URL, credentials, and CORS settings.',
  'sync.dialog.configMissing': 'Sync is not configured. Check WebDAV settings.',
  'sync.dialog.fileNameRequired': 'File name is required',
  'sync.dialog.verify': 'Verify',
  'sync.dialog.verifying': 'Verifying…',
  'sync.dialog.signOut': 'Sign out',
  'sync.dialog.saveFile': 'Save current board',
  'sync.dialog.fileNamePlaceholder': 'board-name',
  'sync.dialog.save': 'Save to WebDAV',
  'sync.dialog.saving': 'Saving…',
  'sync.dialog.files': 'WebDAV files',
  'sync.dialog.refresh': 'Refresh',
  'sync.dialog.loading': 'Loading…',
  'sync.dialog.noFiles': 'No files yet',
  'sync.dialog.load': 'Load',
  'sync.dialog.rename': 'Rename',
  'sync.dialog.delete': 'Delete',
  'sync.dialog.listError': 'Failed to list WebDAV files.',
  'sync.dialog.uploadError': 'Failed to upload file to WebDAV.',
  'sync.dialog.downloadError': 'Failed to download file from WebDAV.',
  'sync.dialog.deleteError': 'Failed to delete file from WebDAV.',
  'sync.dialog.error': 'Something went wrong',
  'sync.dialog.renamePrompt': 'Enter a new file name (extension optional).',
  'sync.dialog.deleteConfirm': 'Delete this file?',
  'sync.dialog.settings.title': 'WebDAV Settings',
  'sync.dialog.settings.url': 'Base URL',
  'sync.dialog.settings.username': 'Username',
  'sync.dialog.settings.password': 'Password',
  'sync.dialog.settings.passwordHint': 'Leave blank to keep the current password',
  'sync.dialog.settings.clearPassword': 'Clear stored password',
  'sync.dialog.settings.basePath': 'Base path',
  'sync.dialog.settings.mainFile': 'Main file name',
  'sync.dialog.settings.label': 'Display label',
  'sync.dialog.settings.timeout': 'Timeout (ms)',
  'sync.dialog.settings.save': 'Save settings',
  'sync.dialog.settings.saving': 'Saving…',
  'sync.dialog.settings.success': 'Settings updated successfully',
  'sync.dialog.settings.error': 'Failed to update settings',
  'sync.dialog.settings.show': 'Edit settings',
  'sync.dialog.settings.hide': 'Hide settings',
  'sync.dialog.pageSize': 'Per page',

  // Dialog translations
  'dialog.mermaid.title': 'Mermaid to Drawnix',
  'dialog.mermaid.description': 'Currently supports',
  'dialog.mermaid.flowchart': 'flowcharts',
  'dialog.mermaid.sequence': 'sequence diagrams',
  'dialog.mermaid.class': 'class diagrams',
  'dialog.mermaid.otherTypes':
    ', and other diagram types (rendered as images).',
  'dialog.mermaid.syntax': 'Mermaid Syntax',
  'dialog.mermaid.placeholder': 'Write your Mermaid chart definition here…',
  'dialog.mermaid.preview': 'Preview',
  'dialog.mermaid.insert': 'Insert',
  'dialog.markdown.description':
    'Supports automatic conversion of Markdown syntax to mind map.',
  'dialog.markdown.syntax': 'Markdown Syntax',
  'dialog.markdown.placeholder': 'Write your Markdown text definition here...',
  'dialog.markdown.preview': 'Preview',
  'dialog.markdown.insert': 'Insert',
  'dialog.error.loadMermaid': 'Failed to load Mermaid library',

  // Extra tools menu items
  'extraTools.mermaidToDrawnix': 'Mermaid to Drawnix',
  'extraTools.markdownToDrawnix': 'Markdown to Drawnix',

  // Clean confirm dialog
  'cleanConfirm.title': 'Clear Board',
  'cleanConfirm.description':
    'This will clear the entire board. Do you want to continue?',
  'cleanConfirm.cancel': 'Cancel',
  'cleanConfirm.ok': 'OK',

  // Link popup items
  'popupLink.delLink': 'Delete Link',

  // Tool popup items
  'popupToolbar.fillColor': 'Fill Color',
  'popupToolbar.fontColor': 'Font Color',
  'popupToolbar.link': 'Insert Link',
  'popupToolbar.stroke': 'Stroke',

  // Text placeholders
  'textPlaceholders.link': 'Link',
  'textPlaceholders.text': 'Text',

  // Line tool
  'line.source': 'Start',
  'line.target': 'End',
  'line.arrow': 'Arrow',
  'line.none': 'None',

  // Stroke style
  'stroke.solid': 'Solid',
  'stroke.dashed': 'Dashed',
  'stroke.dotted': 'Dotted',

  //markdown example
  'markdown.example': `# I have started

  - Let me see who made this bug 🕵️ ♂️ 🔍
    - 😯 💣
      - Turns out it was me 👈 🎯 💘

  - Unexpectedly, it cannot run; why is that 🚫 ⚙️ ❓
    - Unexpectedly, it can run now; why is that? 🎢 ✨
      - 🤯 ⚡ ➡️ 🎉

  - What can run 🐞 🚀
    - then do not touch it 🛑 ✋
      - 👾 💥 🏹 🎯
    
  ## Boy or girl 👶 ❓ 🤷 ♂️ ♀️

  ### Hello world 👋 🌍 ✨ 💻

  #### Wow, a programmer 🤯 ⌨️ 💡 👩 💻`,

  // Draw elements text
  'draw.lineText': 'Text',
  'draw.geometryText': 'Text',

  // Mind map elements text
  'mind.centralText': 'Central Topic',
  'mind.abstractNodeText': 'Summary',

  'tutorial.title': 'Drawnix',
  'tutorial.description': 'All-in-one whiteboard, including mind maps, flowcharts, free drawing, and more',
  'tutorial.dataDescription': 'All data is stored locally in your browser',
  'tutorial.appToolbar': 'Export, language settings, ...',
  'tutorial.creationToolbar': 'Select a tool to start your creation',
  'tutorial.themeDescription': 'Switch between light and dark themes',
};

export default enTranslations;
