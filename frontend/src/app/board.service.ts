import { Injectable } from '@angular/core';
import { PacoBoard } from './types';
import { LoggerService } from './logger.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { BoardDto } from './types.dto';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  // We store a dto instead of a proper board to make sure that the object
  // isn't mutated accidentally.
  private boards: Map<string, Subject<BoardDto>> = new Map();

  constructor(public loggingService: LoggerService) {}

  private initialBoard(): BoardDto {
    return new PacoBoard().dto;
  }

  getBoard(key: string): Observable<BoardDto> {
    let board = this.boards.get(key);
    if (!board) {
      // A ReplaySubject will replay the last event emitted when you subscribe.
      board = new ReplaySubject<BoardDto>();
      board.next(this.initialBoard());
      this.boards.set(key, board);
    }
    return board;
  }

  setBoard(key: string, value: BoardDto) {
    let subject = this.boards.get(key);
    if (subject) {
      subject.next(value);
    }
  }
}
