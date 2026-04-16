import React from 'react';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import { useI18n } from '../../../i18n';
import { deleteFragment, duplicateElements, PlaitBoard } from '@plait/core';
import { DuplicateIcon, MoreOptionsIcon, TrashIcon } from '../../icons';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';
import Menu from '../../menu/menu';
import MenuItem from '../../menu/menu-item';
import { useState } from 'react';
import { getShortcutKey } from '../../../utils/common';
import {
  canCopySelectionAs,
  copySelectionAsPng,
  copySelectionAsSvg,
} from '../../../utils/image';

export type MoreOptionsButtonProps = {
  board: PlaitBoard;
};

export const MoreOptionsButton: React.FC<MoreOptionsButtonProps> = ({
  board,
}) => {
  const { t } = useI18n();
  const container = PlaitBoard.getBoardContainer(board);
  const [menuOpen, setMenuOpen] = useState(false);
  const canCopySvg = canCopySelectionAs('svg');
  const canCopyPng = canCopySelectionAs('png');
  const canCopyAny = canCopySvg || canCopyPng;

  return (
    <Popover
      sideOffset={12}
      open={menuOpen}
      onOpenChange={(open) => {
        setMenuOpen(open);
      }}
      placement="bottom-start"
    >
      <PopoverTrigger asChild>
        <ToolButton
          className={classNames('property-button')}
          visible={true}
          selected={menuOpen}
          icon={MoreOptionsIcon}
          type="icon"
          title={t('general.moreOptions')}
          aria-label={t('general.moreOptions')}
          onPointerDown={() => {
            setMenuOpen(!menuOpen);
          }}
        />
      </PopoverTrigger>
      <PopoverContent container={container}>
        <Menu
          className={classNames('popup-toolbar-more-options-menu')}
          onSelect={() => {
            setMenuOpen(false);
          }}
        >
          <MenuItem
            onSelect={() => {
              duplicateElements(board);
            }}
            icon={DuplicateIcon}
            shortcut={getShortcutKey('CtrlOrCmd+D')}
            aria-label={t('general.duplicate')}
          >
            {t('general.duplicate')}
          </MenuItem>
          <MenuItem
            onSelect={() => {
              deleteFragment(board);
            }}
            icon={TrashIcon}
            shortcut={getShortcutKey('Backspace')}
            aria-label={t('general.delete')}
          >
            {t('general.delete')}
          </MenuItem>
          <MenuItem
            onSelect={() => undefined}
            aria-label={t('general.copyToClipboard')}
            disabled={!canCopyAny}
            submenu={
              <Menu
                onSelect={() => {
                  setMenuOpen(false);
                }}
              >
                <MenuItem
                  onSelect={() => {
                    void copySelectionAsSvg(board).catch(() => undefined);
                  }}
                  disabled={!canCopySvg}
                  aria-label={t('general.copyToClipboard.svg')}
                >
                  {t('general.copyToClipboard.svg')}
                </MenuItem>
                <MenuItem
                  onSelect={() => {
                    void copySelectionAsPng(board).catch(() => undefined);
                  }}
                  disabled={!canCopyPng}
                  aria-label={t('general.copyToClipboard.pngWithoutBackground')}
                >
                  {t('general.copyToClipboard.pngWithoutBackground')}
                </MenuItem>
                <MenuItem
                  onSelect={() => {
                    void copySelectionAsPng(board, true).catch(() => undefined);
                  }}
                  disabled={!canCopyPng}
                  aria-label={t('general.copyToClipboard.pngWithBackground')}
                >
                  {t('general.copyToClipboard.pngWithBackground')}
                </MenuItem>
              </Menu>
            }
          >
            {t('general.copyToClipboard')}
          </MenuItem>
        </Menu>
      </PopoverContent>
    </Popover>
  );
};
