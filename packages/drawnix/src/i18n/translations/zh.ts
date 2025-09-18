import { Translations } from '../types';

const zhTranslations: Translations = {
  // Toolbar items
  'toolbar.hand': '手形工具 — H',
  'toolbar.selection': '选择 — V',
  'toolbar.mind': '思维导图 — M',
  'toolbar.text': '文本 — T',
  'toolbar.arrow': '箭头 — A',
  'toolbar.shape': '形状',
  'toolbar.image': '图片 — Cmd+U',
  'toolbar.extraTools': '更多工具',

  'toolbar.pen': '画笔 — P',
  'toolbar.eraser': '橡皮擦 — E',

  'toolbar.arrow.straight': '直线',
  'toolbar.arrow.elbow': '肘线',
  'toolbar.arrow.curve': '曲线',

  'toolbar.shape.rectangle': '长方形 — R',
  'toolbar.shape.ellipse': '圆 — O',
  'toolbar.shape.triangle': '三角形',
  'toolbar.shape.terminal': '椭圆角矩形',
  'toolbar.shape.diamond': '菱形',
  'toolbar.shape.parallelogram': '平行四边形',
  'toolbar.shape.roundRectangle': '圆角矩形',

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

  // Colors
  'color.none': '主题颜色',
  'color.unknown': '其他颜色',
  'color.default': '黑色',
  'color.white': '白色',
  'color.gray': '灰色',
  'color.deepBlue': '深蓝色',
  'color.red': '红色',
  'color.green': '绿色',
  'color.yellow': '黄色',
  'color.purple': '紫色',
  'color.orange': '橙色',
  'color.pastelPink': '淡粉色',
  'color.cyan': '青色',
  'color.brown': '棕色',
  'color.forestGreen': '森绿色',
  'color.lightGray': '浅灰色',

  // General
  'general.undo': '撤销',
  'general.redo': '重做',
  'general.menu': '应用菜单',
  'general.duplicate': '复制',
  'general.delete': '删除',

  // Language
  'language.switcher': 'Language',
  'language.chinese': '中文',
  'language.english': 'English',
  'language.russian': 'Русский',
  'language.arabic': 'عربي',
  
  // Menu items
  'menu.open': '打开',
  'menu.saveFile': '保存文件',
  'menu.exportImage': '导出图片',
  'menu.exportImage.png': 'PNG',
  'menu.exportImage.jpg': 'JPG',
  'menu.cleanBoard': '清除画布',
  'menu.sync': '同步与文件',
  'menu.github': 'GitHub',

  'sync.status.idle': '未连接',
  'sync.status.connecting': '连接中…',
  'sync.status.connected': '已连接',
  'sync.status.disconnected': '正在重连…',
  'sync.status.error': '需要处理',
  'sync.dialog.title': '同步与文件',
  'sync.dialog.close': '关闭',
  'sync.dialog.status': '状态',
  'sync.dialog.lastSyncedPrefix': '上次同步：',
  'sync.dialog.password': '密码',
  'sync.dialog.passwordPlaceholder': '输入同步密码',
  'sync.dialog.passwordRequired': '请输入密码',
  'sync.dialog.invalidPassword': '密码错误',
  'sync.dialog.connectionError': '无法连接 WebDAV 服务器，请检查地址、凭据或 CORS 设置。',
  'sync.dialog.configMissing': '尚未配置同步，请检查 WebDAV 设置。',
  'sync.dialog.fileNameRequired': '请输入文件名',
  'sync.dialog.verify': '验证',
  'sync.dialog.verifying': '正在验证…',
  'sync.dialog.signOut': '退出同步',
  'sync.dialog.saveFile': '保存当前画板',
  'sync.dialog.fileNamePlaceholder': 'board-name',
  'sync.dialog.save': '保存到 WebDAV',
  'sync.dialog.saving': '保存中…',
  'sync.dialog.files': 'WebDAV 文件',
  'sync.dialog.refresh': '刷新',
  'sync.dialog.loading': '加载中…',
  'sync.dialog.noFiles': '暂无文件',
  'sync.dialog.load': '加载',
  'sync.dialog.rename': '重命名',
  'sync.dialog.delete': '删除',
  'sync.dialog.listError': '无法获取 WebDAV 文件列表。',
  'sync.dialog.uploadError': '上传到 WebDAV 失败。',
  'sync.dialog.downloadError': '从 WebDAV 下载文件失败。',
  'sync.dialog.deleteError': '删除 WebDAV 文件失败。',
  'sync.dialog.error': '发生错误',
  'sync.dialog.renamePrompt': '输入新的文件名（可不带扩展名）',
  'sync.dialog.deleteConfirm': '确定要删除该文件吗？',
  'sync.dialog.settings.title': 'WebDAV 设置',
  'sync.dialog.settings.url': '基础地址',
  'sync.dialog.settings.username': '用户名',
  'sync.dialog.settings.password': '密码',
  'sync.dialog.settings.passwordHint': '留空表示保持原密码',
  'sync.dialog.settings.clearPassword': '清除已保存的密码',
  'sync.dialog.settings.basePath': '存储目录',
  'sync.dialog.settings.mainFile': '主文件名',
  'sync.dialog.settings.label': '显示名称',
  'sync.dialog.settings.timeout': '超时时间（毫秒）',
  'sync.dialog.settings.save': '保存设置',
  'sync.dialog.settings.saving': '保存中…',
  'sync.dialog.settings.success': '设置已更新',
  'sync.dialog.settings.error': '保存设置失败',
  'sync.dialog.settings.show': '编辑设置',
  'sync.dialog.settings.hide': '收起设置',
  'sync.dialog.pageSize': '每页显示',

  // Dialog translations
  'dialog.mermaid.title': 'Mermaid 转 Drawnix',
  'dialog.mermaid.description': '目前仅支持',
  'dialog.mermaid.flowchart': '流程图',
  'dialog.mermaid.sequence': '序列图',
  'dialog.mermaid.class': '类图',
  'dialog.mermaid.otherTypes': '。其他类型在 Drawnix 中将以图片呈现。',
  'dialog.mermaid.syntax': 'Mermaid 语法',
  'dialog.mermaid.placeholder': '在此处编写 Mermaid 图表定义…',
  'dialog.mermaid.preview': '预览',
  'dialog.mermaid.insert': '插入',
  'dialog.markdown.description': '支持 Markdown 语法自动转换为思维导图。',
  'dialog.markdown.syntax': 'Markdown 语法',
  'dialog.markdown.placeholder': '在此处编写 Markdown 文本定义…',
  'dialog.markdown.preview': '预览',
  'dialog.markdown.insert': '插入',
  'dialog.error.loadMermaid': '加载 Mermaid 库失败',

  // Extra tools menu items
  'extraTools.mermaidToDrawnix': 'Mermaid 到 Drawnix',
  'extraTools.markdownToDrawnix': 'Markdown 到 Drawnix',

  // Clean confirm dialog
  'cleanConfirm.title': '清除画布',
  'cleanConfirm.description': '这将会清除整个画布。你是否要继续?',
  'cleanConfirm.cancel': '取消',
  'cleanConfirm.ok': '确认',

  // Link popup items
  'popupLink.delLink': '移除连结',

  // Tool popup items
  'popupToolbar.fillColor': '填充颜色',
  'popupToolbar.fontColor': '字体颜色',
  'popupToolbar.link': '链接',
  'popupToolbar.stroke': '边框',
  
  // Text placeholders
  'textPlaceholders.link': '链接',
  'textPlaceholders.text': '文本',

  // Line tool
  'line.source': '起点',
  'line.target': '终点',
  'line.arrow': '箭头',
  'line.none': '无',

  // Stroke style
  'stroke.solid': '实线',
  'stroke.dashed': '虚线',
  'stroke.dotted': '点线',

  // Draw elements text
  'draw.lineText': '文本',
  'draw.geometryText': '文本',
  
  // Mind map elements text
  'mind.centralText': '中心主题',
  'mind.abstractNodeText': '摘要',

  //markdown example
  'markdown.example': `# 我开始了
  
  - 让我看看是谁搞出了这个 bug 🕵️ ♂️ 🔍
    - 😯 💣
      - 原来是我 👈 🎯 💘
  
  - 竟然不可以运行，为什么呢 🚫 ⚙️ ❓
    - 竟然可以运行了，为什么呢？🎢 ✨
      - 🤯 ⚡ ➡️ 🎉
  
  - 能运行起来的 🐞 🚀
    - 就不要去动它 🛑 ✋
      - 👾 💥 🏹 🎯
      
  ## 男孩还是女孩 👶 ❓ 🤷 ♂️ ♀️
  
  ### Hello world 👋 🌍 ✨ 💻
  
  #### 哇 是个程序员 🤯 ⌨️ 💡 👩 💻`,

  'tutorial.title': 'Drawnix',
  'tutorial.description': 'All-in-one 白板，包含思维导图、流程图、自由画笔等',
  'tutorial.dataDescription': '所有数据被存在你的浏览器本地',
  'tutorial.appToolbar': '导出，语言设置，...',
  'tutorial.creationToolbar': '选择一个工具开始你的创作',
  'tutorial.themeDescription': '在明亮和黑暗主题之间切换',

};

export default zhTranslations;
