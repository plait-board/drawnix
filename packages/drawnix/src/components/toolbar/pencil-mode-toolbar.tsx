import { ToolButton } from '../tool-button';
import { useBoard } from '@plait/react-board';
import { useDrawnix } from '../../hooks/use-drawnix';
import { setIsPencilMode } from '../../plugins/with-pencil';

export const ClosePencilToolbar = () => {
  const board = useBoard();
  const { appState, setAppState } = useDrawnix();
  return (
    <>
      {appState.isPencilMode && (
        <div className="pencil-mode-toolbar">
          <ToolButton
            type="button"
            visible={true}
            title={`X Pencil`}
            aria-label={`Arrow`}
            label="Pencil X"
            onPointerDown={() => {
              setAppState({ ...appState, isPencilMode: false });
              setIsPencilMode(board, false);
            }}
          />
        </div>
      )}
    </>
  );
};
