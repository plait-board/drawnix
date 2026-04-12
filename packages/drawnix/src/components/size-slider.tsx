import React, { useEffect, useRef, useState } from 'react';
import './size-slider.scss';
import classNames from 'classnames';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  disabled?: boolean;
  title?: string;
  variant?: 'default' | 'neutral';
  compact?: boolean;
  onChange?: (value: number) => void;
  beforeStart?: () => void;
  afterEnd?: () => void;
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const getStepPrecision = (step: number) => {
  const stepText = step.toString();
  const decimalIndex = stepText.indexOf('.');
  return decimalIndex === -1 ? 0 : stepText.length - decimalIndex - 1;
};

export const SizeSlider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 100,
  disabled = false,
  onChange,
  beforeStart,
  afterEnd,
  title,
  variant = 'default',
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const precision = getStepPrecision(step);
  const percentage = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const updateValue = (nextValue: number) => {
    const roundedValue = Number(
      (
        Math.round((nextValue - min) / step) * step + min
      ).toFixed(precision)
    );
    const normalizedValue = clamp(roundedValue, min, max);
    setValue(normalizedValue);
    onChange?.(normalizedValue);
  };

  const updateValueByClientX = (clientX: number) => {
    if (!sliderRef.current) {
      return;
    }
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - sliderRect.left) / sliderRect.width, 0, 1);
    updateValue(min + ratio * (max - min));
  };

  const finishDragging = (currentTarget: HTMLDivElement, pointerId: number) => {
    if (currentTarget.hasPointerCapture(pointerId)) {
      currentTarget.releasePointerCapture(pointerId);
    }
    setIsDragging(false);
    afterEnd?.();
  };

  return (
    <div
      data-tooltip
      title={title}
      className={classNames('slider-container', {
        disabled,
        'slider-container--neutral': variant === 'neutral',
        'slider-container--compact': compact,
      })}
    >
      <div
        ref={sliderRef}
        className="slider-track"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={title || String(value)}
        onPointerDown={(event) => {
          event.preventDefault();
          if (disabled) {
            return;
          }
          beforeStart?.();
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsDragging(true);
          updateValueByClientX(event.clientX);
        }}
        onPointerMove={(event) => {
          if (!isDragging || disabled) {
            return;
          }
          event.preventDefault();
          updateValueByClientX(event.clientX);
        }}
        onPointerUp={(event) => {
          finishDragging(event.currentTarget, event.pointerId);
        }}
        onPointerCancel={(event) => {
          finishDragging(event.currentTarget, event.pointerId);
        }}
        onKeyDown={(event) => {
          if (disabled) {
            return;
          }
          let nextValue = value;

          if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            nextValue = value - step;
          }
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            nextValue = value + step;
          }
          if (event.key === 'Home') {
            nextValue = min;
          }
          if (event.key === 'End') {
            nextValue = max;
          }

          if (nextValue !== value) {
            event.preventDefault();
            updateValue(nextValue);
          }
        }}
      >
        <div
          className="slider-range"
          style={{
            width: `${percentage}%`,
          }}
        />
        <div
          className="slider-thumb"
          style={{
            left: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};
