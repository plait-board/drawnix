import { Dialog, DialogContent } from '../dialog/dialog';
import { useDrawnix } from '../../hooks/use-drawnix';
import './reset-confirm.scss';

export const ResetConfirm = ({ container }: { container: HTMLElement | null }) => {
  const { appState, setAppState } = useDrawnix();
  return (
    <Dialog
      open={appState.openResetConfirm}
      onOpenChange={(open) => {
        setAppState({ ...appState, openResetConfirm: open });
      }}
    >
      <DialogContent className="Dialog ttd-dialog" container={container}>
        <div>
          <h1>Reset Confirm</h1>
          <p>Are you sure you want to reset the diagram?</p>
          <button
            onClick={() => {
              setAppState({ ...appState, openResetConfirm: false });
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setAppState({ ...appState, openResetConfirm: false });
            }}
          >
            Reset
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
