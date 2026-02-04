import React, { useEffect, useMemo, useState } from 'react';
import { PlaitBoard } from '@plait/core';
import { setTextFontSize } from '../../../transforms/property';
import { Island } from '../../island';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../popover/popover';

export type PopupFontSizeControlProps = {
  board: PlaitBoard;
  currentFontSize?: number;
  title: string;
  options?: number[];
};

const DEFAULT_OPTIONS = [10, 12, 14, 18, 24, 36, 48];

export const PopupFontSizeControl: React.FC<PopupFontSizeControlProps> = ({
  board,
  currentFontSize,
  title,
  options = DEFAULT_OPTIONS,
}) => {
  const [open, setOpen] = useState(false);
  const normalizedCurrent = useMemo(() => {
    return Number.isFinite(currentFontSize as number) &&
      (currentFontSize as number) > 0
      ? (currentFontSize as number)
      : undefined;
  }, [currentFontSize]);

  const [draft, setDraft] = useState<string>(
    normalizedCurrent ? String(normalizedCurrent) : ''
  );

  useEffect(() => {
    setDraft(normalizedCurrent ? String(normalizedCurrent) : '');
  }, [normalizedCurrent]);

  const apply = (value: string) => {
    const next = Number(value);
    if (!Number.isFinite(next) || next <= 0) {
      return;
    }
    setTextFontSize(board, next);
  };

  const container = PlaitBoard.getBoardContainer(board);

  return (
    <Popover
      sideOffset={12}
      open={open}
      onOpenChange={(nextOpen) => setOpen(nextOpen)}
      placement={'top'}
    >
      <PopoverTrigger asChild>
        <div
          className="popup-font-size"
          title={title}
          aria-label={title}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onPointerUp={(event) => {
            event.stopPropagation();
          }}
        >
          <input
            className="popup-font-size__input"
            type="number"
            inputMode="numeric"
            value={draft}
            placeholder="14"
            onChange={(event) => setDraft(event.target.value)}
            onBlur={(event) => apply(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                apply(draft);
                (event.target as HTMLInputElement).blur();
              }
            }}
          />
          <button
            type="button"
            className="popup-font-size__trigger"
            aria-label={title}
            onPointerUp={(event) => {
              event.stopPropagation();
              setOpen(!open);
            }}
          >
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              className="popup-font-size__chevron"
              aria-hidden="true"
            >
              <path
                d="M4 6.25L8 10.25L12 6.25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent container={container}>
        <Island padding={2}>
          <div
            className="popup-font-size__menu"
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
            }}
          >
            {options.map((size) => {
              const value = String(size);
              const selected = draft !== '' && Number(draft) === size;
              return (
                <button
                  key={value}
                  type="button"
                  className={`popup-font-size__option${
                    selected ? ' popup-font-size__option--selected' : ''
                  }`}
                  onPointerUp={(event) => {
                    event.stopPropagation();
                    setDraft(value);
                    apply(value);
                    setOpen(false);
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </Island>
      </PopoverContent>
    </Popover>
  );
};
