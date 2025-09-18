import { Translations } from '../types';

const ruTranslations: Translations = {
  // Toolbar items
  'toolbar.hand': 'Рука — H',
  'toolbar.selection': 'Выделение — V',
  'toolbar.mind': 'Mind-карта — M',
  'toolbar.text': 'Текст — T',
  'toolbar.arrow': 'Стрелка — A',
  'toolbar.shape': 'Фигуры',
  'toolbar.image': 'Изображение — Cmd+U',
  'toolbar.extraTools': 'Дополнительно',

  'toolbar.pen': 'Карандаш — P',
  'toolbar.eraser': 'Ластик — E',

  'toolbar.arrow.straight': 'Прямая стрелка',
  'toolbar.arrow.elbow': 'Ломаная стрелка',
  'toolbar.arrow.curve': 'Кривая стрелка',

  'toolbar.shape.rectangle': 'Прямоугольник — R',
  'toolbar.shape.ellipse': 'Эллипс — O',
  'toolbar.shape.triangle': 'Треугольник',
  'toolbar.shape.terminal': 'Останов',
  'toolbar.shape.diamond': 'Ромб',
  'toolbar.shape.parallelogram': 'Параллелограмм',
  'toolbar.shape.roundRectangle': 'Скруглённый прямоугольник',

  // Zoom controls
  'zoom.in': 'Увеличить — Cmd++',
  'zoom.out': 'Уменьшить — Cmd+-',
  'zoom.fit': 'По размеру экрана',
  'zoom.100': 'Сбросить к 100%',
  
  // Themes
  'theme.default': 'Стандартная',
  'theme.colorful': 'Красочная',
  'theme.soft': 'Мягкая',
  'theme.retro': 'Старинная',
  'theme.dark': 'Тёмная',
  'theme.starry': 'Звёздная',

  // Colors
  'color.none': 'Автоматически',
  'color.unknown': 'Другой цвет',
  'color.default': 'Чёрный',
  'color.white': 'Белый',
  'color.gray': 'Серый',
  'color.deepBlue': 'Голубой',
  'color.red': 'Красный',
  'color.green': 'Зелёный',
  'color.yellow': 'Жёлтый',
  'color.purple': 'Фиолетовый',
  'color.orange': 'Оранжевый',
  'color.pastelPink': 'Розовый',
  'color.cyan': 'Лиловый',
  'color.brown': 'Коричневый',
  'color.forestGreen': 'Сосновный',
  'color.lightGray': 'Светло-серый',

  // General
  'general.undo': 'Отменить',
  'general.redo': 'Вернуть',
  'general.menu': 'Меню приложения',
  'general.duplicate': 'Дублировать',
  'general.delete': 'Удалить',
  
  // Language
  'language.switcher': 'Language',
  'language.chinese': '中文',
  'language.english': 'English',
  'language.russian': 'Русский',
  'language.arabic': 'عربي',
  
  // Menu items
  'menu.open': 'Открыть',
  'menu.saveFile': 'Сохранить',
  'menu.exportImage': 'Экспортировать',
  'menu.exportImage.png': 'PNG',
  'menu.exportImage.jpg': 'JPG',
  'menu.cleanBoard': 'Очистить доску',
  'menu.sync': 'Синхронизация и файлы',
  'menu.github': 'GitHub',
  'sync.status.idle': 'Не в сети',
  'sync.status.connecting': 'Подключение…',
  'sync.status.connected': 'Подключено',
  'sync.status.disconnected': 'Повторное подключение…',
  'sync.status.error': 'Требует внимания',
  'sync.dialog.title': 'Sync & Files',
  'sync.dialog.close': 'Close',
  'sync.dialog.status': 'Status',
  'sync.dialog.lastSyncedPrefix': 'Последняя синхронизация: ',
  'sync.dialog.password': 'Password',
  'sync.dialog.passwordPlaceholder': 'Enter sync password',
  'sync.dialog.passwordRequired': 'Password is required',
  'sync.dialog.invalidPassword': 'Неверный пароль',
  'sync.dialog.connectionError': 'Не удалось подключиться к WebDAV. Проверьте URL, учетные данные и настройки CORS.',
  'sync.dialog.configMissing': 'Синхронизация не настроена. Проверьте параметры WebDAV.',
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
  'sync.dialog.listError': 'Не удалось получить список файлов WebDAV.',
  'sync.dialog.uploadError': 'Не удалось загрузить файл в WebDAV.',
  'sync.dialog.downloadError': 'Не удалось скачать файл из WebDAV.',
  'sync.dialog.deleteError': 'Не удалось удалить файл из WebDAV.',
  'sync.dialog.error': 'Something went wrong',
  'sync.dialog.renamePrompt': 'Введите новое имя файла (расширение можно не указывать).',
  'sync.dialog.deleteConfirm': 'Удалить этот файл?',
  'sync.dialog.settings.title': 'Настройки WebDAV',
  'sync.dialog.settings.url': 'Базовый URL',
  'sync.dialog.settings.username': 'Имя пользователя',
  'sync.dialog.settings.password': 'Пароль',
  'sync.dialog.settings.passwordHint': 'Оставьте пустым, чтобы сохранить текущий пароль',
  'sync.dialog.settings.clearPassword': 'Очистить сохранённый пароль',
  'sync.dialog.settings.basePath': 'Каталог',
  'sync.dialog.settings.mainFile': 'Имя основного файла',
  'sync.dialog.settings.label': 'Отображаемое имя',
  'sync.dialog.settings.timeout': 'Тайм-аут (мс)',
  'sync.dialog.settings.save': 'Сохранить настройки',
  'sync.dialog.settings.saving': 'Сохранение…',
  'sync.dialog.settings.success': 'Настройки обновлены',
  'sync.dialog.settings.error': 'Не удалось обновить настройки',
  'sync.dialog.settings.show': 'Изменить настройки',
  'sync.dialog.settings.hide': 'Скрыть настройки',
  'sync.dialog.pageSize': 'На странице',
  
  // Dialog translations
  'dialog.mermaid.title': 'Mermaid в Drawnix',
  'dialog.mermaid.description': 'Поддерживаются',
  'dialog.mermaid.flowchart': 'блок-схемы',
  'dialog.mermaid.sequence': 'диаграммы последовательностей', 
  'dialog.mermaid.class': 'диаграммы классов',
  'dialog.mermaid.otherTypes':
    ' и другие диаграммы (преобразуются в изображения).',
  'dialog.mermaid.syntax': 'Синтаксис Mermaid',
  'dialog.mermaid.placeholder':
    'Введите сюда описание вашей Mermaid-диаграммы…',
  'dialog.mermaid.preview': 'Предпросмотр',
  'dialog.mermaid.insert': 'Вставить',
  'dialog.markdown.description':
    'Поддерживается автоматическое преобразование синтаксиса Markdown в mind-карты.',
  'dialog.markdown.syntax': 'Синтаксис Markdown',
  'dialog.markdown.placeholder':
    'Введите сюда описание вашего текста Markdown…',
  'dialog.markdown.preview': 'Предпросмотр',
  'dialog.markdown.insert': 'Вставить',
  'dialog.error.loadMermaid': 'Не удалось загрузить библотеку Mermaid',
  
  // Extra tools menu items
  'extraTools.mermaidToDrawnix': 'Mermaid в Drawnix',
  'extraTools.markdownToDrawnix': 'Markdown в Drawnix',

  // Clean confirm dialog
  'cleanConfirm.title': 'Очистить доску',
  'cleanConfirm.description':
    'Это удалит всё содержимое доски. Вы хотите продолжить?',
  'cleanConfirm.cancel': 'Отмена',
  'cleanConfirm.ok': 'ОК',

  // Link popup items
  'popupLink.delLink': 'Удалить ссылку',

  // Tool popup items
  'popupToolbar.fillColor': 'Цвет заливки',
  'popupToolbar.fontColor': 'Цвет текста',
  'popupToolbar.link': 'Вставить ссылку',
  'popupToolbar.stroke': 'Контур',
  
  // Text placeholders
  'textPlaceholders.link': 'Ссылка',
  'textPlaceholders.text': 'Текст',

  // Line tool
  'line.source': 'Начало',
  'line.target': 'Конец',
  'line.arrow': 'Стрелка',
  'line.none': 'Нет',

  // Stroke style
  'stroke.solid': 'Сплошной',
  'stroke.dashed': 'Штриховой',
  'stroke.dotted': 'Пунктирный',

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
  'draw.lineText': 'Текст',
  'draw.geometryText': 'Текст',
  
  // Mind map elements text
  'mind.centralText': 'Центральная тема',
  'mind.abstractNodeText': 'Резюме',
};

export default ruTranslations;
