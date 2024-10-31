import { useBoard } from '@plait/react-board';
import Stack from '../stack';
import { ToolButton } from '../tool-button';
import { ZoomInIcon, ZoomOutIcon } from '../icons';
import classNames from 'classnames';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  BoardTransforms,
  PlaitBoard,
} from '@plait/core';
import { Island } from '../island';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';
import DropdownMenuItem from '../dropdown-menu/DropdownMenuItem';
import { useState } from 'react';

export const ZoomToolbar: React.FC<{}> = () => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  return (
    <Island
      padding={1}
      className={classNames('zoom-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <Stack.Row>
        <ToolButton
          key={0}
          type="button"
          icon={ZoomOutIcon}
          visible={true}
          title={`缩小 — Cmd+-`}
          aria-label={`缩小 — Cmd+-`}
          onPointerDown={() => {}}
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
              title={`自适应`}
              aria-label={`自适应`}
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
            <Island
              className="menu dropdown-menu-container custom-zoom-menu"
              padding={2}
              style={{ zIndex: 2, with: '160px' }}
            >
              <DropdownMenuItem
                data-testid="open-button"
                onSelect={() => {
                  BoardTransforms.fitViewport(board);
                  setZoomMenuOpen(false);
                }}
                aria-label={`${`自适应缩放`}`}
                shortcut={`Cmd+Shift+=`}
              >{`自适应缩放`}</DropdownMenuItem>
              <DropdownMenuItem
                data-testid="open-button"
                onSelect={() => {
                  BoardTransforms.updateZoom(board, 1);
                  setZoomMenuOpen(false);
                }}
                aria-label={`${`缩放至 100%`}`}
                shortcut={`Cmd+0`}
              >{`缩放至 100%`}</DropdownMenuItem>
            </Island>
          </PopoverContent>
        </Popover>
        <ToolButton
          key={2}
          type="button"
          icon={ZoomInIcon}
          visible={true}
          title={`放大 — Cmd++`}
          aria-label={`放大 — Cmd++`}
          onPointerDown={() => {}}
          onPointerUp={() => {
            BoardTransforms.updateZoom(board, board.viewport.zoom + 0.1);
          }}
          className="zoom-in-button"
        />
      </Stack.Row>
    </Island>
  );
};
