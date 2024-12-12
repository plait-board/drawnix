import { createEditor, type Descendant, type Element } from 'slate';
import { Editable, RenderLeafProps, Slate, withReact } from 'slate-react';
import type { CustomText, TextProps } from '@plait/common';
import React, { useMemo, useCallback, useEffect } from 'react';
import { withHistory } from 'slate-history';
import { withText } from './plugins/with-text';

import './styles/index.scss';

export type TextComponentProps = TextProps;

export const Text: React.FC<TextComponentProps> = (
  props: TextComponentProps
) => {
  const { text, readonly, onChange, onComposition, afterInit } = props;
  const renderElement = useCallback(
    (props: any) => <ParagraphElement {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const initialValue: Descendant[] = [text];
  const editor = useMemo(() => {
    const editor = withText(withHistory(withReact(createEditor())));
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
  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value: Descendant[]) => {
        onChange &&
          onChange({
            newText: editor.children[0] as Element,
            operations: editor.operations,
          });
      }}
    >
      <Editable
        className="slate-editable-container plait-text-container"
        renderElement={renderElement}
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
      />
    </Slate>
  );
};

const ParagraphElement = (props: {
  attributes: any;
  children: any;
  element: any;
}) => {
  const { attributes, children, element } = { ...props };
  const style = { textAlign: element.align };
  return (
    <div style={style} {...attributes}>
      {children}
    </div>
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
