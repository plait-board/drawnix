import { Translations } from '../types';

const arTranslations: Translations = {
    // Toolbar items
    "toolbar.hand": "اليد — H",
    "toolbar.selection": "التحديد — V",
    "toolbar.mind": "خريطة ذهنية — M",
    'toolbar.eraser': 'ممحاة — E',
    "toolbar.text": "نص — T",
    "toolbar.pen": "قلم — P",
    "toolbar.arrow": "سهم — A",
    "toolbar.shape": "أشكال",
    "toolbar.image": "صورة — Cmd+U",
    "toolbar.extraTools": "أدوات إضافية",

    "toolbar.arrow.straight": "سهم مستقيم",
    "toolbar.arrow.elbow": "سهم بزوايا",
    "toolbar.arrow.curve": "سهم منحني",

    "toolbar.shape.rectangle": "مستطيل — R",
    "toolbar.shape.ellipse": "بيضاوي — O",
    "toolbar.shape.triangle": "مثلث",
    "toolbar.shape.terminal": "نهائي",
    "toolbar.shape.diamond": "معين",
    "toolbar.shape.parallelogram": "متوازي أضلاع",
    "toolbar.shape.roundRectangle": "مستطيل دائري الحواف",


    // Zoom controls
    "zoom.in": "تكبير — Cmd++",
    "zoom.out": "تصغير — Cmd+-",
    "zoom.fit": "ملاءمة الشاشة",
    "zoom.100": "تكبير إلى 100%",

    // Themes
    "theme.default": "افتراضي",
    "theme.colorful": "ملون",
    "theme.soft": "ناعم",
    "theme.retro": "كلاسيكي",
    "theme.dark": "داكن",
    "theme.starry": "ليلي",

    // Colors
    "color.none": "لون الموضوع",
    "color.unknown": "لون آخر",
    "color.default": "أسود أساسي",
    "color.white": "أبيض",
    "color.gray": "رمادي",
    "color.deepBlue": "أزرق غامق",
    "color.red": "أحمر",
    "color.green": "أخضر",
    "color.yellow": "أصفر",
    "color.purple": "بنفسجي",
    "color.orange": "برتقالي",
    "color.pastelPink": "وردي فاتح",
    "color.cyan": "سماوي",
    "color.brown": "بني",
    "color.forestGreen": "أخضر غامق (غابة)",
    "color.lightGray": "رمادي فاتح",

    // General
    "general.undo": "تراجع",
    "general.redo": "إعادة",
    "general.menu": "قائمة التطبيق",
    "general.duplicate": "تكرار",
    "general.delete": "حذف",

    // Language
    "language.switcher": "اللغة",
    "language.chinese": "中文",
    "language.english": "English",
    "language.russian": "Русский",
    "language.arabic": "عربي",

    // Menu items
    "menu.open": "فتح",
    "menu.saveFile": "حفظ الملف",
    "menu.exportImage": "تصدير صورة",
    "menu.exportImage.png": "PNG",
    "menu.exportImage.jpg": "JPG",
    "menu.cleanBoard": "مسح اللوحة",
    "menu.sync": "المزامنة والملفات",
    "menu.github": "غيت هب",

    "sync.status.idle": "غير متصل",
    "sync.status.connecting": "جارٍ الاتصال…",
    "sync.status.connected": "متصل",
    "sync.status.disconnected": "إعادة الاتصال…",
    "sync.status.error": "بحاجة إلى الانتباه",
    "sync.dialog.title": "Sync & Files",
    "sync.dialog.close": "Close",
    "sync.dialog.status": "Status",
    "sync.dialog.lastSyncedPrefix": "آخر مزامنة: ",
    "sync.dialog.password": "Password",
    "sync.dialog.passwordPlaceholder": "Enter sync password",
    "sync.dialog.passwordRequired": "Password is required",
    "sync.dialog.invalidPassword": "كلمة المرور غير صحيحة",
    "sync.dialog.connectionError": "تعذر الاتصال بخادم WebDAV. يرجى التحقق من العنوان وبيانات الاعتماد وإعدادات CORS.",
    "sync.dialog.configMissing": "لم يتم تهيئة المزامنة. يرجى التحقق من إعدادات WebDAV.",
    "sync.dialog.fileNameRequired": "File name is required",
    "sync.dialog.verify": "Verify",
    "sync.dialog.verifying": "Verifying…",
    "sync.dialog.signOut": "Sign out",
    "sync.dialog.saveFile": "Save current board",
    "sync.dialog.fileNamePlaceholder": "board-name",
    "sync.dialog.save": "Save to WebDAV",
    "sync.dialog.saving": "Saving…",
    "sync.dialog.files": "WebDAV files",
    "sync.dialog.refresh": "Refresh",
    "sync.dialog.loading": "Loading…",
    "sync.dialog.noFiles": "No files yet",
    "sync.dialog.load": "Load",
    "sync.dialog.rename": "Rename",
    "sync.dialog.delete": "Delete",
    "sync.dialog.listError": "تعذر جلب قائمة ملفات WebDAV.",
    "sync.dialog.uploadError": "تعذر رفع الملف إلى WebDAV.",
    "sync.dialog.downloadError": "تعذر تنزيل الملف من WebDAV.",
    "sync.dialog.deleteError": "تعذر حذف الملف من WebDAV.",
    "sync.dialog.error": "Something went wrong",
    "sync.dialog.renamePrompt": "أدخل اسماً جديداً للملف (الامتداد اختياري).",
    "sync.dialog.deleteConfirm": "هل تريد حذف هذا الملف؟",
    "sync.dialog.settings.title": "إعدادات WebDAV",
    "sync.dialog.settings.url": "عنوان URL الأساسي",
    "sync.dialog.settings.username": "اسم المستخدم",
    "sync.dialog.settings.password": "كلمة المرور",
    "sync.dialog.settings.passwordHint": "اتركه فارغاً للاحتفاظ بكلمة المرور الحالية",
    "sync.dialog.settings.clearPassword": "مسح كلمة المرور المخزنة",
    "sync.dialog.settings.basePath": "مسار التخزين",
    "sync.dialog.settings.mainFile": "اسم الملف الرئيسي",
    "sync.dialog.settings.label": "اسم العرض",
    "sync.dialog.settings.timeout": "مهلة (مللي ثانية)",
    "sync.dialog.settings.save": "حفظ الإعدادات",
    "sync.dialog.settings.saving": "جارٍ الحفظ…",
    "sync.dialog.settings.success": "تم تحديث الإعدادات بنجاح",
    "sync.dialog.settings.error": "فشل تحديث الإعدادات",
    "sync.dialog.settings.show": "تعديل الإعدادات",
    "sync.dialog.settings.hide": "إخفاء الإعدادات",
    "sync.dialog.pageSize": "عدد العناصر",

    // Dialog translations
    "dialog.mermaid.title": "من Mermaid إلى Drawnix",
    "dialog.mermaid.description": "يدعم حاليًا",
    "dialog.mermaid.flowchart": "المخططات الانسيابية",
    "dialog.mermaid.sequence": "مخططات التسلسل",
    "dialog.mermaid.class": "مخططات الفئات",
    "dialog.mermaid.otherTypes": "، وأنواع أخرى من المخططات (تُعرض كصور).",
    "dialog.mermaid.syntax": "صيغة Mermaid",
    "dialog.mermaid.placeholder": "اكتب تعريف المخطط هنا...",
    "dialog.mermaid.preview": "معاينة",
    "dialog.mermaid.insert": "إدراج",
    "dialog.markdown.description": "يدعم التحويل التلقائي من Markdown إلى خريطة ذهنية.",
    "dialog.markdown.syntax": "صيغة Markdown",
    "dialog.markdown.placeholder": "اكتب نص Markdown هنا...",
    "dialog.markdown.preview": "معاينة",
    "dialog.markdown.insert": "إدراج",
    "dialog.error.loadMermaid": "فشل في تحميل مكتبة Mermaid",

    // Extra tools menu items
    "extraTools.mermaidToDrawnix": "من Mermaid إلى Drawnix",
    "extraTools.markdownToDrawnix": "من Markdown إلى Drawnix",

    // Clean confirm dialog
    "cleanConfirm.title": "مسح اللوحة",
    "cleanConfirm.description": "سيؤدي هذا إلى مسح اللوحة بالكامل. هل تريد المتابعة؟",
    "cleanConfirm.cancel": "إلغاء",
    "cleanConfirm.ok": "موافق",

    // Link popup items
    "popupLink.delLink": "حذف الرابط",

    // Tool popup items
    "popupToolbar.fillColor": "لون التعبئة",
    "popupToolbar.fontColor": "لون الخط",
    "popupToolbar.link": "إدراج رابط",
    "popupToolbar.stroke": "الحد",

    // Text placeholders
    "textPlaceholders.link": "رابط",
    "textPlaceholders.text": "نص",

    // Line tool
    "line.source": "بداية",
    "line.target": "نهاية",
    "line.arrow": "سهم",
    "line.none": "لا شيء",

    // Stroke style
    "stroke.solid": "صلب",
    "stroke.dashed": "متقطع",
    "stroke.dotted": "منقط",

    //markdown example
    //   "markdown.example": "# لقد بدأت\n\n- دعني أرى من تسبب بهذا الخطأ 🕵️ ♂️ 🔍\n  - 😯 💣\n    - اتضح أنه أنا 👈 🎯 💘\n\n- بشكل غير متوقع، لا يعمل؛ لماذا 🚫 ⚙️ ❓\n  - بشكل غير متوقع، أصبح يعمل الآن؛ لماذا؟ 🎢 ✨\n    - 🤯 ⚡ ➡️ 🎉\n\n- ما الذي يمكن تشغيله 🐞 🚀\n  - إذًا لا تلمسه 🛑 ✋\n    - 👾 💥 🏹 🎯\n\n## ولد أم بنت 👶 ❓ 🤷 ♂️ ♀️\n\n### مرحبًا بالعالم 👋 🌍 ✨ 💻\n\n#### واو، مبرمج 🤯 ⌨️ 💡 👩 💻",
    'markdown.example': `# I have started

  - دعني أرى من تسبب بهذا الخطأ  🕵️ ♂️ 🔍
    - 😯 💣
      - اتضح أنه أنا 👈 🎯 💘

  - بشكل غير متوقع، لا يعمل؛ لماذا  🚫 ⚙️ ❓
    - بشكل غير متوقع، أصبح يعمل الآن؛ لماذا؟ 🎢 ✨
      - 🤯 ⚡ ➡️ 🎉

  - ما الذي يمكن تشغيله 🐞 🚀
    - إذًا لا تلمسه 🛑 ✋
      - 👾 💥 🏹 🎯
    
  ## ولد أم بنت  👶 ❓ 🤷 ♂️ ♀️

  ### Hello world 👋 🌍 ✨ 💻

  #### Wow, a programmer 🤯 ⌨️ 💡 👩 💻`,

    // Draw elements text
    "draw.lineText": "نص",
    "draw.geometryText": "نص",

    // Mind map elements text
    "mind.centralText": "الموضوع المركزي",
    "mind.abstractNodeText": "ملخص"
};

export default arTranslations;
