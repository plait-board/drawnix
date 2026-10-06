import { ATTACHED_ELEMENT_CLASS_NAME, getSelectedElements } from '@plait/core';
import { useBoard } from '@plait-board/react-board';
import classNames from 'classnames';
import { MindElement } from '@plait/mind';
import { Island } from '../island';
import Stack from '../stack';
import { ToolButton } from '../tool-button';
import { useDrawnix } from '../../hooks/use-drawnix';
import { Translations, useI18n } from '../../i18n';
import { getShortcutKey } from '../../utils/common';
import './keyboard-hint.scss';

/**
 * Shortcut hints for the selected mind map topic, grouped by the scope the keys act on.
 *
 * A mind map is driven by keys that no button exposes (Tab, Enter, the arrow keys,
 * Space — see `with-mind-keyboard`), so hints shown while a topic is selected are the
 * only place they can be discovered. The board level keys are listed next to them,
 * because they keep working while a topic is selected and are easy to forget.
 *
 * The hints can be switched off in the app menu and closed in place with the button
 * here. Both write the same `keyboardHintVisible` state, so the menu switch always
 * reflects what is on screen.
 *
 * The hints describe keys, so they are not shown on touch devices.
 */

type KeyboardHint = {
  /** The key part of the hint, rendered as a badge. */
  shortcut: string;
  translationKey: keyof Translations;
};

type KeyboardHintGroup = {
  titleKey: keyof Translations;
  hints: KeyboardHint[];
};

const ANY_KEY_SHORTCUT = 'any key';

const MIND_HINTS: KeyboardHint[] = [
  { shortcut: 'Tab', translationKey: 'keyboardHint.tab' },
  { shortcut: 'Enter', translationKey: 'keyboardHint.enter' },
  { shortcut: 'ArrowUp,ArrowDown,ArrowLeft,ArrowRight', translationKey: 'keyboardHint.arrows' },
  { shortcut: 'Space', translationKey: 'keyboardHint.space' },
  { shortcut: 'Backspace', translationKey: 'keyboardHint.backspace' },
  { shortcut: ANY_KEY_SHORTCUT, translationKey: 'keyboardHint.typing' },
  { shortcut: 'CtrlOrCmd+Z', translationKey: 'keyboardHint.undo' },
];

const CANVAS_HINTS: KeyboardHint[] = [
  { shortcut: 'CtrlOrCmd+D', translationKey: 'keyboardHint.duplicate' },
  { shortcut: 'CtrlOrCmd+S', translationKey: 'keyboardHint.save' },
  { shortcut: 'CtrlOrCmd+Shift+S', translationKey: 'keyboardHint.saveAs' },
  { shortcut: 'CtrlOrCmd+Shift+E', translationKey: 'keyboardHint.exportSvg' },
  { shortcut: 'CtrlOrCmd+U', translationKey: 'keyboardHint.insertImage' },
  { shortcut: 'CtrlOrCmd++', translationKey: 'keyboardHint.zoomIn' },
  { shortcut: 'CtrlOrCmd+-', translationKey: 'keyboardHint.zoomOut' },
  { shortcut: 'CtrlOrCmd+0', translationKey: 'keyboardHint.zoomReset' },
];

const KEYBOARD_HINT_GROUPS: KeyboardHintGroup[] = [
  { titleKey: 'keyboardHint.mindGroup', hints: MIND_HINTS },
  { titleKey: 'keyboardHint.canvasGroup', hints: CANVAS_HINTS },
];

/** Arrow names become the matching glyph, everything else goes through the helper. */
const ARROW_GLYPHS: Record<string, string> = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
};

const getKeyLabel = (key: string) => {
  const trimmed = key.trim();
  return ARROW_GLYPHS[trimmed] ?? getShortcutKey(trimmed);
};

export const getShortcutLabel = (shortcut: string) => {
  if (shortcut === ANY_KEY_SHORTCUT) {
    return shortcut;
  }
  return shortcut
    .split('+')
    .map((key) => key.split(',').map(getKeyLabel).join(' '))
    .join('+');
};

export const KeyboardHint = () => {
  const board = useBoard();
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();

  const selectedElements = getSelectedElements(board);
  const [selectedElement] = selectedElements;
  const isSingleMindTopic =
    selectedElements.length === 1 && MindElement.isMindElement(board, selectedElement);

  if (!appState.keyboardHintVisible || appState.isMobile || !isSingleMindTopic) {
    return null;
  }

  const hideKeyboardHint = () => {
    setAppState((currentAppState) => ({
      ...currentAppState,
      keyboardHintVisible: false,
    }));
  };

  return (
    <Island
      padding={1}
      className={classNames('keyboard-hint', ATTACHED_ELEMENT_CLASS_NAME)}
      data-testid="keyboard-hint"
    >
      <Stack.Row gap={3} align="end" className="keyboard-hint__content">
        {KEYBOARD_HINT_GROUPS.map((group) => (
          <div className="keyboard-hint__group" key={group.titleKey}>
            <div className="keyboard-hint__group-title">{t(group.titleKey)}</div>
            <div className="keyboard-hint__items">
              {group.hints.map((hint) => (
                <div className="keyboard-hint__item" key={hint.translationKey}>
                  <kbd className="keyboard-hint__key">{getShortcutLabel(hint.shortcut)}</kbd>
                  <span className="keyboard-hint__label">{t(hint.translationKey)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <ToolButton
          type="icon"
          size="small"
          visible={true}
          className="keyboard-hint__close"
          label="×"
          title={t('keyboardHint.close')}
          aria-label={t('keyboardHint.close')}
          data-testid="keyboard-hint-close"
          onPointerUp={() => {
            hideKeyboardHint();
          }}
        />
      </Stack.Row>
    </Island>
  );
};

KeyboardHint.displayName = 'KeyboardHint';
