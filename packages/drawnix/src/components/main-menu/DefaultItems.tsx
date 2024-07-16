import { ExportImageIcon, GithubIcon } from '../icons';
import DropdownMenuItem from '../dropdown-menu/DropdownMenuItem';
import DropdownMenuItemLink from '../dropdown-menu/DropdownMenuItemLink';

import './DefaultItems.scss';

// export const SaveToActiveFile = () => {
//   return (
//     <DropdownMenuItem
//       shortcut={''}
//       data-testid="save-button"
//       onSelect={() => {}}
//       icon={GithubIcon}
//       aria-label={`${''}`}
//     >{`${''}`}</DropdownMenuItem>
//   );
// };
// SaveToActiveFile.displayName = 'SaveToActiveFile';

export const SaveAsImage = () => {
  return (
    <DropdownMenuItem
      icon={ExportImageIcon}
      data-testid="image-export-button"
      onSelect={() => {}}
      shortcut={`Cmd+Shift+E`}
      aria-label={''}
    >
      {'导出图片...'}
    </DropdownMenuItem>
  );
};
SaveAsImage.displayName = 'SaveAsImage';

// export const Export = () => {
//   return (
//     <DropdownMenuItem
//       icon={ExportIcon}
//       onSelect={() => {

//       }}
//       data-testid="json-export-button"
//       aria-label={t('buttons.export')}
//     >
//       {t('buttons.export')}
//     </DropdownMenuItem>
//   );
// };
// Export.displayName = 'Export';

export const Socials = () => {
  return (
    <>
      <DropdownMenuItemLink
        icon={GithubIcon}
        href="https://github.com/plait-board/drawnix"
        aria-label="GitHub"
      >
        GitHub
      </DropdownMenuItemLink>
      {/* <DropdownMenuItemLink
        icon={TelegramIcon}
        href="https://t.me/plaitboard"
        aria-label="Telegram"
      >
        {'Telegram'}
      </DropdownMenuItemLink> */}
    </>
  );
};
Socials.displayName = 'Socials';
