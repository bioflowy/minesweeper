export type CellValue = number | '💣';
export type CellState = 'hidden' | 'revealed' | 'flagged';

export interface Cell {
  value: CellValue;
  state: CellState;
} 