import { Component, OnInit } from '@angular/core';
import { ChessPiece, PacoBoard, Position, MoveTarget } from '../types';
import { LoggerService } from '../logger.service';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  board: PacoBoard;

  highlight: ChessPiece | null = null;
  legalMoves: MoveTarget[] = new Array();

  get highlightTransform(): string {
    if (this.highlight) {
      return `translate(${100 * this.highlight.position.x}px, ${100 *
        (7 - this.highlight.position.y)}px)`;
    }
  }

  constructor(
    public loggingService: LoggerService,
    public boardService: BoardService,
  ) {}

  ngOnInit() {
    this.board = this.boardService.initialBoard();
  }

  onPieceClick(piece: ChessPiece) {
    if (this.highlight && piece.position.equals(this.highlight.position)) {
      this.onDeselect();
    } else {
      this.onHighlight(piece);
    }
  }

  onMoveTargetClick(position: Position) {
    this.loggingService.add(`Move target: ${JSON.stringify(position)}`);
    this.board.move(this.highlight.position, position);
    this.onDeselect();
  }

  onDeselect() {
    this.highlight = null;
    this.legalMoves = null;
  }

  onHighlight(piece: ChessPiece) {
    let legalMoves = this.board.select(piece.position);
    if (legalMoves != null) {
      this.highlight = piece;
      this.legalMoves = legalMoves;
    } else {
      this.onDeselect();
    }
  }
}
