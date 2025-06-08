import type {
  ImageProps,
  PlaitImageBoard,
  RenderComponentRef,
} from '@plait/common';
import { PlaitBoard } from '@plait/core';
import { createRoot } from 'react-dom/client';
import { Image } from './components/image';
import { withImagePlugin } from './with-image';

export const withCommonPlugin = (board: PlaitBoard) => {
  const newBoard = board as PlaitBoard & PlaitImageBoard;

  newBoard.renderImage = (
    container: Element | DocumentFragment,
    props: ImageProps
  ) => {
    const root = createRoot(container);
    root.render(<Image {...props}></Image>);
    let newProps = { ...props };
    const ref: RenderComponentRef<ImageProps> = {
      destroy: () => {
        setTimeout(() => {
          root.unmount();
        }, 0);
      },
      update: (updatedProps: Partial<ImageProps>) => {
        newProps = { ...newProps, ...updatedProps };
        root.render(<Image {...newProps}></Image>);
      },
    };
    return ref;
  };

  return withImagePlugin(newBoard);
};
