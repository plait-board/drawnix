import styles from './react-board.module.scss';

import { ReactText } from '@plait/react-text';

export function ReactBoard() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ReactBoard!</h1>
      <ReactText></ReactText>
    </div>
  );
}

export default ReactBoard;
