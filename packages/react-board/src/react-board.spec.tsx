import { render } from '@testing-library/react';

import ReactBoard from './react-board';

describe('ReactBoard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactBoard />);
    expect(baseElement).toBeTruthy();
  });
});
