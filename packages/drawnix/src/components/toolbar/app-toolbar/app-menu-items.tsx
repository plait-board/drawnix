import {
  ExportImageIcon,
  GithubIcon,
  OpenFileIcon,
  SaveFileIcon,
  TrashIcon,
} from '../../icons';
import { useBoard, useListRender } from '@plait-board/react-board';
import {
  BoardTransforms,
  PlaitBoard,
  PlaitElement,
  PlaitTheme,
  ThemeColorMode,
  Viewport,
} from '@plait/core';
import { loadFromJSON, saveAsJSON } from '../../../data/json';
import MenuItem from '../../menu/menu-item';
import MenuItemLink from '../../menu/menu-item-link';
import { saveAsImage } from '../../../utils/image';
import { useDrawnix } from '../../../hooks/use-drawnix';
import Menu from '../../menu/menu';

export const SaveToFile = () => {
  const board = useBoard();
  return (
    <MenuItem
      data-testid="save-button"
      onSelect={() => {
        saveAsJSON(board);
      }}
      icon={SaveFileIcon}
      aria-label={`${`保存文件`}`}
      shortcut={`Cmd+S`}
    >{`保存文件`}</MenuItem>
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
    <MenuItem
      data-testid="open-button"
      onSelect={() => {
        loadFromJSON(board).then((data) => {
          clearAndLoad(data.elements, data.viewport);
        });
      }}
      icon={OpenFileIcon}
      aria-label={`${`打开`}`}
    >{`打开`}</MenuItem>
  );
};
OpenFile.displayName = 'OpenFile';

export const SaveAsImage = () => {
  const board = useBoard();
  return (
    <MenuItem
      icon={ExportImageIcon}
      data-testid="image-export-button"
      onSelect={() => {
        saveAsImage(board, true);
      }}
      submenu={
        <Menu>
          <MenuItem
            onSelect={() => {
              saveAsImage(board, true);
            }}
            aria-label={'透明背景'}
          >
            PNG
          </MenuItem>
          <MenuItem
            onSelect={() => {
              saveAsImage(board, false);
            }}
            aria-label={'白色背景'}
          >
            JPG
          </MenuItem>
        </Menu>
      }
      shortcut={`Cmd+Shift+E`}
      aria-label={''}
    >
      {'导出图片'}
    </MenuItem>
  );
};
SaveAsImage.displayName = 'SaveAsImage';

export const CleanBoard = () => {
  const { appState, setAppState } = useDrawnix();
  return (
    <MenuItem
      icon={TrashIcon}
      data-testid="reset-button"
      onSelect={() => {
        setAppState({
          ...appState,
          openCleanConfirm: true,
        });
      }}
      shortcut={`Cmd+Backspace`}
      aria-label={'清除画布'}
    >
      {'清除画布'}
    </MenuItem>
  );
};
CleanBoard.displayName = 'CleanBoard';

export const Socials = () => {
  return (
    <MenuItemLink
      icon={GithubIcon}
      href="https://github.com/plait-board/drawnix"
      aria-label="GitHub"
    >
      GitHub
    </MenuItemLink>
  );
};
Socials.displayName = 'Socials';
