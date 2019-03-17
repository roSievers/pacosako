import { Component, OnInit, Input } from '@angular/core';
import { ChessPiece, PacoBoard, Move } from '../../../../shared/types';
import { LoggerService } from '../logger.service';
import { PacoMoveType } from '../../../../shared/interfaces';
import { IBoardProvider } from '../interfaces';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  board: PacoBoard | null = null;

  highlight: ChessPiece | null = null;
  legalMoves: Move[] | null = new Array();
  dragging: boolean = false;

  @Input() handler?: IBoardProvider;

  get highlightTransform(): string {
    if (this.highlight) {
      return `translate(${100 * this.highlight.position.x}px, ${100 *
        (7 - this.highlight.position.y)}px)`;
    } else {
      return '';
    }
  }

  constructor(private log: LoggerService) {}

  ngOnInit() {
    if (this.handler !== undefined) {
      this.handler.board.subscribe(newBoard => (this.board = newBoard));
    } else {
      this.log.add('Error: Using a BoardComponent without [handler].');
    }
  }

  onPieceClick(piece: ChessPiece) {
    this.log.add(
      `onPieceClick(ChessPiece at ${JSON.stringify(piece.position.dto)})`,
    );
    if (this.highlight && piece.position.equals(this.highlight.position)) {
      this.onDeselect();
    } else {
      this.onHighlight(piece);
    }
  }

  onPieceDrag(piece: ChessPiece) {
    this.log.add(
      `onPieceDrag(ChessPiece at ${JSON.stringify(piece.position.dto)})`,
    );

    this.onHighlight(piece);
    this.dragging = true;
  }

  onPieceDrop(move: Move) {
    this.log.add(
      `onPieceDrop(MoveTarget at ${JSON.stringify(move.target.dto)})`,
    );
    this.dragging = false; // TODO: Reconsider when glueing piece to mouse
    this.onMoveTargetClick(move);
  }

  onMoveTargetClick(move: Move) {
    this.log.add(
      `onMoveTargetClick(MoveTarget at ${JSON.stringify(move.target.dto)})`,
    );
    this.board.move(move);

    this.handler.storeBoard(this.board);

    if (move.type === PacoMoveType.chain) {
      if (this.board.chainingPiece === null) {
        throw new Error('Chaining piece is "null" after chaining.');
      }
      this.onHighlight(this.board.chainingPiece);
    } else {
      this.onDeselect();
    }
  }

  onDeselect() {
    this.log.add(`onDeselect()`);
    this.highlight = null;
    this.legalMoves = null;
    this.dragging = false;
  }

  onDragEnd() {
    this.log.add(`onDragEnd()`);
    this.onDeselect();
  }

  onHighlight(piece: ChessPiece) {
    this.log.add(
      `onHighlight(Chess Piece at ${JSON.stringify(piece.position.dto)})`,
    );
    let legalMoves = this.board.select(piece.position);
    if (legalMoves != null) {
      this.highlight = piece;
      this.legalMoves = legalMoves;
    } else {
      this.onDeselect();
    }
  }
}
