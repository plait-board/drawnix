import { ExportImageIcon, GithubIcon, OpenFileIcon, SaveFileIcon, TrashIcon } from '../../icons';
import { useBoard, useListRender } from '@plait-board/react-board';
import { BoardTransforms, PlaitBoard, PlaitElement, PlaitTheme, Viewport } from '@plait/core';
import { loadFromJSON, saveAsJSON, saveJSON } from '../../../data/json';
import MenuItem from '../../menu/menu-item';
import MenuItemLink from '../../menu/menu-item-link';
import { saveAsPng, saveAsSvg } from '../../../utils/image';
import { useDrawnix } from '../../../hooks/use-drawnix';
import { useI18n } from '../../../i18n';
import Menu from '../../menu/menu';
import MenuItemContentSwitch from '../../menu/menu-item-content-switch';
import { useContext } from 'react';
import { MenuContentPropsContext } from '../../menu/common';
import { EVENT } from '../../../constants';
import { getShortcutKey } from '../../../utils/common';

export const SaveToFile = () => {
  const board = useBoard();
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();
  if (!appState.fileHandle) {
    return null;
  }
  return (
    <MenuItem
      data-testid="save-button"
      onSelect={() => {
        saveJSON(board, appState.fileHandle).then(({ fileHandle }) => {
          setAppState((currentAppState) => ({
            ...currentAppState,
            fileHandle,
          }));
        });
      }}
      icon={SaveFileIcon}
      aria-label={t('menu.saveFile')}
      shortcut={getShortcutKey('CtrlOrCmd+S')}
    >
      {t('menu.saveFile')}
    </MenuItem>
  );
};
SaveToFile.displayName = 'SaveToFile';

export const SaveAsFile = () => {
  const board = useBoard();
  const { setAppState } = useDrawnix();
  const { t } = useI18n();
  return (
    <MenuItem
      data-testid="save-as-button"
      onSelect={() => {
        saveAsJSON(board).then(({ fileHandle }) => {
          setAppState((currentAppState) => ({
            ...currentAppState,
            fileHandle,
          }));
        });
      }}
      icon={SaveFileIcon}
      aria-label={t('menu.saveAsFile')}
      shortcut={getShortcutKey('CtrlOrCmd+Shift+S')}
    >
      {t('menu.saveAsFile')}
    </MenuItem>
  );
};
SaveAsFile.displayName = 'SaveAsFile';

export const OpenFile = () => {
  const board = useBoard();
  const listRender = useListRender();
  const { setAppState } = useDrawnix();
  const { t } = useI18n();
  const clearAndLoad = (value: PlaitElement[], viewport?: Viewport, theme?: PlaitTheme) => {
    board.children = value;
    board.viewport = viewport || { zoom: 1 };
    if (theme) {
      board.theme = theme;
    }
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
        loadFromJSON(board).then(({ data, fileHandle }) => {
          clearAndLoad(data.elements, data.viewport, data.theme);
          setAppState((currentAppState) => ({
            ...currentAppState,
            fileHandle,
          }));
        });
      }}
      icon={OpenFileIcon}
      aria-label={t('menu.open')}
    >
      {t('menu.open')}
    </MenuItem>
  );
};
OpenFile.displayName = 'OpenFile';

export const SaveAsImage = () => {
  const board = useBoard();
  const { appState, setAppState } = useDrawnix();
  const menuContentProps = useContext(MenuContentPropsContext);
  const { t } = useI18n();
  return (
    <MenuItem
      icon={ExportImageIcon}
      data-testid="image-export-button"
      onSelect={() => undefined}
      submenu={
        <Menu
          onSelect={() => {
            const itemSelectEvent = new CustomEvent(EVENT.MENU_ITEM_SELECT, {
              bubbles: true,
              cancelable: true,
            });
            menuContentProps.onSelect?.(itemSelectEvent);
          }}
        >
          <MenuItem
            onSelect={() => {
              saveAsSvg(board);
            }}
            aria-label={t('menu.exportImage.svg')}
            shortcut={getShortcutKey('CtrlOrCmd+Shift+E')}
          >
            {t('menu.exportImage.svg')}
          </MenuItem>
          <MenuItem
            onSelect={() => {
              saveAsPng(board);
            }}
            aria-label={t('menu.exportImage.png')}
          >
            {t('menu.exportImage.png')}
          </MenuItem>
          <MenuItem
            onSelect={(event) => {
              event.preventDefault();
              setAppState((currentAppState) => ({
                ...currentAppState,
                exportTransparent: !currentAppState.exportTransparent,
              }));
            }}
            className="menu-item--setting"
            role="menuitemcheckbox"
            aria-checked={appState.exportTransparent}
            aria-label={t('general.copyToClipboard.transparent')}
          >
            <MenuItemContentSwitch checked={appState.exportTransparent}>
              {t('general.copyToClipboard.transparent')}
            </MenuItemContentSwitch>
          </MenuItem>
        </Menu>
      }
      aria-label={t('menu.exportImage')}
    >
      {t('menu.exportImage')}
    </MenuItem>
  );
};
SaveAsImage.displayName = 'SaveAsImage';

export const CleanBoard = () => {
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();
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
      shortcut={getShortcutKey('CtrlOrCmd+Backspace')}
      aria-label={t('menu.cleanBoard')}
    >
      {t('menu.cleanBoard')}
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
