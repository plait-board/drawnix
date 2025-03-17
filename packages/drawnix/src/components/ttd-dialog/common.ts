import type { MermaidConfig } from '@drawnix/mermaid-to-drawnix/dist';
import type { MermaidToDrawnixResult } from '@drawnix/mermaid-to-drawnix/dist/interfaces';
import { PlaitBoard, PlaitElement } from '@plait/core';

const resetPreview = ({
  canvasRef,
  setError,
}: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  setError: (error: Error | null) => void;
}) => {
  const canvasNode = canvasRef.current;

  if (!canvasNode) {
    return;
  }
  const parent = canvasNode.parentElement;
  if (!parent) {
    return;
  }
  parent.style.background = '';
  setError(null);
  canvasNode.replaceChildren();
};

export interface MermaidToDrawnixLibProps {
  loaded: boolean;
  api: Promise<{
    parseMermaidToDrawnix: (
      definition: string,
      config?: MermaidConfig
    ) => Promise<MermaidToDrawnixResult>;
  }>;
}

interface ConvertMermaidToDrawnixFormatProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  mermaidToDrawnixLib: MermaidToDrawnixLibProps;
  mermaidDefinition: string;
  setError: (error: Error | null) => void;
  data: React.MutableRefObject<{
    elements: readonly PlaitElement[];
  }>;
}

export const convertMermaidToDrawnix = async ({
  canvasRef,
  mermaidToDrawnixLib,
  mermaidDefinition,
  setError,
  data,
}: ConvertMermaidToDrawnixFormatProps) => {
  const canvasNode = canvasRef.current;
  const parent = canvasNode?.parentElement;

  if (!canvasNode || !parent) {
    return;
  }

  if (!mermaidDefinition) {
    resetPreview({ canvasRef, setError });
    return;
  }

  try {
    const api = await mermaidToDrawnixLib.api;

    let ret;
    try {
      ret = await api.parseMermaidToDrawnix(mermaidDefinition);
    } catch (err: any) {
      ret = await api.parseMermaidToDrawnix(
        mermaidDefinition.replace(/"/g, "'")
      );
    }
    const { elements } = ret;
    setError(null);

    data.current = {
      elements,
    };
  } catch (err: any) {
    setError(err);
  }
};

export const saveMermaidDataToStorage = (mermaidDefinition: string) => {};

export const insertToEditor = ({
  board,
  data,
  text,
  shouldSaveMermaidDataToStorage,
}: {
  board: PlaitBoard;
  data: React.MutableRefObject<{
    elements: readonly PlaitElement[];
  }>;
  text?: string;
  shouldSaveMermaidDataToStorage?: boolean;
}) => {
  const { elements: newElements } = data.current;

  if (!newElements.length) {
    return;
  }

  // app.addElementsFromPasteOrLibrary({
  //   elements: newElements,
  //   files,
  //   position: 'center',
  //   fitToContent: true,
  // });
  // app.setOpenDialog(null);

  if (shouldSaveMermaidDataToStorage && text) {
  }
};
