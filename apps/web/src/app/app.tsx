import { mockData } from './mock-data';
import { DrawnixBoard } from '@drawnix/core';

export function App() {
  return <DrawnixBoard value={mockData}></DrawnixBoard>;
}

export default App;
