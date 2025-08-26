import { useBoard } from '@plait-board/react-board';
import classNames from 'classnames';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  BoardTransforms,
  ThemeColorMode,
} from '@plait/core';
import { Island } from '../island';
import { useI18n } from '../../i18n';

export const ThemeToolbar = () => {
  const board = useBoard();
  const { t } = useI18n();
  const theme = board.theme;
  return (
    <Island
      padding={1}
      className={classNames('theme-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <select
        onChange={(e) => {
          const value = (e.target as HTMLSelectElement).value;
          BoardTransforms.updateThemeColor(board, value as ThemeColorMode);
        }}
        value={theme.themeColorMode}
      >
        <option value="default">{t('theme.default')}</option>
        <option value="colorful">{t('theme.colorful')}</option>
        <option value="soft">{t('theme.soft')}</option>
        <option value="retro">{t('theme.retro')}</option>
        <option value="dark">{t('theme.dark')}</option>
        <option value="starry">{t('theme.starry')}</option>
      </select>
    </Island>
  );
};
