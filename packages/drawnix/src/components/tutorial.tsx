import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "../i18n";
import "./tutorial.scss";

export const Tutorial: React.FC = () => {
  const { t } = useI18n();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateScale = () => {
    if (windowSize.width < 768) return 0.6;
    if (windowSize.width < 1200) return 0.8;
    return 1;
  };

  const scale = calculateScale();

  const getArrowPath = (position: string) => {
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1200;

    switch (position) {
      case 'top-left':
        if (isMobile) return "M 80,70 Q 45,60 20,20"; // 移動設備路徑更短
        if (isTablet) return "M 80,70 Q 40,60 18,18"; // 平板路徑適中
        return "M 80,70 Q 35,60 15,15";               // 桌面默認路徑
      
      case 'top-center':
        if (isMobile) return "M 45,90 Q 25,60 45,20"; 
        if (isTablet) return "M 45,90 Q 22,55 45,15";
        return "M 45,90 Q 20,50 45,10";
        
      case 'bottom-right':
        if (isMobile) return "M 30,25 Q 65,25 90,60";
        if (isTablet) return "M 25,25 Q 70,22 100,65";
        return "M 20,25 Q 75,20 105,70";
        
      default:
        return "";
    }
  };

  const getPointerPosition = (position: string) => {
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1200;

    let positionClass = position;
    
    if (!isMobile) {
      if (position === 'top-left') {
        if (isTablet) positionClass += ' tablet-adjusted-left';
      } else if (position === 'top-center') {
        if (isTablet) positionClass += ' tablet-adjusted-center';
      } else if (position === 'bottom-right') {
        if (isTablet) positionClass += ' tablet-adjusted-right';
      }
    }
    
    return positionClass;
  };

  return (
    <div className="drawnix-tutorial">
      <div className="tutorial-overlay">
        <div className="tutorial-content" ref={contentRef}>
          
          <h1 className="brand-title">{t('tutorial.title')}</h1>
          <p className="brand-description">{t('tutorial.description')}</p>
          <p className="brand-tooltip">{t('tutorial.dataDescription')}</p>
          
          <div className={`feature-pointer ${getPointerPosition('top-left')} ${windowSize.width < 768 ? 'mobile' : ''}`}>
            <svg 
              className="pointer-arrow-svg" 
              width={130 * scale} 
              height={100 * scale} 
              viewBox="0 0 130 100"
              style={{ transform: `scale(${scale})` }}
            >
              <defs>
                <marker id="arrow-left" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L6,3 z" fill="#888" />
                </marker>
              </defs>
              <path 
                d={getArrowPath('top-left')}
                fill="none" 
                stroke="#aaa" 
                strokeWidth="1.5" 
                markerEnd="url(#arrow-left)" 
              />
            </svg>
            <div className="pointer-content">
              <p>{t('tutorial.appToolbar')}</p>
            </div>
          </div>
          
          <div className={`feature-pointer ${getPointerPosition('top-center')} ${windowSize.width < 768 ? 'mobile' : ''}`}>
            <svg 
              className="pointer-arrow-svg" 
              width={100 * scale} 
              height={130 * scale} 
              viewBox="0 0 100 130"
              style={{ transform: `scale(${scale})` }}
            >
              <defs>
                <marker id="arrow-top" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L6,3 z" fill="#888" />
                </marker>
              </defs>
              <path 
                d={getArrowPath('top-center')}
                fill="none" 
                stroke="#aaa" 
                strokeWidth="1.5" 
                markerEnd="url(#arrow-top)" 
              />
            </svg>
            <div className="pointer-content">
              <p>{t('tutorial.creationToolbar')}</p>
            </div>
          </div>
          
          <div className={`feature-pointer ${getPointerPosition('bottom-right')} ${windowSize.width < 768 ? 'mobile' : ''}`}>
            <svg 
              className="pointer-arrow-svg" 
              width={180 * scale} 
              height={100 * scale} 
              viewBox="0 0 180 100"
              style={{ transform: `scale(${scale})` }}
            >
              <defs>
                <marker id="arrow-right" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L6,3 z" fill="#888" />
                </marker>
              </defs>
              <path 
                d={getArrowPath('bottom-right')}
                fill="none" 
                stroke="#aaa" 
                strokeWidth="1.5" 
                markerEnd="url(#arrow-right)" 
              />
            </svg>
            <div className="pointer-content">
              <p>{t('tutorial.themeDescription')}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};