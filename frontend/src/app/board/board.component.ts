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

  get highlightTransform(): string {
    if (this.highlight) {
      return `translate(${100 * this.highlight.x}px, ${100 *
        (7 - this.highlight.y)}px)`;
    }
  }

  constructor(
    public loggingService: LoggerService,
    public boardService: BoardService,
  ) {}

  ngOnInit() {
    this.pieces = this.boardService.piecesInInitialPosition();
  }

  onPieceClick(piece: ChessPiece) {
    this.highlight = piece.position;
  }

  onDeselect() {
    this.highlight = null;
  }
}
