import { PlaitBoard } from '@plait/core';
import { isValidDrawnixData } from './json';
import { IMAGE_MIME_TYPES, MIME_TYPES } from '../constants';
import { ValueOf } from '../utils/utility-types';
import { DataURL } from '../types';

export const loadFromBlob = async (board: PlaitBoard, blob: Blob | File) => {
  const contents = await parseFileContents(blob);
  let data;
  try {
    data = JSON.parse(contents);
    if (isValidDrawnixData(data)) {
      return data;
    }
    throw new Error('Error: invalid file');
  } catch (error: any) {
    throw new Error('Error: invalid file');
  }
};

export const createFile = (
  blob: File | Blob | ArrayBuffer,
  mimeType: ValueOf<typeof MIME_TYPES>,
  name: string | undefined
) => {
  return new File([blob], name || '', {
    type: mimeType,
  });
};

export const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
  if ('arrayBuffer' in blob) {
    return blob.arrayBuffer();
  }
  // Safari
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("Couldn't convert blob to ArrayBuffer"));
      }
      resolve(event.target.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(blob);
  });
};

export const normalizeFile = async (file: File) => {
  if (!file.type) {
    if (file?.name?.endsWith('.drawnix')) {
      file = createFile(
        await blobToArrayBuffer(file),
        MIME_TYPES.drawnix,
        file.name
      );
    }
  }
  return file;
};

export const parseFileContents = async (blob: Blob | File) => {
  let contents: string;
  if ('text' in Blob) {
    contents = await blob.text();
  } else {
    contents = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(blob, 'utf8');
      reader.onloadend = () => {
        if (reader.readyState === FileReader.DONE) {
          resolve(reader.result as string);
        }
      };
    });
  }
  return contents;
};

export const getDataURL = async (file: Blob | File): Promise<DataURL> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result as DataURL;
      resolve(dataURL);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const isSupportedImageFileType = (type: string | null | undefined) => {
  return !!type && (Object.values(IMAGE_MIME_TYPES) as string[]).includes(type);
};

export const isSupportedImageFile = (
  blob: Blob | null | undefined
): blob is Blob & { type: ValueOf<typeof IMAGE_MIME_TYPES> } => {
  const { type } = blob || {};
  return isSupportedImageFileType(type);
};
