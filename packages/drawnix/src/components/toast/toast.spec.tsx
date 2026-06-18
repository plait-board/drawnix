import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_TOAST_DURATION, Toast, useToast } from './toast';

const ToastHarness = ({ duration }: { duration?: number }) => {
  const { toast, showToast } = useToast();

  return (
    <>
      <button onClick={() => showToast({ message: 'Toast message', duration })}>show</button>
      <Toast toast={toast} />
    </>
  );
};

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not render empty toast content', () => {
    const { container } = render(<Toast toast={null} />);

    expect(container.textContent).toBe('');
  });

  it('renders toast message without requiring a description', () => {
    render(
      <Toast
        toast={{
          id: 1,
          type: 'success',
          message: 'Copied selected items as PNG to clipboard',
        }}
      />
    );

    expect(screen.getByRole('status').textContent).toBe(
      'Copied selected items as PNG to clipboard'
    );
  });

  it('renders optional toast description', () => {
    render(
      <Toast
        toast={{
          id: 2,
          type: 'success',
          message: 'Copied selected items as PNG to clipboard',
          description: '(Transparent background)',
        }}
      />
    );

    expect(screen.getByRole('status').textContent).toContain(
      'Copied selected items as PNG to clipboard'
    );
    expect(screen.getByText('(Transparent background)')).toBeTruthy();
  });

  it('uses a 4s default duration before hiding the toast', () => {
    vi.useFakeTimers();

    render(<ToastHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'show' }));

    expect(screen.getByRole('status').textContent).toBe('Toast message');

    act(() => {
      vi.advanceTimersByTime(DEFAULT_TOAST_DURATION - 1);
    });
    expect(screen.getByRole('status')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('status')).toBeNull();
  });
});
