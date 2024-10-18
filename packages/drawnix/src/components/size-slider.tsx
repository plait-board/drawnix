import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toFixed } from '@plait/core';
import './size-slider.scss';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export const SizeSlider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 100,
  onChange,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [thumbPercentage, setThumbPercentage] = useState(defaultValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sliderRef.current && thumbRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const thumbRect = thumbRef.current.getBoundingClientRect();
      setThumbPercentage(
        toFixed((thumbRect.width / 2 / sliderRect.width) * 100)
      );
    }
  }, [thumbRef.current, sliderRef.current]);

  const handleSliderChange = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (sliderRef.current && thumbRef.current) {
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const x = event.clientX - sliderRect.left;
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
    [min, max, step, onChange]
  );

  const handlePointerDown = useCallback(() => {
    const handleMouseMove = (e: MouseEvent) => handleSliderChange(e);
    const handleMouseUp = () => {
      document.removeEventListener('pointermove', handleMouseMove);
      document.removeEventListener('pointerup', handleMouseUp);
    };

    document.addEventListener('pointermove', handleMouseMove);
    document.addEventListener('pointerup', handleMouseUp);
  }, [handleSliderChange]);

  let percentage = ((value - min) / (max - min)) * 100;
  if (percentage >= 100 - thumbPercentage) {
    percentage = 100 - thumbPercentage;
  }
  if (percentage <= thumbPercentage) {
    percentage = thumbPercentage;
  }

  return (
    <div className="slider-container">
      <div
        ref={sliderRef}
        className="slider-track"
        onClick={handleSliderChange}
        onPointerDown={(event) => {
          event.preventDefault();
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
