import React, { useState, useEffect } from 'react';
import { Cell } from '../types/types';
import { GameLogic } from '../logic/gameLogic';

interface BoardProps {
  width: number;
  height: number;
  mines: number;
}

const Board: React.FC<BoardProps> = ({ width, height, mines }) => {
  const [game, setGame] = useState<GameLogic | null>(null);
  const [board, setBoard] = useState<Cell[][]>([]);

  useEffect(() => {
    const newGame = new GameLogic(width, height, mines);
    setGame(newGame);
    setBoard(newGame.getBoard());
  }, [width, height, mines]);

  const handleCellClick = (x: number, y: number) => {
    if (!game) return;
    
    if (game.isMine(x, y)) {
      game.revealAll();
    } else {
      game.revealCell(x, y);
    }
    setBoard([...game.getBoard()]);
  };

  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (!game) return;

    game.toggleFlag(x, y);
    setBoard([...game.getBoard()]);
  };

  return (
    <div className="board">
      {board.map((row, y) => (
        <div key={y} className="row">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`cell ${cell.state}`}
              onClick={() => handleCellClick(x, y)}
              onContextMenu={(e) => handleRightClick(e, x, y)}
            >
              {cell.state === 'revealed' ? cell.value : cell.state === 'flagged' ? '🚩' : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board; 