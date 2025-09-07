import React, { useState, useEffect } from "react";
import { useI18n } from "../i18n";
import "./tutorial.scss";

export const Tutorial: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="drawnix-tutorial">
      <div className="tutorial-overlay">
        <div className="tutorial-content">
          
          <h1 className="brand-title">{t('tutorial.title')}</h1>
          <p className="brand-description">{t('tutorial.description')}</p>
          <p className="brand-tooltip">{t('tutorial.dataDescription')}</p>
          
          <div className="feature-pointer top-left">
            <svg className="pointer-arrow-svg" width="130" height="100" viewBox="0 0 130 100">
              <defs>
                <marker id="arrow-left" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L6,3 z" fill="#888" />
                </marker>
              </defs>
              <path d="M 80,70 Q 35,60 15,15" fill="none" stroke="#aaa" strokeWidth="1.5" markerEnd="url(#arrow-left)" />
            </svg>
            <div className="pointer-content">
              <p>{t('tutorial.appToolbar')}</p>
            </div>
          </div>
          
          <div className="feature-pointer top-center">
            <svg className="pointer-arrow-svg" width="100" height="130" viewBox="0 0 100 130">
              <defs>
                <marker id="arrow-top" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L6,3 z" fill="#888" />
                </marker>
              </defs>
              <path d="M 45,90 Q 20,50 45,10" fill="none" stroke="#aaa" strokeWidth="1.5" markerEnd="url(#arrow-top)" />
            </svg>
            <div className="pointer-content">
              <p>{t('tutorial.creationToolbar')}</p>
            </div>
          </div>
          
          <div className="feature-pointer bottom-right">
            <svg className="pointer-arrow-svg" width="180" height="100" viewBox="0 0 180 100">
              <defs>
                <marker id="arrow-right" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L6,3 z" fill="#888" />
                </marker>
              </defs>
              <path d="M 20,25 Q 75,20 105,70" fill="none" stroke="#aaa" strokeWidth="1.5" markerEnd="url(#arrow-right)" />
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