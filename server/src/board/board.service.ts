import { Injectable } from '@nestjs/common';
import { BoardGateway } from './board.gateway';

@Injectable()
export class BoardService {
  private readonly store: Map<string, string> = new Map();
  private _board: string | null = null;

  constructor(private gateway: BoardGateway) {}

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
    this.gateway.wss.emit('boardSaved', newBoard);
    console.log('We emitted the newBoard');
    this._board = newBoard;
  }
}
