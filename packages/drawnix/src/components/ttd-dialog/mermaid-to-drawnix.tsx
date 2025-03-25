import { useState, useEffect, useDeferredValue } from 'react';
import './mermaid-to-drawnix.scss';
import './ttd-dialog.scss';
import { TTDDialogPanels } from './ttd-dialog-panels';
import { TTDDialogPanel } from './ttd-dialog-panel';
import { TTDDialogInput } from './ttd-dialog-input';
import { TTDDialogOutput } from './ttd-dialog-output';
import { TTDDialogSubmitShortcut } from './ttd-dialog-submit-shortcut';
import { useDrawnix } from '../../hooks/use-drawnix';
import { useBoard } from '@plait-board/react-board';
import {
  getViewportOrigination,
  PlaitBoard,
  PlaitElement,
  Point,
  RectangleClient,
  WritableClipboardOperationType,
} from '@plait/core';
import type { MermaidConfig } from '@drawnix/mermaid-to-drawnix/dist';
import type { MermaidToDrawnixResult } from '@drawnix/mermaid-to-drawnix/dist/interfaces';

export interface MermaidToDrawnixLibProps {
  loaded: boolean;
  api: Promise<{
    parseMermaidToDrawnix: (
      definition: string,
      config?: MermaidConfig
    ) => Promise<MermaidToDrawnixResult>;
  }>;
}

const MERMAID_EXAMPLE =
  'flowchart TD\n A[Christmas] -->|Get money| B(Go shopping)\n B --> C{Let me think}\n C -->|One| D[Laptop]\n C -->|Two| E[iPhone]\n C -->|Three| F[Car]';

const MermaidToDrawnix = () => {
  const { appState, setAppState } = useDrawnix();
  const [mermaidToDrawnixLib, setMermaidToDrawnixLib] =
    useState<MermaidToDrawnixLibProps>({
      loaded: false,
      api: Promise.resolve({
        parseMermaidToDrawnix: async () => ({ elements: [] }),
      }),
    });

  useEffect(() => {
    const loadLib = async () => {
      try {
        const module = await import('@drawnix/mermaid-to-drawnix');
        setMermaidToDrawnixLib({
          loaded: true,
          api: Promise.resolve(module),
        });
      } catch (err) {
        console.error('Failed to load mermaid library:', err);
        setError(new Error('加载 Mermaid 库失败'));
      }
    };
    loadLib();
  }, []);
  const [text, setText] = useState(() => MERMAID_EXAMPLE);
  const [value, setValue] = useState<PlaitElement[]>(() => []);
  const deferredText = useDeferredValue(text.trim());
  const [error, setError] = useState<Error | null>(null);
  const board = useBoard();

  useEffect(() => {
    const convertMermaid = async () => {
      try {
        const api = await mermaidToDrawnixLib.api;
        let ret;
        try {
          ret = await api.parseMermaidToDrawnix(deferredText);
        } catch (err: any) {
          ret = await api.parseMermaidToDrawnix(
            deferredText.replace(/"/g, "'")
          );
        }
        const { elements } = ret;
        setValue(elements);
        setError(null);
      } catch (err: any) {
        setError(err);
      }
    };
    convertMermaid();
  }, [deferredText, mermaidToDrawnixLib]);

  const insertToBoard = () => {
    if (!value.length) {
      return;
    }
    const boardContainerRect =
      PlaitBoard.getBoardContainer(board).getBoundingClientRect();
    let focusPoint = [
      boardContainerRect.width / 2,
      boardContainerRect.height / 2,
    ];
    const zoom = board.viewport.zoom;
    const origination = getViewportOrigination(board);
    const centerX = origination![0] + focusPoint[0] / zoom;
    const centerY = origination![1] + focusPoint[1] / zoom;
    const elements = value;
    const elementRectangle = RectangleClient.getBoundingRectangle(
      elements.map((ele) =>
        RectangleClient.getRectangleByPoints(ele.points as Point[])
      )
    );
    const startPoint = [
      centerX - elementRectangle.width / 2,
      centerY - elementRectangle.height / 2,
    ] as Point;
    board.insertFragment(
      {
        elements: JSON.parse(JSON.stringify(elements)),
      },
      startPoint,
      WritableClipboardOperationType.paste
    );
    setAppState({ ...appState, openDialog: false });
  };

  return (
    <>
      <div className="ttd-dialog-desc">
        目前仅支持
        <a href="https://mermaid.js.org/syntax/flowchart.html" target="_blank">
          流程图
        </a>
        、
        <a
          href="https://mermaid.js.org/syntax/sequenceDiagram.html"
          target="_blank"
        >
          序列图
        </a>
        和
        <a
          href="https://mermaid.js.org/syntax/classDiagram.html"
          target="_blank"
        >
          类图
        </a>
        。其他类型在 Drawnix 中将以图片呈现。
      </div>
      <TTDDialogPanels>
        <TTDDialogPanel label={'Mermaid 语法'}>
          <TTDDialogInput
            input={text}
            placeholder={'在此处编写 Mermaid 图表定义...'}
            onChange={(event) => setText(event.target.value)}
            onKeyboardSubmit={() => {
              insertToBoard();
            }}
          />
        </TTDDialogPanel>
        <TTDDialogPanel
          label={'预览'}
          panelAction={{
            action: () => {
              insertToBoard();
            },
            label: '插入',
          }}
          renderSubmitShortcut={() => <TTDDialogSubmitShortcut />}
        >
          <TTDDialogOutput
            value={value}
            loaded={mermaidToDrawnixLib.loaded}
            error={error}
          />
        </TTDDialogPanel>
      </TTDDialogPanels>
    </>
  );
};
export default MermaidToDrawnix;
