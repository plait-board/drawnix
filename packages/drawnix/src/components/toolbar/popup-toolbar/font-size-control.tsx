import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PlaitBoard } from '@plait/core';
import { setTextFontSize } from '../../../transforms/property';
import { FontSizeStepperDownIcon, FontSizeStepperUpIcon } from '../../icons';
import { Select } from '../../select/select';

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
  const inputRef = useRef<HTMLInputElement | null>(null);
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

  const getBaseValue = () => {
    const parsed = Number(draft);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    if (typeof normalizedCurrent === 'number' && normalizedCurrent > 0) {
      return normalizedCurrent;
    }
    return 14;
  };

  const stepBy = (delta: number) => {
    const base = getBaseValue();
    const next = Math.max(1, Math.round(base + delta));
    const value = String(next);
    setDraft(value);
    apply(value);
  };

  const container = PlaitBoard.getBoardContainer(board);

  return (
    <Select.Root
      open={open}
      onOpenChange={setOpen}
      placement={'top-start'}
      sideOffset={12}
      hideSelectedIndicator
      disableInitialHighlight
      disableItemHoverHighlight
    >
      <Select.Trigger asChild>
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
            ref={inputRef}
            className="popup-font-size__input"
            type="number"
            inputMode="numeric"
            value={draft}
            placeholder="14"
            onChange={(event) => setDraft(event.target.value)}
            onBlur={(event) => apply(event.target.value)}
            onPointerUp={(event) => {
              event.stopPropagation();
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                apply(draft);
                (event.target as HTMLInputElement).blur();
              }
            }}
          />
          <div className="popup-font-size__stepper" aria-hidden="false">
            <button
              type="button"
              className="popup-font-size__stepper-button"
              aria-label={`${title} +`}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onPointerUp={(event) => {
                event.stopPropagation();
                stepBy(1);
                inputRef.current?.focus();
              }}
            >
              <FontSizeStepperUpIcon
                className="popup-font-size__stepper-icon"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              className="popup-font-size__stepper-button"
              aria-label={`${title} -`}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onPointerUp={(event) => {
                event.stopPropagation();
                stepBy(-1);
                inputRef.current?.focus();
              }}
            >
              <FontSizeStepperDownIcon
                className="popup-font-size__stepper-icon"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </Select.Trigger>
      <Select.Content
        container={container}
        style={{ minWidth: '4.5rem' }}
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
          return (
            <Select.Item
              key={value}
              value={value}
              textValue={value}
              onPointerUp={() => {
                setDraft(value);
                apply(value);
              }}
            >
              {size}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select.Root>
  );
};
