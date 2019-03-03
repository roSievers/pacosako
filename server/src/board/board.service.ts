import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardService {
  private readonly store: Map<string, string> = new Map();
  private _board: string | null = null;

  set(key: string, value: string) {
    this.store.set(key, value);
  }

  get(key: string): string | null {
    const value = this.store.get(key);
    if (value === undefined) {
      return null;
    }
    return value;
  }

  get board(): string {
    if (this._board == null) throw new Error('No board stored yet.');
    return this._board;
  }

  set board(newBoard: string) {
    this._board = newBoard;
  }
}
