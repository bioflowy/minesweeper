import React from 'react';
import Board from './components/Board';
import './App.css';
import { createMineField } from './logic/gameLogic';

const App: React.FC = () => {
  const mineField = createMineField(10, 10, 10);
  return (
    <div className="App">
      <h1>マインスイーパー</h1>
      <Board mineField={mineField} />
    </div>
  );
};

export default App;
