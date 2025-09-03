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
          
          <div className="feature-pointer top-left">
            <div className="pointer-arrow"></div>
            <div className="pointer-content">
              <h3>{t('tutorial.importExport')}</h3>
              <p>{t('tutorial.importExportDesc')}</p>
              <p>{t('tutorial.language')}</p>
            </div>
          </div>
          
          <div className="feature-pointer top-center">
            <div className="pointer-arrow"></div>
            <div className="pointer-content">
              <h3>{t('tutorial.tools')}</h3>
              <p>{t('tutorial.toolsDesc')}</p>
            </div>
          </div>
          
          <div className="feature-pointer top-right">
            <div className="pointer-arrow"></div>
            <div className="pointer-content">
              <h3>{t('tutorial.zoom')}</h3>
              <p>{t('tutorial.zoomDesc')}</p>
            </div>
          </div>
          
          <div className="feature-pointer bottom-right">
            <div className="pointer-arrow"></div>
            <div className="pointer-content">
              <h3>{t('tutorial.theme')}</h3>
              <p>{t('tutorial.themeDesc')}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};