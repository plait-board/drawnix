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
  WritableClipboardOperationType,
} from '@plait/core';
import { MindElement } from '@plait/mind';

export interface MarkdownToDrawnixLibProps {
  loaded: boolean;
  api: Promise<{
    parseMarkdownToDrawnix: (
      definition: string,
      mainTopic?: string
    ) => MindElement;
  }>;
}

const getMarkdownExample = (language: 'zh' | 'en') => {
  if (language === 'zh') {
    return `# 我开始了

- 让我看看是谁搞出了这个 bug 🕵️ ♂️ 🔍
  - 😯 💣
    - 原来是我 👈 🎯 💘

- 竟然不可以运行，为什么呢 🚫 ⚙️ ❓
  - 竟然可以运行了，为什么呢？🎢 ✨
    - 🤯 ⚡ ➡️ 🎉

- 能运行起来的 🐞 🚀
  - 就不要去动它 🛑 ✋
    - 👾 💥 🏹 🎯
    
## 男孩还是女孩 👶 ❓ 🤷 ♂️ ♀️

### Hello world 👋 🌍 ✨ 💻

#### 哇 是个程序员 🤯 ⌨️ 💡 👩 💻`;
  } else {
    return `# I have started

- Let me see who made this bug 🕵️ ♂️ 🔍
  - 😯 💣
    - Turns out it was me 👈 🎯 💘

- Unexpectedly, it cannot run; why is that 🚫 ⚙️ ❓
  - Unexpectedly, it can run now; why is that? 🎢 ✨
    - 🤯 ⚡ ➡️ 🎉

- What can run 🐞 🚀
  - then do not touch it 🛑 ✋
    - 👾 💥 🏹 🎯
    
## Boy or girl 👶 ❓ 🤷 ♂️ ♀️

### Hello world 👋 🌍 ✨ 💻

#### Wow, a programmer 🤯 ⌨️ 💡 👩 💻`;
  }
};


const MarkdownToDrawnix = () => {
  const { appState, setAppState } = useDrawnix();
  const { t, language } = useI18n();
  const [markdownToDrawnixLib, setMarkdownToDrawnixLib] =
    useState<MarkdownToDrawnixLibProps>({
      loaded: false,
      api: Promise.resolve({
        parseMarkdownToDrawnix: (definition: string, mainTopic?: string) =>
          null as any as MindElement,
      }),
    });

  useEffect(() => {
    const loadLib = async () => {
      try {
        const module = await import('@plait-board/markdown-to-drawnix');
        setMarkdownToDrawnixLib({
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
  const [text, setText] = useState(() => getMarkdownExample(language));
  const [value, setValue] = useState<PlaitElement[]>(() => []);
  const deferredText = useDeferredValue(text.trim());
  const [error, setError] = useState<Error | null>(null);
  const board = useBoard();

  // Update markdown example when language changes
  useEffect(() => {
    setText(getMarkdownExample(language));
  }, [language]);

  useEffect(() => {
    const convertMarkdown = async () => {
      try {
        const api = await markdownToDrawnixLib.api;
        let ret;
        try {
          ret = await api.parseMarkdownToDrawnix(deferredText);
        } catch (err: any) {
          ret = await api.parseMarkdownToDrawnix(
            deferredText.replace(/"/g, "'")
          );
        }
        const mind = ret;
        mind.points = [[0, 0]];
        if (mind) {
          setValue([mind]);
          setError(null);
        }
      } catch (err: any) {
        setError(err);
      }
    };
    convertMarkdown();
  }, [deferredText, markdownToDrawnixLib]);

  const insertToBoard = () => {
    if (!value.length) {
      return;
    }
    const boardContainerRect =
      PlaitBoard.getBoardContainer(board).getBoundingClientRect();
    const focusPoint = [
      boardContainerRect.width / 4,
      boardContainerRect.height / 2 - 20,
    ];
    const zoom = board.viewport.zoom;
    const origination = getViewportOrigination(board);
    const focusX = origination![0] + focusPoint[0] / zoom;
    const focusY = origination![1] + focusPoint[1] / zoom;
    const elements = value;
    board.insertFragment(
      {
        elements: JSON.parse(JSON.stringify(elements)),
      },
      [focusX, focusY],
      WritableClipboardOperationType.paste
    );
    setAppState({ ...appState, openDialogType: null });
  };

  return (
    <>
      <div className="ttd-dialog-desc">
        {t('dialog.markdown.description')}
      </div>
      <TTDDialogPanels>
        <TTDDialogPanel label={t('dialog.markdown.syntax')}>
          <TTDDialogInput
            input={text}
            placeholder={t('dialog.markdown.placeholder')}
            onChange={(event) => setText(event.target.value)}
            onKeyboardSubmit={() => {
              insertToBoard();
            }}
          />
        </TTDDialogPanel>
        <TTDDialogPanel
          label={t('dialog.markdown.preview')}
          panelAction={{
            action: () => {
              insertToBoard();
            },
            label: t('dialog.markdown.insert'),
          }}
          renderSubmitShortcut={() => <TTDDialogSubmitShortcut />}
        >
          <TTDDialogOutput
            value={value}
            loaded={markdownToDrawnixLib.loaded}
            error={error}
          />
        </TTDDialogPanel>
      </TTDDialogPanels>
    </>
  );
};
export default MarkdownToDrawnix;
