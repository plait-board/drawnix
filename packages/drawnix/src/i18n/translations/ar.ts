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
    "toolbar.shape.noteCurlyLeft": "ملاحظة معقوفة — يسار",
    "toolbar.shape.noteCurlyRight": "ملاحظة معقوفة — يمين",
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
    "general.moreOptions": "خيارات إضافية",
    "general.duplicate": "تكرار",
    "general.delete": "حذف",

    // Language
    "language.switcher": "اللغة",
    "language.chinese": "中文",
    "language.english": "English",
    "language.russian": "Русский",
    "language.arabic": "عربي",
    'language.vietnamese': 'Tiếng Việt',

    // Menu items
    "menu.open": "فتح",
    "menu.saveFile": "حفظ الملف",
    "menu.exportImage": "تصدير صورة",
    "menu.exportImage.svg": "SVG",
    "menu.exportImage.png": "PNG",
    "menu.exportImage.jpg": "JPG",
    "menu.cleanBoard": "مسح اللوحة",
    "menu.github": "غيت هب",

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
    "popupToolbar.fontSize": "حجم الخط",
    "popupToolbar.fontColor": "لون الخط",
    "popupToolbar.link": "إدراج رابط",
    "popupToolbar.stroke": "الحد",
    'popupToolbar.opacity': 'مستوى شفافية',

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
    "mind.abstractNodeText": "ملخص",

    'tutorial.title': 'Drawnix',
    'tutorial.description': 'سبورة شاملة تتضمن الخرائط الذهنية والمخططات الانسيابية والرسم الحر وغير ذلك',
    'tutorial.dataDescription': 'تُحفظ جميع البيانات محليًا في متصفحك',
    'tutorial.appToolbar': 'تصدير، إعدادات اللغة، ...',
    'tutorial.creationToolbar': 'اختر أداة لبدء الإنشاء',
    'tutorial.themeDescription': 'التبديل بين السمة الفاتحة والداكنة',
};

export default arTranslations;
