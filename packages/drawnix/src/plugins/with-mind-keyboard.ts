import {
  BoardTransforms,
  Direction,
  PlaitBoard,
  PlaitElement,
  RectangleClient,
  Transforms,
  addSelectedElement,
  clearSelectedElement,
  getSelectedElements,
  getViewportOrigination,
} from '@plait/core';
import { TextManage, getFirstTextEditor, getTextManages } from '@plait/common';
import { MindElement, PlaitMind, editTopic } from '@plait/mind';
import { Editor, Transforms as SlateTransforms } from 'slate';
import { ReactEditor } from 'slate-react';

/**
 * Restores keyboard flow for a mind map.
 *
 * Two upstream behaviours get in the way:
 *
 * 1. Plait only dispatches `board.keyDown` when `!PlaitBoard.hasBeenTextEditing(board)`
 *    (packages/react-board/src/hooks/use-plugin-event.tsx), and `TextManage` turns
 *    Tab/Escape into "leave editing only" (it calls stopPropagation). Every topic
 *    creation flow ends in editing mode, so the next Tab press never reaches the mind
 *    map instead of inserting a child. A plugin cannot observe that key while editing,
 *    so this installs a capture-phase listener that leaves editing first and then
 *    forwards the event to the board, reusing Plait's own hotkey handling.
 *
 *    The arrow keys are deliberately not forwarded. While a topic is being edited the
 *    text editor owns them and they move the caret; navigating the map with them is a
 *    board level action that waits until editing is left (Escape, or clicking the
 *    canvas). Letting them through is the requested behaviour, not a missed shortcut.
 *
 * 2. In a two-sided (`standard`) layout the parent is unreachable with Plait's own
 *    lookup: its layout candidates resolve the parent onto the wrong axis and its
 *    geometry fallback additionally requires the two boxes to overlap on the cross
 *    axis. So "go to the parent" silently does nothing there while "go to the child"
 *    keeps working. The arrow that geometrically points at the parent is therefore
 *    resolved here as well.
 *
 * On top of that, the viewport follows the selection: Plait moves the selection
 * between topics but never scrolls, so a topic outside the visible area is selected
 * without the user seeing it.
 */

const ARROW_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

const hasNavigationModifier = (event: KeyboardEvent) =>
  event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

const getEventDirection = (event: KeyboardEvent): Direction | undefined => {
  switch (event.key) {
    case 'ArrowLeft':
      return Direction.left;
    case 'ArrowRight':
      return Direction.right;
    case 'ArrowUp':
      return Direction.top;
    case 'ArrowDown':
      return Direction.bottom;
    default:
      return undefined;
  }
};

const isNavigationKey = (event: KeyboardEvent) =>
  ARROW_KEYS.includes(event.key) && !hasNavigationModifier(event);

/**
 * A board lives as long as its host element, while plugin listeners outlive React
 * re-renders, so ignore boards that are no longer connected.
 */
const isBoardConnected = (board: PlaitBoard) => {
  try {
    return !!PlaitBoard.getBoardContainer(board)?.isConnected;
  } catch {
    return false;
  }
};

const getChildren = (element: PlaitElement) =>
  (element as PlaitElement & { children?: PlaitElement[] }).children ?? [];

const getRectangleCenter = (board: PlaitBoard, element: PlaitElement) => {
  const rectangle = board.getRectangle(element);
  return rectangle ? RectangleClient.getCenterPoint(rectangle) : undefined;
};

/** The element that contains `element`, if the document nests it inside another one. */
const findParentElement = (board: PlaitBoard, element: PlaitElement) => {
  const visit = (
    elements: readonly PlaitElement[],
    parent: PlaitElement | undefined
  ): { found: boolean; parent?: PlaitElement } => {
    for (const candidate of elements) {
      if (candidate === element) {
        return { found: true, parent };
      }
      const nested = visit(getChildren(candidate), candidate);
      if (nested.found) {
        return nested;
      }
    }
    return { found: false };
  };
  return visit(board.children, undefined).parent;
};

/**
 * The topic being edited is found through its text editor rather than through the
 * board selection: selection is not guaranteed to survive entering editing mode.
 */
const findEditingTopic = (board: PlaitBoard) => {
  const visit = (
    elements: readonly PlaitElement[]
  ): { element: MindElement; textManage: TextManage } | undefined => {
    for (const element of elements) {
      const textManage = getTextManages(element).find((manage) => manage.isEditing);
      if (textManage && MindElement.isMindElement(board, element)) {
        return { element: element as MindElement, textManage };
      }
      const found = visit(getChildren(element));
      if (found) {
        return found;
      }
    }
    return undefined;
  };
  return visit(board.children);
};

/** Plait's mind hotkeys act on the single selected element, so make it this one. */
const selectOnly = (board: PlaitBoard, element: MindElement) => {
  clearSelectedElement(board);
  addSelectedElement(board, element);
};

const selectElement = (board: PlaitBoard, element: MindElement) => {
  selectOnly(board, element);
  const center = getRectangleCenter(board, element);
  if (center) {
    Transforms.setSelection(board, { anchor: center, focus: center });
  }
};

/**
 * A comfortable gap between the selection and the edge of the visible area, in board
 * units at zoom 1, so a followed topic does not end up flush against the border.
 */
const VIEWPORT_FOLLOW_MARGIN = 64;

/**
 * Pans the viewport by the smallest amount that brings the selected topic back into
 * view, so navigating deep into a large map never moves the selection off screen
 * unnoticed. Panning only when needed keeps the surrounding context in place instead
 * of recentring the map on every key press.
 */
const keepSelectionInView = (board: PlaitBoard) => {
  const [selectedElement] = getSelectedElements(board);
  if (!selectedElement) {
    return;
  }
  const rectangle = board.getRectangle(selectedElement);
  const origination = getViewportOrigination(board);
  if (!rectangle || !origination) {
    return;
  }
  const container = PlaitBoard.getViewportContainer(board).getBoundingClientRect();
  if (!container.width || !container.height) {
    return;
  }
  const { zoom } = board.viewport;
  const visibleWidth = container.width / zoom;
  const visibleHeight = container.height / zoom;
  const margin = Math.min(VIEWPORT_FOLLOW_MARGIN / zoom, visibleWidth / 4, visibleHeight / 4);
  const left = origination[0] + margin;
  const top = origination[1] + margin;
  const right = origination[0] + visibleWidth - margin;
  const bottom = origination[1] + visibleHeight - margin;

  let offsetX = 0;
  let offsetY = 0;
  if (rectangle.x < left) {
    offsetX = rectangle.x - left;
  } else if (rectangle.x + rectangle.width > right) {
    offsetX = rectangle.x + rectangle.width - right;
  }
  if (rectangle.y < top) {
    offsetY = rectangle.y - top;
  } else if (rectangle.y + rectangle.height > bottom) {
    offsetY = rectangle.y + rectangle.height - bottom;
  }
  if (offsetX === 0 && offsetY === 0) {
    return;
  }
  BoardTransforms.updateViewport(board, [origination[0] + offsetX, origination[1] + offsetY]);
};

/**
 * Moves one level up when the pressed arrow points at the parent. Returns false when
 * the parent is not in that direction, leaving the key to Plait's own handling.
 */
const selectParentInDirection = (board: PlaitBoard, element: MindElement, direction: Direction) => {
  const parent = findParentElement(board, element);
  if (!parent || !MindElement.isMindElement(board, parent)) {
    return false;
  }
  const center = getRectangleCenter(board, element);
  const parentCenter = getRectangleCenter(board, parent);
  if (!center || !parentCenter) {
    return false;
  }
  const isHorizontal = direction === Direction.left || direction === Direction.right;
  const sign = direction === Direction.right || direction === Direction.bottom ? 1 : -1;
  const delta = isHorizontal ? parentCenter[0] - center[0] : parentCenter[1] - center[1];
  if (delta === 0 || Math.sign(delta) !== sign) {
    return false;
  }
  selectElement(board, parent as MindElement);
  return true;
};

/**
 * Hands the key to Plait, and steps in only when Plait found no target: the board
 * resolves navigation on the next tick, so a topic that is still selected afterwards
 * means nothing moved.
 */
const navigate = (board: PlaitBoard, event: KeyboardEvent, element: MindElement) => {
  const direction = getEventDirection(event);
  board.keyDown(event);
  if (!direction) {
    return;
  }
  setTimeout(() => {
    if (!isBoardConnected(board) || PlaitBoard.hasBeenTextEditing(board)) {
      return;
    }
    // The board resolves navigation on the next tick. An empty selection means it
    // found no target either, so step in for both cases.
    const nowSelected = getSelectedElements(board);
    if (nowSelected.length > 0 && nowSelected[0] !== element) {
      // Plait navigated by itself; the key handler already follows the selection.
      return;
    }
    if (selectParentInDirection(board, element, direction)) {
      keepSelectionInView(board);
    }
  });
};

/** Select the whole topic so the first keystroke replaces the default name. */
const selectEntireTopic = (element: MindElement) => {
  const editor = getFirstTextEditor(element);
  if (!editor) {
    return;
  }
  ReactEditor.focus(editor);
  SlateTransforms.select(editor, {
    anchor: Editor.start(editor, []),
    focus: Editor.end(editor, []),
  });
};

/**
 * `MindTransforms.insertMind` only marks the new root as selected, unlike the child
 * and sibling transforms which call `editTopic`. So typing right after creating a
 * mind map goes nowhere; match the child behaviour and preselect the default name.
 */
const startEditingNewMind = (board: PlaitBoard, element: MindElement) => {
  setTimeout(() => {
    if (!isBoardConnected(board) || PlaitBoard.hasBeenTextEditing(board)) {
      return;
    }
    selectElement(board, element);
    editTopic(element);
    setTimeout(() => selectEntireTopic(element));
  });
};

const getMindIds = (board: PlaitBoard) =>
  new Set(
    board.children.filter((element) => PlaitMind.isMind(element)).map((element) => element.id)
  );

const handleCreatedMind = (board: PlaitBoard, existingMindIds: Set<string>) => {
  if (PlaitBoard.isReadonly(board)) {
    return;
  }
  const createdMind = board.children.find(
    (element) => PlaitMind.isMind(element) && !existingMindIds.has(element.id)
  );
  if (createdMind) {
    startEditingNewMind(board, createdMind as MindElement);
  }
};

/**
 * A mind map is created on pointer down in drawing mode and on pointer up in drag
 * mode, so both entry points are observed.
 */
const observeMindCreation = (board: PlaitBoard) => {
  const { pointerDown, pointerUp } = board;

  board.pointerDown = (event) => {
    const existingMindIds = getMindIds(board);
    pointerDown(event);
    handleCreatedMind(board, existingMindIds);
  };

  board.pointerUp = (event) => {
    const existingMindIds = getMindIds(board);
    pointerUp(event);
    handleCreatedMind(board, existingMindIds);
  };
};

const observeKeyboard = (board: PlaitBoard) => {
  const { keyDown } = board;
  let followScheduled = false;

  /**
   * Runs once per key press, after every keyboard action that may have moved the
   * selection: the keys taken over here as well as the ones Plait handles by itself
   * (Tab, Enter, and navigation it resolves successfully).
   */
  const scheduleKeepSelectionInView = () => {
    if (followScheduled) {
      return;
    }
    followScheduled = true;
    setTimeout(() => {
      followScheduled = false;
      if (!isBoardConnected(board) || PlaitBoard.hasBeenTextEditing(board)) {
        return;
      }
      keepSelectionInView(board);
    });
  };

  board.keyDown = (event) => {
    keyDown(event);
    scheduleKeepSelectionInView();
  };

  window.addEventListener(
    'keydown',
    (event) => {
      if (!isBoardConnected(board)) {
        return;
      }

      // Never interfere with IME composition: while composing, the input method owns
      // the arrow keys, exactly as TextManage assumes (it ignores composing key events
      // too). Otherwise typing Chinese would be interrupted mid-word.
      if (event.isComposing || event.keyCode === 229) {
        return;
      }

      const isNavigation = isNavigationKey(event);

      if (PlaitBoard.hasBeenTextEditing(board)) {
        // While a topic is being edited the text editor owns the arrow keys, so they
        // stay untouched and move the caret inside the topic.
        if (isNavigation) {
          return;
        }
        // Tab is the one key the map keeps while editing: it inserts a child topic.
        // Ordinary typing must stay cheap, so the topic lookup only runs for it.
        if (event.key !== 'Tab') {
          return;
        }
        const editingTopic = findEditingTopic(board);
        if (!editingTopic) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        // Commit the topic and leave editing, then let the board treat the key
        // exactly as it would with nothing being edited.
        editingTopic.textManage.exitCallback?.();
        selectOnly(board, editingTopic.element);
        board.keyDown(event);
        return;
      }

      if (isNavigation) {
        const selectedElements = getSelectedElements(board);
        const [selectedElement] = selectedElements;
        if (selectedElements.length === 1 && MindElement.isMindElement(board, selectedElement)) {
          event.preventDefault();
          event.stopPropagation();
          navigate(board, event, selectedElement as MindElement);
        }
        return;
      }

      // Plait starts editing on the first printable key but prevents the event
      // default, so that character is dropped. Re-insert it once the editor is live.
      if (hasNavigationModifier(event) || event.key.length !== 1) {
        return;
      }
      const selectedElements = getSelectedElements(board);
      const [selectedElement] = selectedElements;
      if (selectedElements.length !== 1 || !MindElement.isMindElement(board, selectedElement)) {
        return;
      }
      const { key } = event;
      setTimeout(() => {
        if (!isBoardConnected(board) || !PlaitBoard.hasBeenTextEditing(board)) {
          return;
        }
        const editor = getFirstTextEditor(selectedElement);
        if (editor) {
          SlateTransforms.insertText(editor, key);
        }
      });
    },
    true
  );
};

export const withMindKeyboard = (board: PlaitBoard): PlaitBoard => {
  observeMindCreation(board);
  if (typeof window !== 'undefined') {
    observeKeyboard(board);
  }
  return board;
};
