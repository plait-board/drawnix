import { useState, useRef, useEffect, useDeferredValue } from 'react';
import './mermaid-to-drawnix.scss';
import './ttd-dialog.scss';
import {
  convertMermaidToDrawnix,
  insertToEditor,
  MermaidToDrawnixLibProps,
} from './common';
import { TTDDialogPanels } from './ttd-dialog-panels';
import { TTDDialogPanel } from './ttd-dialog-panel';
import { TTDDialogInput } from './ttd-dialog-input';
import { TTDDialogOutput } from './ttd-dialog-output';
import { TTDDialogSubmitShortcut } from './ttd-dialog-submit-shortcut';
import { useDrawnix } from '../../hooks/use-drawnix';
import { useBoard } from '@drawnix/react-board';
import { PlaitElement } from '@plait/core';

const MERMAID_EXAMPLE =
  'flowchart TD\n A[Christmas] -->|Get money| B(Go shopping)\n B --> C{Let me think}\n C -->|One| D[Laptop]\n C -->|Two| E[iPhone]\n C -->|Three| F[Car]';

const MermaidToDrawnix = ({
  mermaidToDrawnixLib,
}: {
  mermaidToDrawnixLib: MermaidToDrawnixLibProps;
}) => {
  const [text, setText] = useState(() => MERMAID_EXAMPLE);
  const deferredText = useDeferredValue(text.trim());
  const [error, setError] = useState<Error | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const data = useRef<{
    elements: readonly PlaitElement[];
  }>({ elements: [] });

  const app = useDrawnix();
  const board = useBoard();

  useEffect(() => {
    convertMermaidToDrawnix({
      canvasRef,
      data,
      mermaidToDrawnixLib,
      setError,
      mermaidDefinition: deferredText,
    }).catch((err: any) => {
      console.error(err);
    });
  }, [deferredText, mermaidToDrawnixLib]);

  useEffect(
    () => () => {
      // debouncedSaveMermaidDefinition.flush();
    },
    []
  );

  const onInsertToEditor = () => {
    insertToEditor({
      board,
      data,
      text,
      shouldSaveMermaidDataToStorage: true,
    });
  };

  return (
    <>
      <div className="ttd-dialog-desc">
        目前仅支持
        <a href="https://mermaid.js.org/syntax/flowchart.html">流程图</a>、
        <a href="https://mermaid.js.org/syntax/sequenceDiagram.html">序列图</a>
        和<a href="https://mermaid.js.org/syntax/classDiagram.html">类图</a>
        。其他类型在 Drawnix 中将以图像呈现。
      </div>
      <TTDDialogPanels>
        <TTDDialogPanel label={'Mermaid 语法'}>
          <TTDDialogInput
            input={text}
            placeholder={'在此处编写 Mermaid 图表定义...'}
            onChange={(event) => setText(event.target.value)}
            onKeyboardSubmit={() => {
              onInsertToEditor();
            }}
          />
        </TTDDialogPanel>
        <TTDDialogPanel
          label={'预览'}
          panelAction={{
            action: () => {
              onInsertToEditor();
            },
            label: '插入',
          }}
          renderSubmitShortcut={() => <TTDDialogSubmitShortcut />}
        >
          <TTDDialogOutput
            canvasRef={canvasRef}
            loaded={mermaidToDrawnixLib.loaded}
            error={error}
          />
        </TTDDialogPanel>
      </TTDDialogPanels>
    </>
  );
};
export default MermaidToDrawnix;
