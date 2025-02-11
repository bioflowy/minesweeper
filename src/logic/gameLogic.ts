import { Cell } from '../types/types';

export class GameLogic {
  private board: Cell[][];
  private width: number;
  private height: number;

  constructor(width: number, height: number, mines: number) {
    this.width = width;
    this.height = height;
    this.board = this.createBoard(mines);
  }

  getBoard(): Cell[][] {
    return this.board;
  }

  private createBoard(mines: number): Cell[][] {
    // 空のボードを作成
    const newBoard: Cell[][] = Array(this.height).fill(null).map(() =>
      Array(this.width).fill(null).map(() => ({
        value: 0,
        state: 'hidden',
      }))
    );

    // 地雷を配置
    this.placeMines(newBoard, mines);
    // 数字を計算
    this.calculateNumbers(newBoard);

    return newBoard;
  }

  private placeMines(board: Cell[][], mines: number): void {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);

      if (board[y][x].value !== '💣') {
        board[y][x].value = '💣';
        minesPlaced++;
      }
    }
  }

  private calculateNumbers(board: Cell[][]): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (board[y][x].value === '💣') continue;
        board[y][x].value = this.countAdjacentMines(board, x, y);
      }
    }
  }

  private countAdjacentMines(board: Cell[][], x: number, y: number): number {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = y + dy;
        const nx = x + dx;
        if (
          ny >= 0 && ny < this.height &&
          nx >= 0 && nx < this.width &&
          board[ny][nx].value === '💣'
        ) {
          count++;
        }
      }
    }
    return count;
  }

  revealCell(x: number, y: number): void {
    if (
      x < 0 || x >= this.width ||
      y < 0 || y >= this.height ||
      this.board[y][x].state === 'revealed'
    ) {
      return;
    }

    this.board[y][x].state = 'revealed';

    if (this.board[y][x].value === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          this.revealCell(x + dx, y + dy);
        }
      }
    }
  }

  toggleFlag(x: number, y: number): void {
    if (this.board[y][x].state === 'revealed') return;
    this.board[y][x].state = this.board[y][x].state === 'flagged' ? 'hidden' : 'flagged';
  }

  revealAll(): void {
    this.board.forEach(row => {
      row.forEach(cell => {
        cell.state = 'revealed';
      });
    });
  }

  isMine(x: number, y: number): boolean {
    return this.board[y][x].value === '💣';
  }
} 