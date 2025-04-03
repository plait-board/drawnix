import { Dialog, DialogContent } from '../dialog/dialog';
import { useDrawnix } from '../../hooks/use-drawnix';
import './clean-confirm.scss';
import { useBoard } from '@plait-board/react-board';

export const CleanConfirm = ({
  container,
}: {
  container: HTMLElement | null;
}) => {
  const { appState, setAppState } = useDrawnix();
  const board = useBoard();
  return (
    <Dialog
      open={appState.openCleanConfirm}
      onOpenChange={(open) => {
        setAppState({ ...appState, openCleanConfirm: open });
      }}
    >
      <DialogContent className="clean-confirm" container={container}>
        <h2 className="clean-confirm__title">清除画布</h2>
        <p className="clean-confirm__description">
          这将会清除整个画布。你是否要继续?
        </p>
        <div className="clean-confirm__actions">
          <button
            className="clean-confirm__button clean-confirm__button--cancel"
            onClick={() => {
              setAppState({ ...appState, openCleanConfirm: false });
            }}
          >
            取消
          </button>
          <button
            className="clean-confirm__button clean-confirm__button--ok"
            onClick={() => {
              board.deleteFragment(board.children);
              setAppState({ ...appState, openCleanConfirm: false });
            }}
          >
            确认
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
