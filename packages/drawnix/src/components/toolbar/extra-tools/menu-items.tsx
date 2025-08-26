import MenuItem from '../../menu/menu-item';
import { MarkdownLogoIcon, MermaidLogoIcon } from '../../icons';
import { DialogType, useDrawnix } from '../../../hooks/use-drawnix';
import { useI18n } from '../../../i18n';

export const MermaidToDrawnixItem = () => {
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();
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
      aria-label={t('extraTools.mermaidToDrawnix')}
    >
      {t('extraTools.mermaidToDrawnix')}
    </MenuItem>
  );
};

MermaidToDrawnixItem.displayName = 'MermaidToDrawnix';

export const MarkdownToDrawnixItem = () => {
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();
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
      aria-label={t('extraTools.markdownToDrawnix')}
    >
      {t('extraTools.markdownToDrawnix')}
    </MenuItem>
  );
};

MarkdownToDrawnixItem.displayName = 'MarkdownToDrawnix';
