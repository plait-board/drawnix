// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import { mockData } from './mock-data';

import NxWelcome from './nx-welcome';

import { DrawnixBoard } from '@drawnix/core';

export function App() {
  return (
    <div>
      <DrawnixBoard value={mockData}></DrawnixBoard>
    </div>
  );
}

export default App;
