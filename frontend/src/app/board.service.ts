import { Injectable } from '@angular/core';
import { ChessPiece, PieceType, PlayerColor, PacoBoard } from './types';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(public loggingService: LoggerService) {}

  initialBoard() {
    return new PacoBoard();
  }
}
