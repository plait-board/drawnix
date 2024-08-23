import {
  ExportImageIcon,
  GithubIcon,
  OpenFileIcon,
  SaveFileIcon,
} from '../icons';
import DropdownMenuItem from '../dropdown-menu/DropdownMenuItem';
import DropdownMenuItemLink from '../dropdown-menu/DropdownMenuItemLink';

import './default-items.scss';
import { useBoard, useListRender } from '@plait/react-board';
import {
  BoardTransforms,
  getSelectedElements,
  initializeViewBox,
  initializeViewportContainer,
  PlaitBoard,
  PlaitElement,
  PlaitTheme,
  ThemeColorMode,
  updateViewportOffset,
  Viewport,
} from '@plait/core';
import { base64ToBlob, boardToImage, download } from '../../utils';
import { loadFromJSON, saveAsJSON } from '../../data/json';

export const SaveToFile = () => {
  const board = useBoard();
  return (
    <DropdownMenuItem
      data-testid="save-button"
      onSelect={() => {
        saveAsJSON(board);
      }}
      icon={SaveFileIcon}
      aria-label={`${`保存文件`}`}
    >{`保存文件`}</DropdownMenuItem>
  );
};
SaveToFile.displayName = 'SaveToFile';

export const OpenFile = () => {
  const board = useBoard();
  const listRender = useListRender();
  const clearAndLoad = (
    value: PlaitElement[],
    viewport?: Viewport,
    theme?: PlaitTheme
  ) => {
    board.children = value;
    board.viewport = viewport || { zoom: 1 };
    board.theme = theme || { themeColorMode: ThemeColorMode.default };
    listRender.update(board.children, {
      board: board,
      parent: board,
      parentG: PlaitBoard.getElementHost(board),
    });
    BoardTransforms.fitViewport(board);
  };
  return (
    <DropdownMenuItem
      data-testid="open-button"
      onSelect={() => {
        loadFromJSON(board).then((data) => {
          clearAndLoad(data.elements, data.viewport);
        });
      }}
      icon={OpenFileIcon}
      aria-label={`${`打开`}`}
    >{`打开`}</DropdownMenuItem>
  );
};
OpenFile.displayName = 'OpenFile';

export const SaveAsImage = () => {
  const board = useBoard();
  return (
    <DropdownMenuItem
      icon={ExportImageIcon}
      data-testid="image-export-button"
      onSelect={() => {
        const selectedElements = getSelectedElements(board);
        boardToImage(board, {
          elements: selectedElements.length > 0 ? selectedElements : undefined,
        }).then((image) => {
          if (image) {
            const pngImage = base64ToBlob(image);
            const imageName = `drawnix-${new Date().getTime()}.png`;
            download(pngImage, imageName);
          }
        });
      }}
      shortcut={`Cmd+Shift+E`}
      aria-label={''}
    >
      {'导出图片'}
    </DropdownMenuItem>
  );
};
SaveAsImage.displayName = 'SaveAsImage';

export const Socials = () => {
  return (
    <>
      <DropdownMenuItemLink
        icon={GithubIcon}
        href="https://github.com/plait-board/drawnix"
        aria-label="GitHub"
      >
        GitHub
      </DropdownMenuItemLink>
    </>
  );
};
Socials.displayName = 'Socials';
