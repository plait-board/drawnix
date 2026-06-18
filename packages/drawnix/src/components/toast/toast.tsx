import classNames from 'classnames';
import type { DrawnixToast } from '../../hooks/use-drawnix';
import './toast.scss';

export const Toast = ({ toast }: { toast: DrawnixToast | null }) => {
  if (!toast) {
    return null;
  }

  return (
    <div className="drawnix-toast-wrapper" aria-live="polite" aria-atomic="true">
      <div role="status" className={classNames('drawnix-toast', `drawnix-toast--${toast.type}`)}>
        <div className="drawnix-toast__message">{toast.message}</div>
        {toast.description && <div className="drawnix-toast__description">{toast.description}</div>}
      </div>
    </div>
  );
};
