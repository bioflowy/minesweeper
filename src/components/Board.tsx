import React, { useState, useEffect } from 'react';
import { Cell, CellState } from '../types/types';

interface BoardProps {
  width: number;
  height: number;
  mines: number;
}

const Board: React.FC<BoardProps> = ({ width, height, mines }) => {
  const [board, setBoard] = useState<Cell[][]>([]);

  const initializeBoard = () => {
    // 空のボードを作成
    const newBoard: Cell[][] = Array(height).fill(null).map(() =>
      Array(width).fill(null).map(() => ({
        value: 0,
        state: 'hidden' as CellState,
      }))
    );

    // 地雷を配置
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (newBoard[y][x].value !== '💣') {
        newBoard[y][x].value = '💣';
        minesPlaced++;
      }
    }

    // 数字を計算
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (newBoard[y][x].value === '💣') continue;

        let count = 0;
        // 周囲8マスをチェック
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (
              ny >= 0 && ny < height &&
              nx >= 0 && nx < width &&
              newBoard[ny][nx].value === '💣'
            ) {
              count++;
            }
          }
        }
        newBoard[y][x].value = count;
      }
    }

    setBoard(newBoard);
  };

  const handleCellClick = (x: number, y: number) => {
    if (board[y][x].state === 'revealed') return;

    const newBoard = [...board];
    if (board[y][x].value === '💣') {
      // ゲームオーバー
      revealAll(newBoard);
    } else {
      revealCell(newBoard, x, y);
    }
    setBoard(newBoard);
  };

  const revealCell = (board: Cell[][], x: number, y: number) => {
    if (
      x < 0 || x >= width ||
      y < 0 || y >= height ||
      board[y][x].state === 'revealed'
    ) {
      return;
    }

    board[y][x].state = 'revealed';

    if (board[y][x].value === 0) {
      // 周囲のセルも開く
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          revealCell(board, x + dx, y + dy);
        }
      }
    }
  };

  const revealAll = (board: Cell[][]) => {
    board.forEach(row => {
      row.forEach(cell => {
        cell.state = 'revealed';
      });
    });
  };

  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (board[y][x].state === 'revealed') return;

    const newBoard = [...board];
    newBoard[y][x].state = board[y][x].state === 'flagged' ? 'hidden' : 'flagged';
    setBoard(newBoard);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

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