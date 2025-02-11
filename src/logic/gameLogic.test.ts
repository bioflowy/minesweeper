import { describe, test, expect, beforeEach } from 'vitest';
import { GameLogic } from './gameLogic';

describe('GameLogic', () => {
  let game: GameLogic;

  beforeEach(() => {
    // テストごとに新しいゲームインスタンスを作成
    game = new GameLogic(5, 5, 3);
  });

  test('ボードが正しいサイズで初期化される', () => {
    const board = game.getBoard();
    expect(board.length).toBe(5); // 高さ
    expect(board[0].length).toBe(5); // 幅
  });

  test('指定された数の地雷が配置される', () => {
    const board = game.getBoard();
    let mineCount = 0;
    
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.value === '💣') mineCount++;
      });
    });

    expect(mineCount).toBe(3);
  });

  test('セルを開くと状態が revealed になる', () => {
    game.revealCell(0, 0);
    const board = game.getBoard();
    expect(board[0][0].state).toBe('revealed');
  });

  test('フラグのトグルが正しく動作する', () => {
    game.toggleFlag(0, 0);
    let board = game.getBoard();
    expect(board[0][0].state).toBe('flagged');

    game.toggleFlag(0, 0);
    board = game.getBoard();
    expect(board[0][0].state).toBe('hidden');
  });

  test('0のセルを開くと周囲のセルも開かれる', () => {
    // 0のセルを持つボードを作成するためのモック
    const mockGame = new GameLogic(3, 3, 1);
    const board = mockGame.getBoard();
    
    // 0のセルがある場所を見つけて開く
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (board[y][x].value === 0) {
          mockGame.revealCell(x, y);
          // 周囲のセルが開かれていることを確認
          const updatedBoard = mockGame.getBoard();
          let revealedCount = 0;
          updatedBoard.forEach(row => {
            row.forEach(cell => {
              if (cell.state === 'revealed') revealedCount++;
            });
          });
          expect(revealedCount).toBeGreaterThan(1);
          return;
        }
      }
    }
  });

  test('全てのセルを開く', () => {
    game.revealAll();
    const board = game.getBoard();
    let allRevealed = true;
    
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.state !== 'revealed') allRevealed = false;
      });
    });

    expect(allRevealed).toBe(true);
  });
}); 