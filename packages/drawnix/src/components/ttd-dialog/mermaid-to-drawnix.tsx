import { useState, useEffect, useDeferredValue } from 'react';
import './mermaid-to-drawnix.scss';
import './ttd-dialog.scss';
import { TTDDialogPanels } from './ttd-dialog-panels';
import { TTDDialogPanel } from './ttd-dialog-panel';
import { TTDDialogInput } from './ttd-dialog-input';
import { TTDDialogOutput } from './ttd-dialog-output';
import { TTDDialogSubmitShortcut } from './ttd-dialog-submit-shortcut';
import { useDrawnix } from '../../hooks/use-drawnix';
import { useI18n } from '../../i18n';
import { useBoard } from '@plait-board/react-board';
import {
  getViewportOrigination,
  PlaitBoard,
  PlaitElement,
  PlaitGroupElement,
  Point,
  RectangleClient,
  WritableClipboardOperationType,
} from '@plait/core';
import type { MermaidConfig } from '@plait-board/mermaid-to-drawnix/dist';
import type { MermaidToDrawnixResult } from '@plait-board/mermaid-to-drawnix/dist/interfaces';

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
  const { t, language } = useI18n();
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
        const module = await import('@plait-board/mermaid-to-drawnix');
        setMermaidToDrawnixLib({
          loaded: true,
          api: Promise.resolve(module),
        });
      } catch (err) {
        console.error('Failed to load mermaid library:', err);
        setError(new Error(t('dialog.error.loadMermaid')));
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
    const focusPoint = [
      boardContainerRect.width / 2,
      boardContainerRect.height / 2,
    ];
    const zoom = board.viewport.zoom;
    const origination = getViewportOrigination(board);
    const centerX = origination![0] + focusPoint[0] / zoom;
    const centerY = origination![1] + focusPoint[1] / zoom;
    const elements = value;
    const elementRectangle = RectangleClient.getBoundingRectangle(
      elements
        .filter((ele) => !PlaitGroupElement.isGroup(ele))
        .map((ele) =>
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
    setAppState({ ...appState, openDialogType: null });
  };

  return (
    <>
      <div className="ttd-dialog-desc">
        {language === 'zh' ? (
          <>
            {t('dialog.mermaid.description')}
            {' '}
            <a
              href="https://mermaid.js.org/syntax/flowchart.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('dialog.mermaid.flowchart')}
            </a>
            、
            <a
              href="https://mermaid.js.org/syntax/sequenceDiagram.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('dialog.mermaid.sequence')}
            </a>
            {' '}
            和
            {' '}
            <a
              href="https://mermaid.js.org/syntax/classDiagram.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('dialog.mermaid.class')}
            </a>
            {t('dialog.mermaid.otherTypes')}
          </>
        ) : (
          <>
            {t('dialog.mermaid.description')}
            {' '}
            <a
              href="https://mermaid.js.org/syntax/flowchart.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('dialog.mermaid.flowchart')}
            </a>
            ,{' '}
            <a
              href="https://mermaid.js.org/syntax/sequenceDiagram.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('dialog.mermaid.sequence')}
            </a>
            ,{' '}
            <a
              href="https://mermaid.js.org/syntax/classDiagram.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('dialog.mermaid.class')}
            </a>
            {t('dialog.mermaid.otherTypes')}
          </>
        )}
      </div>
      <TTDDialogPanels>
        <TTDDialogPanel label={t('dialog.mermaid.syntax')}>
          <TTDDialogInput
            input={text}
            placeholder={t('dialog.mermaid.placeholder')}
            onChange={(event) => setText(event.target.value)}
            onKeyboardSubmit={() => {
              insertToBoard();
            }}
          />
        </TTDDialogPanel>
        <TTDDialogPanel
          label={t('dialog.mermaid.preview')}
          panelAction={{
            action: () => {
              insertToBoard();
            },
            label: t('dialog.mermaid.insert'),
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
