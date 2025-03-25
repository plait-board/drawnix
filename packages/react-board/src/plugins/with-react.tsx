import {
  type PlaitTextBoard,
  type RenderComponentRef,
  type TextProps,
} from '@plait/common';
import type { PlaitBoard } from '@plait/core';
import { createRoot } from 'react-dom/client';
import { Text } from '@plait-board/react-text';
import { ReactEditor } from 'slate-react';
import type { ReactBoard } from './board';

export const withReact = (board: PlaitBoard & PlaitTextBoard) => {
  const newBoard = board as PlaitBoard & PlaitTextBoard & ReactBoard;

  newBoard.renderText = (
    container: Element | DocumentFragment,
    props: TextProps
  ) => {
    const root = createRoot(container);
    let currentEditor: ReactEditor;
    const text = (
      <Text
        {...props}
        afterInit={(editor) => {
          currentEditor = editor as ReactEditor;
          props.afterInit && props.afterInit(editor);
        }}
      ></Text>
    );
    root.render(text);
    let newProps = { ...props };
    const ref: RenderComponentRef<TextProps> = {
      destroy: () => {
        setTimeout(() => {
          root.unmount();
        }, 0);
      },
      update: (updatedProps: Partial<TextProps>) => {
        const hasUpdated =
          updatedProps &&
          newProps &&
          !Object.keys(updatedProps).every(
            (key) =>
              updatedProps[key as keyof TextProps] ===
              newProps[key as keyof TextProps]
          );
        if (!hasUpdated) {
          return;
        }
        const readonly = ReactEditor.isReadOnly(currentEditor);
        newProps = { ...newProps, ...updatedProps };
        root.render(<Text {...newProps}></Text>);

        if (readonly === true && newProps.readonly === false) {
          setTimeout(() => {
            ReactEditor.focus(currentEditor);
          }, 0);
        } else if (readonly === false && newProps.readonly === true) {
          ReactEditor.blur(currentEditor);
          ReactEditor.deselect(currentEditor);
        }
      },
    };
    return ref;
  };

  return newBoard;
};
