import MenuItem from '../../menu/menu-item';
import { MermaidLogoIcon } from '../../icons';
import { useDrawnix } from '../../../hooks/use-drawnix';

export const MermaidToDrawnixItem = () => {
  const { appState, setAppState } = useDrawnix();
  return (
    <MenuItem
      data-testid="save-button"
      onSelect={() => {
        setAppState({
          ...appState,
          openDialog: true,
        });
      }}
      icon={MermaidLogoIcon}
      aria-label={`${`Mermaid 到 Drawnix`}`}
    >{`Mermaid 到 Drawnix`}</MenuItem>
  );
};
MermaidToDrawnixItem.displayName = 'SaveToFile';
