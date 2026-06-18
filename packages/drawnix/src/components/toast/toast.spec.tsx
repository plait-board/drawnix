import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Toast } from './toast';

describe('Toast', () => {
  it('does not render empty toast content', () => {
    const { container } = render(<Toast toast={null} />);

    expect(container.textContent).toBe('');
  });

  it('renders toast message and description', () => {
    render(
      <Toast
        toast={{
          id: 1,
          type: 'success',
          message: 'Copied selected items as PNG to clipboard',
          description: '(Light mode)',
        }}
      />
    );

    expect(screen.getByRole('status').textContent).toContain(
      'Copied selected items as PNG to clipboard'
    );
    expect(screen.getByText('(Light mode)')).toBeTruthy();
  });
});
