import { render } from '@testing-library/react';

import ReactText from './react-text';

describe('ReactText', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactText />);
    expect(baseElement).toBeTruthy();
  });
});
