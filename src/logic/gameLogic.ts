import {MineState, CellState, Cell } from '../types/types';
export type MineField ={
    width: number
    height: number
    state: MineState[][]
}
export function createMineField(mines: number, width: number, height: number): MineField {
    // 空のボードを作成
    const newBoard: MineState[][] = Array(height).fill(null).map(() =>
      Array(width).fill(0)
    );

    // 地雷を配置
    placeMines(newBoard, mines);
    // 数字を計算
    calculateNumbers(newBoard);

    return {
        width,
        height,
        state:newBoard
    }
}
function placeMines(board: MineState[][], mines: number): void {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * board[0].length);
      const y = Math.floor(Math.random() * board.length);

      if (board[y][x] !== '💣') {
        board[y][x] = '💣';
        minesPlaced++;
      }
    }
}

  function calculateNumbers(board: MineState[][]): void {
    const width = board[0].length;
    const height = board.length;
        for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (board[y][x] === '💣') continue;
        board[y][x] = countAdjacentMines(board, x, y);
      }
    }
  }

function countAdjacentMines(board: MineState[][], x: number, y: number): number {
const width = board[0].length;
const height = board.length;
let count = 0;
for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
    const ny = y + dy;
    const nx = x + dx;
    if (
        ny >= 0 && ny < height &&
        nx >= 0 && nx < width &&
        board[ny][nx] === '💣'
    ) {
        count++;
    }
    }
}
return count;
}
export type Board = {
    width: number
    height: number
    mineField: MineField
    state: CellState[][]
}
export function createBoard(mineField: MineField): Board {
    return {
        width: mineField.width,
        height: mineField.height,
        mineField,
        state: createCellState(mineField.width, mineField.height, 'hidden')
    };
}
export function revealCell(board:Board,row: number,col: number): Board {
    if (
        col < 0 || col >= board.width ||
        row < 0 || row >= board.height ||
        board.state[row][col] === 'revealed'
    ) {
      return board;
    }

    board.state[row][col] = 'revealed';

    if (board.mineField.state[row][col] === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          board = revealCell(board,row + dy, col + dx);
        }
      }
    }
    return {...board};
  }

  export function toggleFlag(board:Board,row: number, col: number): Board {
    if (board.state[row][col] === 'revealed') return board;
    board.state[row][col] = board.state[row][col] === 'flagged' ? 'hidden' : 'flagged';
    return {...board};
  }
function createCellState(width: number,height: number,state:CellState): CellState[][] {
    return Array(height).fill(null).map(() =>
        Array(width).fill(state)
      );
}
export function revealAll(board:Board): Board {
    return {
        ...board,
        state:createCellState(board.width,board.height,'revealed')
    }
}
export function getCell(board:Board,row: number,col: number): Cell {
    if (board.state[row][col] === 'revealed') {
        return board.mineField.state[row][col];
    }else if (board.state[row][col] === 'flagged') {
        return '🚩';
    }else{
        return '';
    }
}
