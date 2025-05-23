import { createEditor, type Descendant, Range, Transforms } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react';
import {
  CustomElementType,
  type CustomElement,
  type CustomText,
  type LinkElement,
  type ParagraphElement,
  type TextProps,
} from '@plait/common';
import React, { useMemo, useCallback, useEffect, CSSProperties } from 'react';
import { withHistory } from 'slate-history';
import { isUrl, LinkEditor } from '@plait/text-plugins';
import { withText } from './plugins/with-text';
import { CustomEditor, RenderElementPropsFor } from './custom-types';

import './styles/index.scss';

export type TextComponentProps = TextProps;

export const Text: React.FC<TextComponentProps> = (
  props: TextComponentProps
) => {
  const { text, readonly, onChange, onComposition, afterInit } = props;

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const initialValue: Descendant[] = [text];

  const editor = useMemo(() => {
    const editor = withInlineLink(
      withText(withHistory(withReact(createEditor())))
    );
    afterInit && afterInit(editor);
    return editor;
  }, []);

  useEffect(() => {
    if (text === editor.children[0]) {
      return;
    }
    editor.children = [text];
    editor.onChange();
  }, [text, editor]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const { selection } = editor;

    // Default left/right behavior is unit:'character'.
    // This fails to distinguish between two cursor positions, such as
    // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
    // Here we modify the behavior to unit:'offset'.
    // This lets the user step into and out of the inline without stepping over characters.
    // You may wish to customize this further to only use unit:'offset' in specific cases.
    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;
      if (isKeyHotkey('left', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset', reverse: true });
        return;
      }
      if (isKeyHotkey('right', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset' });
        return;
      }
    }
  };

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value: Descendant[]) => {
        onChange &&
          onChange({
            newText: editor.children[0] as ParagraphElement,
            operations: editor.operations,
          });
      }}
    >
      <Editable
        className="slate-editable-container plait-text-container"
        renderElement={(props) => <Element {...props} />}
        renderLeaf={renderLeaf}
        readOnly={readonly === undefined ? true : readonly}
        onCompositionStart={(event) => {
          if (onComposition) {
            onComposition(event as unknown as CompositionEvent);
          }
        }}
        onCompositionUpdate={(event) => {
          if (onComposition) {
            onComposition(event as unknown as CompositionEvent);
          }
        }}
        onCompositionEnd={(event) => {
          if (onComposition) {
            onComposition(event as unknown as CompositionEvent);
          }
        }}
        onKeyDown={onKeyDown}
      />
    </Slate>
  );
};

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props as RenderElementPropsFor<
    CustomElement & { type: string }
  >;
  switch (element.type) {
    case 'link':
      return (
        <LinkComponent {...(props as RenderElementPropsFor<LinkElement>)} />
      );
    default:
      return (
        <ParagraphComponent
          {...(props as RenderElementPropsFor<ParagraphElement>)}
        />
      );
  }
};

const ParagraphComponent = ({
  attributes,
  children,
  element,
}: RenderElementPropsFor<ParagraphElement>) => {
  const style = { textAlign: element.align } as CSSProperties;
  return (
    <div style={style} {...attributes}>
      {children}
    </div>
  );
};

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span contentEditable={false} style={{ fontSize: 0 }}>
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

const LinkComponent = ({
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

const Leaf: React.FC<RenderLeafProps> = ({ children, leaf, attributes }) => {
  if ((leaf as CustomText).bold) {
    children = <strong>{children}</strong>;
  }

  if ((leaf as CustomText).code) {
    children = <code>{children}</code>;
  }

  if ((leaf as CustomText).italic) {
    children = <em>{children}</em>;
  }

  if ((leaf as CustomText).underlined) {
    children = <u>{children}</u>;
  }
  return (
    <span style={{ color: (leaf as CustomText).color }} {...attributes}>
      {children}
    </span>
  );
};

const withInlineLink = (editor: CustomEditor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element: CustomElement) => {
    return ['link'].includes(element.type) || isInline(element);
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
