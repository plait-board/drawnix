import { render } from '@testing-library/react';

import DrawnixBoard from './drawnix-board';

describe('Drawnix', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DrawnixBoard />);
    expect(baseElement).toBeTruthy();
  });
});
