import { Injectable } from '@angular/core';
import { PacoBoard } from '../../../shared/types';
import { LoggerService } from './logger.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { BoardDto } from '../../../shared/types.dto';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  // We store a dto instead of a proper board to make sure that the object
  // isn't mutated accidentally.
  private boards: Map<string, Subject<BoardDto>> = new Map();
  private url = 'http://localhost:3001';
  private socket: SocketIOClient.Socket;

  constructor(public log: LoggerService) {
    this.connectSocket();
  }

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
      this.socket.emit('load-board', key);
    }
    return board;
  }

  setBoardFromUi(key: string, value: BoardDto) {
    this.setBoard(key, value);
    this.socket.emit('board', { id: key, value });
  }

  private setBoard(key: string, value: BoardDto) {
    let subject = this.boards.get(key);
    if (subject) {
      subject.next(value);
    }
  }

  setBoardFromServer(data: any) {
    this.log.add(`Received a board from the Server: ${JSON.stringify(data)}`);
    let key: string = data.id;
    let value: BoardDto = data.value;
    this.setBoard(key, value);
  }

  sendMessage(message: string) {
    this.socket.emit('add-message', message);
  }

  connectSocket() {
    this.log.add('Connecting to websocket ...');
    this.socket = io(this.url);

    this.socket.on('connection', (data: any) => this.log.add(data));

    this.socket.on('board', (data: any) => {
      this.setBoardFromServer(data);
    });
    this.log.add(`Connected to: ${this.socket}`);
  }
}
