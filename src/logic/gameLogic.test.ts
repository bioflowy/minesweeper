import { describe , test, expect, beforeEach } from 'vitest';
import { createBoard, createMineField, MineField, revealAll, revealCell, toggleFlag } from './gameLogic';

describe('MineField', () => {
  let mineField: MineField;

  beforeEach(() => {
    // テストごとに新しいゲームインスタンスを作成
    mineField = createMineField(3, 5, 5 );
  });

  test('地雷原が正しいサイズで初期化される', () => {
    expect(mineField.height).toBe(5); // 高さ
    expect(mineField.width).toBe(5); // 幅
  });

  test('指定された数の地雷が配置される', () => {
    
    let mineCount = 0;
    mineField.state.forEach(row => {
      row.forEach(cell => {
        if (cell === '💣') mineCount++;
      });
    });

    expect(mineCount).toBe(3);
  });
}
)
describe('Board', () => {
    let mineField: MineField;
    beforeEach(() => {
      // テストごとに新しいゲームインスタンスを作成
      mineField = {
        width: 3,
        height: 3,
        state: [
            ['💣',  1, 0 ],
            [  1  , 1, 0 ],
            [  0,   0, 0 ]
        ]
      };
    });

    test('セルを開くと状態が revealed になる', () => {
        const board = createBoard(mineField);
        const newBoard = revealCell(board,1, 1);
        expect(newBoard.state[1][1]).toBe('revealed');
  });

  test('フラグのトグルが正しく動作する', () => {
    let board = createBoard(mineField);
    board = toggleFlag(board,0, 0);
    expect(board.state[0][0]).toBe('flagged');

    board = toggleFlag(board,0, 0);
    expect(board.state[0][0]).toBe('hidden');
  });

  test('0のセルを開くと周囲のセルも開かれる', () => {
    // 0のセルを持つボードを作成するためのモック
    const board = createBoard(mineField);
    const newBoard = revealCell(board,0, 2);
    let revealedCount = 0;
    newBoard.state.forEach(row => {
      row.forEach(cell => {
        if (cell === 'revealed') revealedCount++;
      });
    });
    expect(revealedCount).toEqual(8);
    }
  );

  test('全てのセルを開く', () => {
    const board = createBoard(mineField);
    const newBoard = revealAll(board);
    let allRevealed = true;
    
    newBoard.state.forEach(row => {
      row.forEach(cell => {
        if (cell !== 'revealed') allRevealed = false;
      });
    });

    expect(allRevealed).toBe(true);
  });
}); 