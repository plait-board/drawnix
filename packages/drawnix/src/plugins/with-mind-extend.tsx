import type { PlaitBoard, PlaitOptionsBoard } from '@plait/core';
import {
  WithMindPluginKey,
  type EmojiProps,
  type PlaitMindBoard,
  type PlaitMindEmojiBoard,
  type WithMindOptions,
} from '@plait/mind';
import { createRoot } from 'react-dom/client';
import { Emoji } from './components/emoji';
import type { RenderComponentRef } from '@plait/common';

export const withMindExtend = (board: PlaitBoard) => {
  const newBoard = board as PlaitBoard & PlaitMindBoard & PlaitMindEmojiBoard;

  (board as PlaitOptionsBoard).setPluginOptions<WithMindOptions>(
    WithMindPluginKey,
    {
      emojiPadding: 0,
      spaceBetweenEmojis: 4,
    }
  );

  newBoard.renderEmoji = (
    container: Element | DocumentFragment,
    props: EmojiProps
  ) => {
    const emojiContainer = document.createElement('span');
    container.appendChild(emojiContainer);
    const root = createRoot(emojiContainer);
    root.render(<Emoji {...props}></Emoji>);
    let newProps = { ...props };
    const ref: RenderComponentRef<EmojiProps> = {
      destroy: () => {
        setTimeout(() => {
          root.unmount();
        }, 0);
      },
      update: (updatedProps: Partial<EmojiProps>) => {
        newProps = { ...newProps, ...updatedProps };
        root.render(<Emoji {...newProps}></Emoji>);
      },
    };
    return ref;
  };

  return newBoard;
};
