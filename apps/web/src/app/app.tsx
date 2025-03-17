import { useEffect, useState } from 'react';
import { initializeData } from './initialize-data';
import { Drawnix } from '@drawnix/drawnix';
import { PlaitBoard, PlaitElement, PlaitTheme, Viewport } from '@plait/core';
import { parseMermaidToDrawnix } from '@drawnix/mermaid-to-drawnix';

const DRAWNIX_LOCAL_DATA_KEY = 'drawnix-local-data';

const diagramDefinition = `flowchart TB
  Start([开始恢复指定版本]) -->|"已知参数"| KnownParams["输入参数:
  - clock: 目标版本
  - clock_cursor: 基础版本"]
  
  KnownParams -->|"1. 查询更新数据"| GetUpdates["查询所有更新数据
  WHERE clock >= clock_cursor 
  AND clock <= clock
  ORDER BY clock ASC
  
  (包含基础状态和增量更新)"]

  GetUpdates --> InitDoc["创建新YDoc
  new Y.Doc()"]
  
  InitDoc -->|"2. 按序应用"| ApplyUpdates["按clock顺序应用更新
  for update in updates:
      doc.applyUpdate(update)"]
  
  ApplyUpdates -->|"3. 完成"| Complete([得到指定版本])

  %% 补充说明
  Note["说明:
  1. clock_cursor: 基础版本号
  2. clock: 目标版本号
  3. 单次查询即可获取所需数据
  4. 按clock顺序应用可得到目标版本"]

  %% 样式设置
  style Start fill:#f96,stroke:#333,stroke-width:2px
  style Complete fill:#9f9,stroke:#333,stroke-width:2px
  style KnownParams fill:#ff9,stroke:#333,stroke-width:2px
  style GetUpdates fill:#ff9,stroke:#333,stroke-width:2px
  style InitDoc fill:#99f,stroke:#333,stroke-width:2px
  style ApplyUpdates fill:#99f,stroke:#333,stroke-width:2px
  style Note fill:#fff,stroke:#333,stroke-width:1px`;

export function App() {
  const [value, setValue] = useState<{
    children: PlaitElement[];
    viewport?: Viewport;
    theme?: PlaitTheme;
  }>(() => {
    const localData = localStorage.getItem(DRAWNIX_LOCAL_DATA_KEY);
    if (localData) {
      return JSON.parse(localData);
    }
    return { children: initializeData };
  });

  useEffect(() => {
    async function initializeMermaid() {
      try {
        const { elements } = await parseMermaidToDrawnix(diagramDefinition, {
          themeVariables: {
            fontSize: '25px',
          },
        });
        setValue(prev => ({ ...prev, children: elements }));
      } catch (e) {
        console.error('Failed to parse Mermaid diagram:', e);
      }
    }
    initializeMermaid();
  }, []);

  return (
    <>
      <Drawnix
        value={value.children}
        viewport={value.viewport}
        theme={value.theme}
        onChange={(value) => {
          localStorage.setItem(DRAWNIX_LOCAL_DATA_KEY, JSON.stringify(value));
        }}
        afterInit={(board) => {
          console.log('board initialized');
          console.log(
            `add __drawnix__web__debug_log to window, so you can call add log anywhere, like: window.__drawnix__web__console('some thing')`
          );
          (window as any)['__drawnix__web__console'] = (value: string) => {
            addDebugLog(board, value);
          };
        }}
      ></Drawnix>
    </>
  );
}

const addDebugLog = (board: PlaitBoard, value: string) => {
  const container = PlaitBoard.getBoardContainer(board).closest(
    '.drawnix'
  ) as HTMLElement;
  let consoleContainer = container.querySelector('.drawnix-console');
  if (!consoleContainer) {
    consoleContainer = document.createElement('div');
    consoleContainer.classList.add('drawnix-console');
    container.append(consoleContainer);
  }
  const div = document.createElement('div');
  div.innerHTML = value;
  consoleContainer.append(div);
};

export default App;
