import type { ReactNode } from 'react';
import classNames from 'classnames';

interface TTDDialogPanelProps {
  label: string;
  children: ReactNode;
  panelAction?: {
    label: string;
    action: () => void;
    icon?: ReactNode;
  };
  panelActionDisabled?: boolean;
  onTextSubmitInProgress?: boolean;
  renderTopRight?: () => ReactNode;
  renderSubmitShortcut?: () => ReactNode;
  renderBottomRight?: () => ReactNode;
}

export const TTDDialogPanel = ({
  label,
  children,
  panelAction,
  panelActionDisabled = false,
  onTextSubmitInProgress,
  renderTopRight,
  renderSubmitShortcut,
  renderBottomRight,
}: TTDDialogPanelProps) => {
  return (
    <div className="ttd-dialog-panel">
      <div className="ttd-dialog-panel__header">
        <label>{label}</label>
        {renderTopRight?.()}
      </div>

      {children}
      <div
        className={classNames('ttd-dialog-panel-button-container', {
          invisible: !panelAction,
        })}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <button
          className="ttd-dialog-panel-button drawnix-button "
          onClick={panelAction && panelAction.action}
          disabled={panelActionDisabled || onTextSubmitInProgress}
        >
          <div className={classNames({ invisible: onTextSubmitInProgress })}>
            {panelAction?.label}
            {panelAction?.icon && <span>{panelAction.icon}</span>}
          </div>
        </button>
        {!panelActionDisabled &&
          !onTextSubmitInProgress &&
          renderSubmitShortcut?.()}
        {renderBottomRight?.()}
      </div>
    </div>
  );
};
