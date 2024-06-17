import styles from './drawnix.module.scss';

import { ReactBoard } from '@plait/react-board';

export function DrawnixBoard() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Drawnix Board!</h1>
      <ReactBoard></ReactBoard>
    </div>
  );
}

export default DrawnixBoard;
