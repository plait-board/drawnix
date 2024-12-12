import React, { useState, useRef, useCallback, useEffect } from 'react';
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
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const thumbPercentageRef = useRef(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sliderRef.current && thumbRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const thumbRect = thumbRef.current.getBoundingClientRect();
      thumbPercentageRef.current = toFixed(
        (thumbRect.width / 2 / sliderRect.width) * 100
      );
    }
  }, [thumbRef, sliderRef]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSliderChange = useCallback(
    throttle(
      (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
        if (sliderRef.current && thumbRef.current) {
          const sliderRect = sliderRef.current.getBoundingClientRect();
          const x = event.clientX - sliderRect.left;
          let percentage = Math.min(Math.max(x / sliderRect.width, 0), 1);
          if (percentage >= (100 - thumbPercentageRef.current) / 100) {
            percentage = 1;
          } else if (percentage <= thumbPercentageRef.current / 100) {
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

  let percentage = ((value - min) / (max - min)) * 100;
  if (percentage >= 100 - thumbPercentageRef.current) {
    percentage = 100 - thumbPercentageRef.current;
  }
  if (percentage <= thumbPercentageRef.current) {
    percentage = thumbPercentageRef.current;
  }

  return (
    <div className={classNames('slider-container', { disabled: disabled })}>
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
