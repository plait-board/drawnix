import { Dialog, DialogContent } from '../dialog/dialog';
import MermaidToDrawnix from './mermaid-to-drawnix';
import { DialogType, useDrawnix } from '../../hooks/use-drawnix';
import MarkdownToDrawnix from './markdown-to-drawnix';

export const TTDDialog = ({ container }: { container: HTMLElement | null }) => {
  const { appState, setAppState } = useDrawnix();
  return (
    <>
      <Dialog
        open={appState.openDialogType === DialogType.mermaidToDrawnix}
        onOpenChange={(open) => {
          setAppState({
            ...appState,
            openDialogType: open ? DialogType.mermaidToDrawnix : null,
          });
        }}
      >
        <DialogContent className="Dialog ttd-dialog" container={container}>
          <MermaidToDrawnix></MermaidToDrawnix>
        </DialogContent>
      </Dialog>
      <Dialog
        open={appState.openDialogType === DialogType.markdownToDrawnix}
        onOpenChange={(open) => {
          setAppState({
            ...appState,
            openDialogType: open ? DialogType.markdownToDrawnix : null,
          });
        }}
      >
        <DialogContent className="Dialog ttd-dialog" container={container}>
          <MarkdownToDrawnix></MarkdownToDrawnix>
        </DialogContent>
      </Dialog>
    </>
  );
};
