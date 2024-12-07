import { ReactEditor } from 'slate-react';

export const withText = <T extends ReactEditor>(editor: T) => {
  const e = editor as T;
  const { insertData } = e;

  e.insertBreak = () => {
    editor.insertText('\n');
  };

  e.insertData = (data: DataTransfer) => {
    let text = data.getData('text/plain');
    const plaitData = data.getData(`application/x-slate-fragment`);
    if (!plaitData && text) {
      if (text.endsWith('\n')) {
        text = text.substring(0, text.length - 1);
      }
      text = text.trim().replace(/\t+/g, ' ');
      e.insertText(text);
      return;
    }
    insertData(data);
  };

  return e;
};
