import { useBoard } from '@plait/react-board';
import Stack from '../stack';
import { ToolButton } from '../tool-button';
import { ZoomInIcon, ZoomOutIcon } from '../icons';
import classNames from 'classnames';
import { ATTACHED_ELEMENT_CLASS_NAME, BoardTransforms } from '@plait/core';

export const ZoomToolbar: React.FC<{}> = () => {
  const board = useBoard();
  return (
    <Stack.Row
      className={classNames('zoom-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
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
      <div
        key={1}
        title={`重置`}
        aria-label={`重置`}
        className="zoom-reset-button"
        onPointerUp={() => {
          BoardTransforms.updateZoom(board, 1);
        }}
      >
        {Number(((board?.viewport?.zoom || 1) * 100).toFixed(0))}%
      </div>
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
  );
};
