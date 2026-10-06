import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const boardState: { selectedElements: any[] } = { selectedElements: [] };
const appState: { keyboardHintVisible: boolean; isMobile: boolean } = {
  keyboardHintVisible: true,
  isMobile: false,
};
const setAppState = vi.fn();

vi.mock('@plait-board/react-board', () => ({
  useBoard: () => ({}),
}));

vi.mock('@plait/core', () => ({
  ATTACHED_ELEMENT_CLASS_NAME: 'attached-element',
  getSelectedElements: () => boardState.selectedElements,
  IS_APPLE: false,
  IS_MAC: false,
}));

vi.mock('../../hooks/use-drawnix', () => ({
  useDrawnix: () => ({ appState, setAppState }),
}));

vi.mock('../../i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('../island', () => ({
  Island: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('../stack', () => ({
  __esModule: true,
  default: {
    Row: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('../tool-button', () => ({
  // Mirrors the real button: the label is the accessible name, not its visible text.
  ToolButton: ({ label, onPointerUp, ...props }: any) => {
    const { visible: _visible, size: _size, type: _type, icon: _icon, ...buttonProps } = props;
    return <button type="button" aria-label={label} onPointerUp={onPointerUp} {...buttonProps} />;
  },
}));

import { KeyboardHint, getShortcutLabel } from './keyboard-hint';

const mindTopic = { id: 'mind-1', data: { topic: {} } };
const shape = { id: 'shape-1', type: 'geometry' };

describe('getShortcutLabel', () => {
  it('turns arrow key names into glyphs', () => {
    expect(getShortcutLabel('ArrowUp,ArrowDown,ArrowLeft,ArrowRight')).toBe('↑ ↓ ← →');
  });

  it('resolves CtrlOrCmd for the platform and keeps the plus signs', () => {
    expect(getShortcutLabel('CtrlOrCmd+Z')).toBe('Ctrl+Z');
  });

  it('leaves a key without a shortcut aside', () => {
    expect(getShortcutLabel('any key')).toBe('any key');
  });
});

describe('KeyboardHint', () => {
  beforeEach(() => {
    boardState.selectedElements = [];
    appState.keyboardHintVisible = true;
    appState.isMobile = false;
    setAppState.mockReset();
  });

  it('renders the mind map and canvas shortcut groups for a selected topic', () => {
    boardState.selectedElements = [mindTopic];

    const { container } = render(<KeyboardHint />);

    expect(container.querySelectorAll('.keyboard-hint__group')).toHaveLength(2);
    expect(screen.getByText('keyboardHint.mindGroup')).toBeTruthy();
    expect(screen.getByText('keyboardHint.canvasGroup')).toBeTruthy();
    expect(screen.getByText('keyboardHint.tab')).toBeTruthy();
    expect(screen.getByText('keyboardHint.save')).toBeTruthy();
    // 7 mind map keys and 8 app/canvas keys
    expect(container.querySelectorAll('.keyboard-hint__key')).toHaveLength(15);
  });

  it('stays hidden when the hints are switched off', () => {
    appState.keyboardHintVisible = false;
    boardState.selectedElements = [mindTopic];

    const { container } = render(<KeyboardHint />);

    expect(container.firstChild).toBeNull();
  });

  it('stays hidden unless a single mind topic is selected', () => {
    const { container, rerender } = render(<KeyboardHint />);
    expect(container.firstChild).toBeNull();

    boardState.selectedElements = [shape];
    rerender(<KeyboardHint />);
    expect(container.firstChild).toBeNull();

    boardState.selectedElements = [mindTopic, { id: 'mind-2', data: { topic: {} } }];
    rerender(<KeyboardHint />);
    expect(container.firstChild).toBeNull();

    boardState.selectedElements = [];
    rerender(<KeyboardHint />);
    expect(container.firstChild).toBeNull();
  });

  it('stays hidden on touch devices', () => {
    appState.isMobile = true;
    boardState.selectedElements = [mindTopic];

    const { container } = render(<KeyboardHint />);

    expect(container.firstChild).toBeNull();
  });

  it('turns the hints off from the close button, leaving every other state untouched', () => {
    boardState.selectedElements = [mindTopic];

    render(<KeyboardHint />);
    fireEvent.pointerUp(screen.getByLabelText('keyboardHint.close'));

    expect(setAppState).toHaveBeenCalledTimes(1);
    const update = setAppState.mock.calls[0][0];
    expect(update({ isMobile: false, keyboardHintVisible: true })).toEqual({
      isMobile: false,
      keyboardHintVisible: false,
    });
  });
});
