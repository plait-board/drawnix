import React, { useRef, useState } from 'react';
import {
  DEFAULT_FREEHAND_STROKE_WIDTH,
  FREEHAND_STROKE_WIDTH_STEP,
  MAX_FREEHAND_STROKE_WIDTH,
  MIN_FREEHAND_STROKE_WIDTH,
} from '../../../plugins/freehand/type';

const MIN_VISUAL_STROKE_WIDTH = 2;

const MAX_VISUAL_STROKE_WIDTH = 16;

const clampStrokeWidth = (value: number) => {
  return Math.min(
    MAX_FREEHAND_STROKE_WIDTH,
    Math.max(MIN_FREEHAND_STROKE_WIDTH, value)
  );
};

const roundStrokeWidth = (value: number) => {
  const rounded =
    Math.round(value / FREEHAND_STROKE_WIDTH_STEP) *
    FREEHAND_STROKE_WIDTH_STEP;
  return Number(clampStrokeWidth(rounded).toFixed(2));
};

const getStrokeWidthPercentage = (value: number) => {
  return (
    ((value - MIN_FREEHAND_STROKE_WIDTH) /
      (MAX_FREEHAND_STROKE_WIDTH - MIN_FREEHAND_STROKE_WIDTH)) *
    100
  );
};

const getVisualStrokeWidth = (value: number) => {
  const ratio =
    (value - MIN_FREEHAND_STROKE_WIDTH) /
    (MAX_FREEHAND_STROKE_WIDTH - MIN_FREEHAND_STROKE_WIDTH);
  return (
    MIN_VISUAL_STROKE_WIDTH +
    ratio * (MAX_VISUAL_STROKE_WIDTH - MIN_VISUAL_STROKE_WIDTH)
  );
};

const formatStrokeWidth = (value: number) => {
  return value.toFixed(2).replace(/\.?0+$/, '');
};

export interface FreehandWidthSliderProps {
  value: number;
  previewColor: string;
  onChange: (value: number) => void;
}

export const FreehandWidthSlider: React.FC<FreehandWidthSliderProps> = ({
  value,
  previewColor,
  onChange,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const normalizedValue =
    value || value === 0 ? clampStrokeWidth(value) : DEFAULT_FREEHAND_STROKE_WIDTH;
  const percentage = getStrokeWidthPercentage(normalizedValue);
  const visualStrokeWidth = getVisualStrokeWidth(normalizedValue);
  const formattedValue = formatStrokeWidth(normalizedValue);

  const updateStrokeWidthByRatio = (ratio: number) => {
    const nextValue = roundStrokeWidth(
      MIN_FREEHAND_STROKE_WIDTH +
        ratio * (MAX_FREEHAND_STROKE_WIDTH - MIN_FREEHAND_STROKE_WIDTH)
    );
    if (nextValue !== normalizedValue) {
      onChange(nextValue);
    }
  };

  const updateStrokeWidth = (clientX: number) => {
    if (!sliderRef.current) {
      return;
    }
    const rect = sliderRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    updateStrokeWidthByRatio(ratio);
  };

  const finishDragging = (currentTarget: HTMLDivElement, pointerId: number) => {
    if (currentTarget.hasPointerCapture(pointerId)) {
      currentTarget.releasePointerCapture(pointerId);
    }
    setIsDragging(false);
  };

  return (
    <div className="freehand-width-slider">
      <div
        ref={sliderRef}
        className="freehand-width-slider-track"
        role="slider"
        tabIndex={0}
        title={formattedValue}
        aria-label="Brush width"
        aria-orientation="horizontal"
        aria-valuemin={MIN_FREEHAND_STROKE_WIDTH}
        aria-valuemax={MAX_FREEHAND_STROKE_WIDTH}
        aria-valuenow={normalizedValue}
        aria-valuetext={formattedValue}
        onPointerDown={(event) => {
          if (event.button !== 0) {
            return;
          }
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsDragging(true);
          updateStrokeWidth(event.clientX);
        }}
        onPointerMove={(event) => {
          if (isDragging) {
            event.preventDefault();
            updateStrokeWidth(event.clientX);
          }
        }}
        onPointerUp={(event) => {
          finishDragging(event.currentTarget, event.pointerId);
        }}
        onPointerCancel={(event) => {
          finishDragging(event.currentTarget, event.pointerId);
        }}
        onKeyDown={(event) => {
          let nextValue = normalizedValue;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            nextValue = roundStrokeWidth(
              normalizedValue - FREEHAND_STROKE_WIDTH_STEP
            );
          }
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            nextValue = roundStrokeWidth(
              normalizedValue + FREEHAND_STROKE_WIDTH_STEP
            );
          }
          if (event.key === 'Home') {
            nextValue = MIN_FREEHAND_STROKE_WIDTH;
          }
          if (event.key === 'End') {
            nextValue = MAX_FREEHAND_STROKE_WIDTH;
          }
          if (nextValue !== normalizedValue) {
            event.preventDefault();
            updateStrokeWidthByRatio(
              (nextValue - MIN_FREEHAND_STROKE_WIDTH) /
                (MAX_FREEHAND_STROKE_WIDTH - MIN_FREEHAND_STROKE_WIDTH)
            );
          }
        }}
      >
        <div className="freehand-width-slider-track-base"></div>
        <div
          className="freehand-width-slider-track-active"
          style={{ width: `${percentage}%` }}
        ></div>
        <div
          className="freehand-width-slider-indicator"
          style={{ left: `${percentage}%` }}
        >
          <span className="freehand-width-slider-thumb" aria-hidden="true"></span>
          <span
            className="freehand-width-slider-preview"
            style={{
              height: `${visualStrokeWidth}px`,
              backgroundColor: previewColor,
            }}
            aria-hidden="true"
          ></span>
        </div>
      </div>
    </div>
  );
};
