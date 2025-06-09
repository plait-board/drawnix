import { CustomElement, LinkElement } from '@plait/common';
import { CustomEditor, RenderElementPropsFor } from '../custom-types';
import { isUrl, LinkEditor } from '@plait/text-plugins';

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
export const InlineChromiumBugfix = () => (
  <span contentEditable={false} style={{ fontSize: 0 }}>
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

export const LinkComponent = ({
  attributes,
  children,
  element,
}: RenderElementPropsFor<LinkElement>) => {
  return (
    <a
      {...attributes}
      style={{
        textDecoration: 'none',
        cursor: 'inherit',
      }}
      data-url={element.url}
      className="plait-board-link"
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};

export const withInlineLink = (editor: CustomEditor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element: CustomElement) => {
    return (
      ((element as LinkElement).type &&
        ['link'].includes((element as LinkElement).type)) ||
      isInline(element)
    );
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      LinkEditor.wrapLink(editor, text, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      LinkEditor.wrapLink(editor, text, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
