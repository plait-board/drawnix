import { useBoard } from '@plait-board/react-board';
import Stack from '../stack';
import { ToolButton } from '../tool-button';
import { compressIcon, expandIcon, ZoomInIcon, ZoomOutIcon } from '../icons';
import classNames from 'classnames';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  BoardTransforms,
  PlaitBoard,
} from '@plait/core';
import { Island } from '../island';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';
import { useEffect, useState } from 'react';
import Menu from '../menu/menu';
import MenuItem from '../menu/menu-item';
import { useI18n } from '../../i18n';
import { useDrawnix } from '../../hooks/use-drawnix';
import screenfull from 'screenfull';

export const ZoomToolbar = () => {
  const board = useBoard();
  const { t } = useI18n();
  const container = PlaitBoard.getBoardContainer(board);
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  return (
    <Island
      padding={1}
      className={classNames('zoom-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <Stack.Row gap={1}>
        <ToolButton
          key={0}
          type="button"
          icon={ZoomOutIcon}
          visible={true}
          title={t('zoom.out')}
          aria-label={t('zoom.out')}
          onPointerUp={() => {
            BoardTransforms.updateZoom(board, board.viewport.zoom - 0.1);
          }}
          className="zoom-out-button"
        />
        <Popover
          sideOffset={12}
          open={zoomMenuOpen}
          onOpenChange={(open) => {
            setZoomMenuOpen(open);
          }}
          placement="bottom-end"
        >
          <PopoverTrigger asChild>
            <div
              key={1}
              title={t('zoom.fit')}
              aria-label={t('zoom.fit')}
              className={classNames('zoom-menu-trigger', {
                active: zoomMenuOpen,
              })}
              onPointerUp={() => {
                setZoomMenuOpen(!zoomMenuOpen);
              }}
            >
              {Number(((board?.viewport?.zoom || 1) * 100).toFixed(0))}%
            </div>
          </PopoverTrigger>
          <PopoverContent container={container}>
            <Menu
              onSelect={() => {
                setZoomMenuOpen(false);
              }}
            >
              <MenuItem
                data-testid="open-button"
                onSelect={() => {
                  BoardTransforms.fitViewport(board);
                }}
                aria-label={t('zoom.fit')}
                shortcut={`Cmd+Shift+=`}
              >{t('zoom.fit')}</MenuItem>
              <MenuItem
                data-testid="open-button"
                onSelect={() => {
                  BoardTransforms.updateZoom(board, 1);
                }}
                aria-label={t('zoom.100')}
                shortcut={`Cmd+0`}
              >{t('zoom.100')}</MenuItem>
              <FullScreen/>
            </Menu>
          </PopoverContent>
        </Popover>
        <ToolButton
          key={2}
          type="button"
          icon={ZoomInIcon}
          visible={true}
          title={t('zoom.in')}
          aria-label={t('zoom.in')}
          onPointerUp={() => {
            BoardTransforms.updateZoom(board, board.viewport.zoom + 0.1);
          }}
          className="zoom-in-button"
        />
      </Stack.Row>
    </Island>
  );
};
// FullScreen and Reset 
export const FullScreen = () => {
  const { appState, setAppState } = useDrawnix();
  const [isFullEnabled, setFullscreen] = useState(screenfull.isFullscreen);
  const { t } = useI18n();
  useEffect(() => {
    if (screenfull.isEnabled) {
      const handler = () => {
        setFullscreen(screenfull.isFullscreen); 
      };
      screenfull.on("change", handler);
      return () => {
        screenfull.off("change", handler);
      };
    }
  }, []);

  const enterFullscreen = () => {
    if (screenfull.isEnabled) {
      if (!screenfull.isFullscreen) {
        screenfull.request();
      } else {
        screenfull.exit(); 
      }
    } else {
      alert("Fullscreen API Not supported in this browser");
    }

    setAppState({ ...appState });
  };

  return (
    <MenuItem
      icon={isFullEnabled ? compressIcon : expandIcon}
      data-testid="FullScreen-button"
      onSelect={enterFullscreen}
        // shortcut={`Cmd+Shift+0`} Requires user interaction
      aria-label={t(`zoom.reset.screen`)}
    >
      { isFullEnabled?t(`zoom.reset.screen`) :t(`zoom.full.screen`)}
    </MenuItem>
  );
};
FullScreen.displayName = 'Fullscreen';
