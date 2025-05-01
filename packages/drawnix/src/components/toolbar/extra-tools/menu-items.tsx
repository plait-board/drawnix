import MenuItem from '../../menu/menu-item';
import { MarkdownLogoIcon, MermaidLogoIcon } from '../../icons';
import { DialogType, useDrawnix } from '../../../hooks/use-drawnix';

export const MermaidToDrawnixItem = () => {
  const { appState, setAppState } = useDrawnix();
  return (
    <MenuItem
      data-testid="marmaid-to-drawnix-button"
      onSelect={() => {
        setAppState({
          ...appState,
          openDialogType: DialogType.mermaidToDrawnix,
        });
      }}
      icon={MermaidLogoIcon}
      aria-label={`${`Mermaid 到 Drawnix`}`}
    >{`Mermaid 到 Drawnix`}</MenuItem>
  );
};

MermaidToDrawnixItem.displayName = 'MermaidToDrawnix';

export const MarkdownToDrawnixItem = () => {
  const { appState, setAppState } = useDrawnix();
  return (
    <MenuItem
      data-testid="markdown-to-drawnix-button"
      onSelect={() => {
        setAppState({
          ...appState,
          openDialogType: DialogType.markdownToDrawnix,
        });
      }}
      icon={MarkdownLogoIcon}
      aria-label={`${`Markdown 到 Drawnix`}`}
    >{`Markdown 到 Drawnix`}</MenuItem>
  );
};

MermaidToDrawnixItem.displayName = 'MermaidToDrawnix';
