import React from 'react';
import Board from './components/Board';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>マインスイーパー</h1>
      <Board width={10} height={10} mines={10} />
    </div>
  );
};

export default App;
