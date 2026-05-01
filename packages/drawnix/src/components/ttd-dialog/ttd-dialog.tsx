import { lazy, Suspense } from 'react';
import { Dialog, DialogContent } from '../dialog/dialog';
import { DialogType, useDrawnix } from '../../hooks/use-drawnix';

const MermaidToDrawnix = lazy(() => import('./mermaid-to-drawnix'));
const MarkdownToDrawnix = lazy(() => import('./markdown-to-drawnix'));

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
          <Suspense fallback={null}>
            <MermaidToDrawnix></MermaidToDrawnix>
          </Suspense>
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
          <Suspense fallback={null}>
            <MarkdownToDrawnix></MarkdownToDrawnix>
          </Suspense>
        </DialogContent>
      </Dialog>
    </>
  );
};
