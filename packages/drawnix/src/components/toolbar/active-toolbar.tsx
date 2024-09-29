import Stack from '../stack';
import { BackgroundColorIcon, StrokeIcon } from '../icons';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  getSelectedElements,
  isSelectionMoving,
  Path,
  PlaitBoard,
  PlaitElement,
  SELECTION_RECTANGLE_BOUNDING_CLASS_NAME,
  SELECTION_RECTANGLE_CLASS_NAME,
  Transforms,
} from '@plait/core';
import React, { useEffect } from 'react';
import { useBoard } from '@plait/react-board';
import { flip, offset, useFloating } from '@floating-ui/react';
import { Island } from '../island';
import classNames from 'classnames';
import { getStrokeByMindElement, MindElement } from '@plait/mind';
import './active-toolbar.scss';
import {
  DrawTransforms,
  getMemorizeKey,
  getStrokeColorByElement,
  isDrawElementClosed,
  PlaitDrawElement,
} from '@plait/draw';
import { ActiveColorToolButton } from './color-tool-button';
import { PropertyTransforms } from '@plait/common';

export type DrawActiveProps = {};

export const ActiveToolbar: React.FC<DrawActiveProps> = ({}) => {
  const board = useBoard();
  const selectedElements = getSelectedElements(board);
  const isOpen = selectedElements.length > 0 && !isSelectionMoving(board);

  const { viewport, selection } = board;
  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(32), flip()],
  });

  let state: { fill: string | undefined; strokeColor: string | undefined } = {
    fill: 'red',
    strokeColor: undefined,
  };

  if (isOpen) {
    state = getElementState(board);
  }

  useEffect(() => {
    if (isOpen) {
      let selectionG = PlaitBoard.getBoardContainer(board).querySelector(
        `.${SELECTION_RECTANGLE_BOUNDING_CLASS_NAME}`
      );
      if (!selectionG) {
        selectionG = PlaitBoard.getBoardContainer(board).querySelector(
          `.${SELECTION_RECTANGLE_CLASS_NAME}`
        );
      }
      refs.setPositionReference(selectionG);
    }
  }, [viewport, selection]);

  return (
    <>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles}>
          <Island
            padding={1}
            className={classNames(
              'active-toolbar',
              ATTACHED_ELEMENT_CLASS_NAME
            )}
          >
            <Stack.Row gap={1}>
              <ActiveColorToolButton
                key={0}
                currentColor={state.fill}
                container={refs.floating.current}
                title={`Fill Color`}
                transparentIcon={BackgroundColorIcon}
                onSelect={(selectedColor: string) => {
                  PropertyTransforms.setFillColor(board, selectedColor, {
                    getMemorizeKey,
                    callback: (element: PlaitElement, path: Path) => {
                      const tableElement =
                        PlaitDrawElement.isElementByTable(element);
                      if (tableElement) {
                        DrawTransforms.setTableFill(
                          board,
                          element,
                          selectedColor,
                          path
                        );
                      } else {
                        if (isDrawElementClosed(element as PlaitDrawElement)) {
                          Transforms.setNode(
                            board,
                            { fill: selectedColor },
                            path
                          );
                        }
                      }
                    },
                  });
                }}
              >
                <label
                  className={classNames('fill-label', 'color-label', {
                    'color-white': state.fill === '#FFFFFF',
                  })}
                  style={{ backgroundColor: state.fill }}
                ></label>
              </ActiveColorToolButton>
              <ActiveColorToolButton
                key={1}
                currentColor={state.strokeColor}
                container={refs.floating.current}
                title={`Stroke`}
                transparentIcon={StrokeIcon}
                onSelect={(selectedColor: string) => {
                  console.log(`selectedColor: ${selectedColor}`);
                  PropertyTransforms.setStrokeColor(board, selectedColor, {
                    getMemorizeKey,
                  });
                }}
              >
                <label
                  className={classNames('stroke-label', 'color-label', {
                    'color-white': state.fill === '#FFFFFF',
                  })}
                  style={{ borderColor: state.strokeColor }}
                ></label>
              </ActiveColorToolButton>
            </Stack.Row>
          </Island>
        </div>
      )}
    </>
  );
};

export const getMindElementState = (
  board: PlaitBoard,
  element: MindElement
) => {
  return {
    fill: element.fill,
    strokeColor: getStrokeByMindElement(board, element),
  };
};

export const getDrawElementState = (
  board: PlaitBoard,
  element: PlaitDrawElement
) => {
  return {
    fill: element.fill,
    strokeColor: getStrokeColorByElement(board, element),
  };
};

export const getElementState = (board: PlaitBoard) => {
  const selectedElement = getSelectedElements(board)[0];
  if (MindElement.isMindElement(board, selectedElement)) {
    return getMindElementState(board, selectedElement);
  }
  return getDrawElementState(board, selectedElement as PlaitDrawElement);
};
