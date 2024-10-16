import React, { useState, useRef, useCallback } from 'react';

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
  step = 2,
  defaultValue = 100,
  onChange,
}) => {
  const [value, setValue] = useState(defaultValue);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = Math.min(Math.max(x / rect.width, 0), 1);
        const newValue =
          Math.round((percentage * (max - min)) / step) * step + min;
        setValue(newValue);
        onChange && onChange(newValue);
      }
    },
    [min, max, step, onChange]
  );

  const handleMouseDown = useCallback(() => {
    const handleMouseMove = (e: MouseEvent) => handleSliderChange(e);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleSliderChange]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-container">
      <div
        ref={sliderRef}
        className="slider-track"
        onClick={handleSliderChange}
        onMouseDown={handleMouseDown}
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
