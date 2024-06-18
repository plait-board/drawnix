import { createEditor, type Descendant, type Element } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import type { TextProps } from '@plait/common';
import { useMemo, useCallback } from 'react';
import { withHistory } from 'slate-history';

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
  const initialValue: Descendant[] = [text];
  const editor = useMemo(() => {
    const editor = withHistory(withReact(createEditor()));
    afterInit && afterInit(editor);
    return editor;
  }, []);
  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value: Descendant[]) => {
        onChange &&
          onChange({
            newText: editor.children[0] as Element,
            operations: editor.operations
          });
      }}
    >
      <Editable
        className="slate-editable-container plait-text-container"
        renderElement={renderElement}
        readOnly={readonly === undefined ? true : readonly}
        onKeyDown={(event) => {
          // for (const hotkey in HOTKEYS) {
          //   if (isHotkey(hotkey, event as any)) {
          //     event.preventDefault();
          //     const mark = HOTKEYS[hotkey];
          //     toggleMark(editor, mark);
          //   }
          // }
        }}
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
