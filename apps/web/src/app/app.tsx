// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import NxWelcome from './nx-welcome';

import { DrawnixBoard } from '@drawnix/core';

export function App() {
  return (
    <div>
      <DrawnixBoard></DrawnixBoard>
      <NxWelcome title="web" />
    </div>
  );
}

export default App;
