import { ExportImageIcon, GithubIcon } from '../icons';
import DropdownMenuItem from '../dropdown-menu/DropdownMenuItem';
import DropdownMenuItemLink from '../dropdown-menu/DropdownMenuItemLink';

import './DefaultItems.scss';
import { useBoard } from '@plait/react-board';
import { getSelectedElements } from '@plait/core';
import { base64ToBlob, boardToImage, download } from '../../utils';

export const SaveAsImage = () => {
  const board = useBoard();

  return (
    <DropdownMenuItem
      icon={ExportImageIcon}
      data-testid="image-export-button"
      onSelect={() => {
        const selectedElements = getSelectedElements(board);
        boardToImage(board, {
          elements: selectedElements.length > 0 ? selectedElements : undefined,
        }).then((image) => {
          if (image) {
            const pngImage = base64ToBlob(image);
            const imageName = `drawnix-${new Date().getTime()}.png`;
            download(pngImage, imageName);
          }
        });
      }}
      shortcut={`Cmd+Shift+E`}
      aria-label={''}
    >
      {'导出图片'}
    </DropdownMenuItem>
  );
};
SaveAsImage.displayName = 'SaveAsImage';

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
    </>
  );
};
Socials.displayName = 'Socials';
