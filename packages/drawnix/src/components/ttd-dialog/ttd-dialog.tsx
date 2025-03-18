import { Dialog, DialogContent } from '../dialog/dialog';
import MermaidToDrawnix from './mermaid-to-drawnix';
import { useDrawnix } from '../../hooks/use-drawnix';

export const TTDDialog = ({ container }: { container: HTMLElement | null }) => {
  const { appState, setAppState } = useDrawnix();
  return (
    <Dialog
      open={appState.openDialog}
      onOpenChange={(open) => {
        setAppState({ ...appState, openDialog: open });
      }}
    >
      <DialogContent className="Dialog ttd-dialog" container={container}>
        <MermaidToDrawnix></MermaidToDrawnix>
      </DialogContent>
    </Dialog>
  );
};
