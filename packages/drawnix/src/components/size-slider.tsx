import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { toFixed } from '@plait/core';
import './size-slider.scss';
import classNames from 'classnames';
import { throttle } from 'lodash';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  disabled?: boolean;
  title?: string;
  onChange?: (value: number) => void;
  beforeStart?: () => void;
  afterEnd?: () => void;
}

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
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
   const percentage = ((value - min) / (max - min)) * 100;

  const handleSliderChange = useCallback(
    throttle(
      (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
        if (sliderRef.current && thumbRef.current) {
          const sliderRect = sliderRef.current.getBoundingClientRect();
          const thumbRect = thumbRef.current.getBoundingClientRect();
          const x = event.clientX - sliderRect.left;  
          const thumbPercentage = toFixed(
            (thumbRect.width / 2 / sliderRect.width) * 100
          );
          let percentage = Math.min(Math.max(x / sliderRect.width, 0), 1);
          if (percentage >= (100 - thumbPercentage) / 100) {
            percentage = 1;
          } else if (percentage <= thumbPercentage / 100) {
            percentage = 0;
          }
          const newValue =
            Math.round((percentage * (max - min)) / step) * step + min;
          setValue(newValue);
          onChange && onChange(newValue);
        }
      },
      50,
      { leading: true, trailing: true }
    ),
    [min, max, step, onChange]
  );

  const handlePointerDown = useCallback(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsDragging(true);
      handleSliderChange(e);
    };
    const handleMouseUp = () => {
      document.removeEventListener('pointermove', handleMouseMove);
      document.removeEventListener('pointerup', handleMouseUp);
      afterEnd && afterEnd();
      setTimeout(() => {
        setIsDragging(false);
      }, 0);
    };

    document.addEventListener('pointermove', handleMouseMove);
    document.addEventListener('pointerup', handleMouseUp);
  }, [handleSliderChange]);

  return (
    <div
      data-tooltip
      title={title}
      className={classNames('slider-container', { disabled: disabled })}
    >
      <div
        ref={sliderRef}
        className="slider-track"
        onClick={(event) => {
          if (disabled || isDragging) {
            return;
          }
          handleSliderChange(event);
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          if (disabled) {
            return;
          }
          beforeStart && beforeStart();
          handlePointerDown();
        }}
      >
        <div
          className="slider-range"
          style={{
            width: `${percentage}%`,
          }}
        />
        <div
          ref={thumbRef}
          className="slider-thumb"
          style={{
            left: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};
