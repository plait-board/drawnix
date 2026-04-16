import { Translations } from '../types';

const viTranslations: Translations = {
    // Toolbar items
    'toolbar.hand': 'Kéo — H',
    'toolbar.selection': 'Chọn — V',
    'toolbar.mind': 'Mind Map — M',
    'toolbar.text': 'Văn bản — T',
    'toolbar.arrow': 'Mũi tên — A',
    'toolbar.shape': 'Hình dạng',
    'toolbar.image': 'Hình ảnh — Cmd+U',
    'toolbar.extraTools': 'Công cụ mở rộng',

    'toolbar.pen': 'Bút vẽ — P',
    'toolbar.eraser': 'Tẩy — E',

    'toolbar.arrow.straight': 'Mũi tên thẳng',
    'toolbar.arrow.elbow': 'Mũi tên vuông góc',
    'toolbar.arrow.curve': 'Mũi tên cong',

    'toolbar.shape.rectangle': 'Hình chữ nhật — R',
    'toolbar.shape.ellipse': 'Hình elip — O',
    'toolbar.shape.triangle': 'Hình tam giác',
    'toolbar.shape.terminal': 'Terminal',
    'toolbar.shape.noteCurlyLeft': 'Ghi chú ngoặc móc trái',
    'toolbar.shape.noteCurlyRight': 'Ghi chú ngoặc móc phải',
    'toolbar.shape.diamond': 'Hình thoi',
    'toolbar.shape.parallelogram': 'Hình bình hành',
    'toolbar.shape.roundRectangle': 'Hình chữ nhật bo tròn',

    // Zoom controls
    'zoom.in': 'Phóng to — Cmd++',
    'zoom.out': 'Thu nhỏ — Cmd+-',
    'zoom.fit': 'Vừa màn hình',
    'zoom.100': 'Zoom 100%',

    // Themes
    'theme.default': 'Mặc định',
    'theme.colorful': 'Đầy màu sắc',
    'theme.soft': 'Nhẹ nhàng',
    'theme.retro': 'Cổ điển',
    'theme.dark': 'Tối',
    'theme.starry': 'Bầu trời sao',

    // Colors
    'color.none': 'Màu chủ đề',
    'color.unknown': 'Màu khác',
    'color.default': 'Đen cơ bản',
    'color.white': 'Trắng',
    'color.gray': 'Xám',
    'color.deepBlue': 'Xanh đậm',
    'color.red': 'Đỏ',
    'color.green': 'Xanh lá',
    'color.yellow': 'Vàng',
    'color.purple': 'Tím',
    'color.orange': 'Cam',
    'color.pastelPink': 'Hồng phấn',
    'color.cyan': 'Xanh lơ',
    'color.brown': 'Nâu',
    'color.forestGreen': 'Xanh rừng',
    'color.lightGray': 'Xám nhạt',

    // General
    'general.undo': 'Hoàn tác',
    'general.redo': 'Làm lại',
    'general.menu': 'Menu ứng dụng',
    'general.moreOptions': 'Tùy chọn khác',
    'general.duplicate': 'Nhân bản',
    'general.delete': 'Xóa',

    'general.copyToClipboard': 'Sao chép vào bộ nhớ tạm',
    'general.copyToClipboard.svg': 'SVG',
    'general.copyToClipboard.pngWithoutBackground': 'PNG (không nền)',
    'general.copyToClipboard.pngWithBackground': 'PNG (có nền)',

    // Language
    'language.switcher': 'Ngôn ngữ',
    'language.chinese': '中文',
    'language.english': 'English',
    'language.russian': 'Русский',
    'language.arabic': 'عربي',
    'language.vietnamese': 'Tiếng Việt',

    // Menu items
    'menu.open': 'Mở',
    'menu.saveFile': 'Lưu tệp',
    'menu.exportImage': 'Xuất hình ảnh',
    'menu.exportImage.svg': 'SVG',
    'menu.exportImage.png': 'PNG',
    'menu.exportImage.jpg': 'JPG',
    'menu.cleanBoard': 'Xóa bảng',
    'menu.github': 'GitHub',

    // Dialog translations
    'dialog.mermaid.title': 'Mermaid sang Drawnix',
    'dialog.mermaid.description': 'Hiện hỗ trợ',
    'dialog.mermaid.flowchart': 'lưu đồ',
    'dialog.mermaid.sequence': 'biểu đồ tuần tự',
    'dialog.mermaid.class': 'biểu đồ lớp',
    'dialog.mermaid.otherTypes':
        ', và các loại biểu đồ khác (hiển thị dưới dạng hình ảnh).',
    'dialog.mermaid.syntax': 'Cú pháp Mermaid',
    'dialog.mermaid.placeholder': 'Viết định nghĩa biểu đồ Mermaid của bạn ở đây...',
    'dialog.mermaid.preview': 'Xem trước',
    'dialog.mermaid.insert': 'Chèn',
    'dialog.markdown.description':
        'Hỗ trợ tự động chuyển đổi cú pháp Markdown sang sơ đồ tư duy.',
    'dialog.markdown.syntax': 'Cú pháp Markdown',
    'dialog.markdown.placeholder': 'Viết nội dung Markdown của bạn ở đây...',
    'dialog.markdown.preview': 'Xem trước',
    'dialog.markdown.insert': 'Chèn',
    'dialog.error.loadMermaid': 'Không thể tải thư viện Mermaid',

    // Extra tools menu items
    'extraTools.mermaidToDrawnix': 'Mermaid sang Drawnix',
    'extraTools.markdownToDrawnix': 'Markdown sang Drawnix',

    // Clean confirm dialog
    'cleanConfirm.title': 'Xóa bảng',
    'cleanConfirm.description':
        'Thao tác này sẽ xóa toàn bộ bảng. Bạn có muốn tiếp tục không?',
    'cleanConfirm.cancel': 'Hủy',
    'cleanConfirm.ok': 'Đồng ý',

    // Link popup items
    'popupLink.delLink': 'Xóa liên kết',

    // Tool popup items
    'popupToolbar.fillColor': 'Màu tô',
    'popupToolbar.fontSize': 'Cỡ chữ',
    'popupToolbar.fontColor': 'Màu chữ',
    'popupToolbar.link': 'Chèn liên kết',
    'popupToolbar.stroke': 'Đường viền',
    'popupToolbar.opacity': 'Độ trong suốt',

    // Text placeholders
    'textPlaceholders.link': 'Liên kết',
    'textPlaceholders.text': 'Văn bản',

    // Line tool
    'line.source': 'Bắt đầu',
    'line.target': 'Kết thúc',
    'line.arrow': 'Mũi tên',
    'line.none': 'Không',

    // Stroke style
    'stroke.solid': 'Nét liền',
    'stroke.dashed': 'Nét đứt',
    'stroke.dotted': 'Nét chấm',

    //markdown example
    'markdown.example': `# Tôi đã bắt đầu

    - Hãy xem ai đã tạo ra lỗi này 🕵️ ♂️ 🔍
      - 😯 💣
        - Hóa ra là tôi 👈 🎯 💘

    - Bất ngờ thay, nó không chạy được; tại sao vậy 🚫 ⚙️ ❓
      - Bất ngờ thay, giờ nó chạy được rồi; tại sao vậy? 🎢 ✨
        - 🤯 ⚡ ➡️ 🎉

    - Cái gì chạy được 🐞 🚀
      - thì đừng chạm vào nó 🛑 ✋
        - 👾 💥 🏹 🎯

    ## Trai hay gái 👶 ❓ 🤷 ♂️ ♀️

    ### Xin chào thế giới 👋 🌍 ✨ 💻

    #### Wow, một lập trình viên 🤯 ⌨️ 💡 👩 💻`,

    // Draw elements text
    'draw.lineText': 'Văn bản',
    'draw.geometryText': 'Văn bản',

    // Mind map elements text
    'mind.centralText': 'Chủ đề trung tâm',
    'mind.abstractNodeText': 'Tóm tắt',

    'tutorial.title': 'DPIT Draw MindMap',
    'tutorial.description': 'Bảng trắng tất cả trong một, bao gồm sơ đồ tư duy, lưu đồ, vẽ tự do và hơn thế nữa',
    'tutorial.dataDescription': 'Tất cả dữ liệu được lưu trữ cục bộ trong trình duyệt của bạn',
    'tutorial.appToolbar': 'Xuất, cài đặt ngôn ngữ, ...',
    'tutorial.creationToolbar': 'Chọn một công cụ để bắt đầu sáng tạo',
    'tutorial.themeDescription': 'Chuyển đổi giữa chế độ sáng và tối',
};

export default viTranslations;
