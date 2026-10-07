import { PlaitElement, withOptions } from '@plait/core';
import { withMind } from '@plait/mind';
import { describe, expect, it } from 'vitest';
import { getExportElements } from './common';
import { setupDrawnixTestingBoard } from '../../testing';

const topic = (text: string) => ({ children: [{ text }] });

const buildBoardChildren = (): PlaitElement[] => {
  const grandChild = {
    id: 'node-b1',
    type: 'mind_child',
    data: { topic: topic('B1') },
    children: [],
  };
  const collapsedChild = {
    id: 'node-b',
    type: 'mind_child',
    data: { topic: topic('B') },
    isCollapsed: true,
    children: [grandChild],
  };
  const expandedChild = {
    id: 'node-a',
    type: 'mind_child',
    data: { topic: topic('A') },
    children: [
      {
        id: 'node-a1',
        type: 'mind_child',
        data: { topic: topic('A1') },
        children: [],
      },
    ],
  };
  const mindMap = {
    id: 'mind-map',
    type: 'mindmap',
    points: [[0, 0]],
    data: { topic: topic('root') },
    children: [expandedChild, collapsedChild],
  };
  const geometry = {
    id: 'geometry',
    type: 'geometry',
    shape: 'rectangle',
    points: [
      [0, 0],
      [10, 10],
    ],
  };
  return [mindMap, geometry, expandedChild, collapsedChild, grandChild] as PlaitElement[];
};

describe('getExportElements', () => {
  it('returns undefined when nothing is selected so exports fall back to the full board', () => {
    const { board } = setupDrawnixTestingBoard([withOptions, withMind], buildBoardChildren());

    expect(getExportElements(board)).toBeUndefined();
  });

  it('expands a selected mind map into all of its visible descendants', () => {
    const children = buildBoardChildren();
    const mindMap = children[0];
    const { board } = setupDrawnixTestingBoard([withOptions, withMind], children, {
      selectedElements: [mindMap],
    });

    const elements = getExportElements(board)!;

    expect(elements.map((element) => element.id)).toEqual([
      'mind-map',
      'node-a',
      'node-a1',
      'node-b',
    ]);
  });

  it('stops at collapsed mind nodes', () => {
    const children = buildBoardChildren();
    const collapsedChild = children.find((element) => element.id === 'node-b')!;
    const { board } = setupDrawnixTestingBoard([withOptions, withMind], children, {
      selectedElements: [collapsedChild],
    });

    const elements = getExportElements(board)!;

    expect(elements.map((element) => element.id)).toEqual(['node-b']);
  });

  it('expands a selected mid-level mind node with its subtree', () => {
    const children = buildBoardChildren();
    const expandedChild = children.find((element) => element.id === 'node-a')!;
    const { board } = setupDrawnixTestingBoard([withOptions, withMind], children, {
      selectedElements: [expandedChild],
    });

    const elements = getExportElements(board)!;

    expect(elements.map((element) => element.id)).toEqual(['node-a', 'node-a1']);
  });

  it('returns childless selected elements unchanged', () => {
    const children = buildBoardChildren();
    const geometry = children.find((element) => element.id === 'geometry')!;
    const { board } = setupDrawnixTestingBoard([withOptions, withMind], children, {
      selectedElements: [geometry],
    });

    expect(getExportElements(board)).toEqual([geometry]);
  });

  it('does not duplicate descendants shared by multiple selected elements', () => {
    const children = buildBoardChildren();
    const mindMap = children[0];
    const expandedChild = children.find((element) => element.id === 'node-a')!;
    const { board } = setupDrawnixTestingBoard([withOptions, withMind], children, {
      selectedElements: [expandedChild, mindMap],
    });

    const elements = getExportElements(board)!;

    expect(elements.map((element) => element.id)).toEqual([
      'mind-map',
      'node-a',
      'node-a1',
      'node-b',
    ]);
  });
});
