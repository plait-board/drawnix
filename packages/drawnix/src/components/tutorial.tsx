import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import './tutorial.css';

type TutorialStep = {
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  translationKey: string;
  stepClass: string; 
};

export const DrawnixTutorial: React.FC = () => {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const targetElementRef = useRef<Element | null>(null);
  const prevStepRef = useRef<number>(-1);

  const steps: TutorialStep[] = [
    { 
      target: '[data-testid="toolbar-hand"]', 
      position: 'top', 
      translationKey: 'tutorial.hand',
      stepClass: 'tutorial-step-hand'
    },
    { 
      target: '[data-testid="toolbar-selection"]', 
      position: 'top', 
      translationKey: 'tutorial.selection',
      stepClass: 'tutorial-step-selection'
    },
    { 
      target: '[data-testid="toolbar-mind"]', 
      position: 'top', 
      translationKey: 'tutorial.mind',
      stepClass: 'tutorial-step-mind'
    },
    { 
      target: '[data-testid="toolbar-text"]', 
      position: 'top', 
      translationKey: 'tutorial.text',
      stepClass: 'tutorial-step-text'
    },
    { 
      target: '[data-testid="toolbar-arrow"]', 
      position: 'top', 
      translationKey: 'tutorial.arrow',
      stepClass: 'tutorial-step-arrow'
    },
    { 
      target: '[data-testid="menu-button"]', 
      position: 'left', 
      translationKey: 'tutorial.menu',
      stepClass: 'tutorial-step-menu'
    }
  ];
  
  useEffect(() => {

    if (prevStepRef.current >= 0 && prevStepRef.current < steps.length) {
      const prevTarget = document.querySelector(steps[prevStepRef.current].target);
      if (prevTarget) {
        prevTarget.classList.remove('tutorial-highlight');
      }
    }
    
    const currentTarget = document.querySelector(steps[currentStep].target);
    if (currentTarget) {
      currentTarget.classList.add('tutorial-highlight');
      targetElementRef.current = currentTarget;
    }
    
    prevStepRef.current = currentStep;
    
    return () => {
      if (targetElementRef.current) {
        targetElementRef.current.classList.remove('tutorial-highlight');
      }
    };
  }, [currentStep, steps]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleClose = () => {

    if (targetElementRef.current) {
      targetElementRef.current.classList.remove('tutorial-highlight');
    }
    setVisible(false);
    localStorage.setItem('tutorial-completed', 'true');
  };
  
  if (!visible) return null;
  
  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  return (
    <div className="tutorial-overlay">
      <div 
        className={`tutorial-tooltip ${step.stepClass} tutorial-position-${step.position}`}
      >
        <div className={`tutorial-arrow tutorial-arrow-${step.position}`} />
        <div className="tutorial-content">
          <h3>{t('tutorial.title')}</h3>
          <p>{t(step.translationKey)}</p>
          <div className="tutorial-progress">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`tutorial-progress-dot ${index === currentStep ? 'active' : ''}`} 
              />
            ))}
          </div>
          <div className="tutorial-actions">
            <button 
              className="tutorial-button secondary" 
              onClick={handleClose}
            >
              {t('tutorial.skip')}
            </button>
            <div className="tutorial-navigation">
              <button 
                className="tutorial-button" 
                onClick={handlePrevious}
                disabled={isFirstStep}
              >
                {t('tutorial.previous')}
              </button>
              <button 
                className="tutorial-button primary" 
                onClick={handleNext}
              >
                {isLastStep ? t('tutorial.finish') : t('tutorial.next')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DrawnixTutorial.displayName = 'DrawnixTutorial';