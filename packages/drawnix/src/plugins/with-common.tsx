import type {
  ImageProps,
  PlaitImageBoard,
  RenderComponentRef,
} from '@plait/common';
import { PlaitBoard, PlaitI18nBoard } from '@plait/core';
import { createRoot } from 'react-dom/client';
import { Image } from './components/image';
import { withImagePlugin } from './with-image';
import { DrawI18nKey } from '@plait/draw';
import { MindI18nKey } from '@plait/mind';
import { i18nInsidePlaitHook } from '../i18n';
export const withCommonPlugin = (board: PlaitBoard) => {
  const newBoard = board as PlaitBoard & PlaitImageBoard & PlaitI18nBoard;

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

  const { t } = i18nInsidePlaitHook();

  newBoard.getI18nValue = (key: string) => {
    if (key === DrawI18nKey.lineText) {
      return t('draw.lineText');
    }
    if (key === DrawI18nKey.geometryText) {
      return t("draw.geometryText");
    }
    if (key === MindI18nKey.mindCentralText) {
      return t('mind.centralText');
    }
    if (key === MindI18nKey.abstractNodeText) {
      return t('mind.abstractNodeText');
    }

    return null;
  };

  return withImagePlugin(newBoard);
};
