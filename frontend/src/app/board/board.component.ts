import { Component, OnInit } from '@angular/core';
import { ChessPiece } from '../types';
import { LoggerService } from '../logger.service';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  pieces: ChessPiece[];

  highlight: { x: number; y: number } | null = null;

  constructor(
    public loggingService: LoggerService,
    public boardService: BoardService,
  ) {}

  ngOnInit() {
    this.pieces = this.boardService.piecesInInitialPosition();
  }

  onPieceClick(piece: ChessPiece) {
    this.loggingService.add(`Piece clicked: ${JSON.stringify(piece)}`);
  }
}
