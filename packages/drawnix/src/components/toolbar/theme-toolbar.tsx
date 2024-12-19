import { useBoard } from '@plait/react-board';
import classNames from 'classnames';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  BoardTransforms,
  ThemeColorMode,
} from '@plait/core';
import { Island } from '../island';

export const ThemeToolbar = () => {
  const board = useBoard();
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
        <option value="default">默认</option>
        <option value="colorful">缤纷</option>
        <option value="soft">柔和</option>
        <option value="retro">复古</option>
        <option value="dark">暗夜</option>
        <option value="starry">星空</option>
      </select>
    </Island>
  );
};
