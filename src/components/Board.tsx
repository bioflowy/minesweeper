import React, { useState } from 'react';
import {  MineField, revealCell, toggleFlag, revealAll,type Board, createBoard, getCell } from '../logic/gameLogic';

interface BoardProps {
    mineField: MineField
}

const Board: React.FC<BoardProps> = ({mineField}:BoardProps) => {
  const [board, setBoard] = useState<Board>(createBoard(mineField));

  const handleCellClick = (row: number, col: number) => {
    if (!board) return;
    
    if (mineField.state[row][col] === '💣') {
      setBoard(revealAll(board));
    } else {
      setBoard(revealCell(board,row, col));
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (!board) return;
    setBoard(toggleFlag(board,row, col));
  };

  return (
    <div className="board">
      {Array.from({ length: mineField.height }, (_, i) => i).map((row) => (
        <div key={row} className="row">
          {Array.from({ length: mineField.width }, (_, i) => i).map((col) => {
            const cell = getCell(board,row, col);
            return <div
              key={`${col}-${row}`}
              className={`cell ${cell}`}
              onClick={() => handleCellClick(row, col)}
              onContextMenu={(e) => handleRightClick(e, row, col)}
            >
              {cell}
            </div>
            }
          )}
        </div>
      ))}
    </div>
  );
};

export default Board; 