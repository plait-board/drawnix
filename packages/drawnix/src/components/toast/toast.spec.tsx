import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Toast } from './toast';

describe('Toast', () => {
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
});
