import { Component, OnInit } from '@angular/core';
import {
  ChessPiece,
  PacoBoard,
  Position,
  MoveTarget,
  PacoMoveType,
} from '../types';
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
  dragging: boolean = false;

  get highlightTransform(): string {
    if (this.highlight) {
      return `translate(${100 * this.highlight.position.x}px, ${100 *
        (7 - this.highlight.position.y)}px)`;
    }
  }

  constructor(public log: LoggerService, public boardService: BoardService) {}

  ngOnInit() {
    this.board = this.boardService.initialBoard();
  }

  onPieceClick(piece: ChessPiece) {
    this.log.add(
      `onPieceClick(ChessPiece at ${JSON.stringify(piece.position.data)})`,
    );
    if (this.highlight && piece.position.equals(this.highlight.position)) {
      this.onDeselect();
    } else {
      this.onHighlight(piece);
    }
  }

  onPieceDrag(piece: ChessPiece) {
    this.log.add(
      `onPieceDrag(ChessPiece at ${JSON.stringify(piece.position.data)})`,
    );

    this.onHighlight(piece);
    this.dragging = true;
  }

  onPieceDrop(target: MoveTarget) {
    this.log.add(
      `onPieceDrop(MoveTarget at ${JSON.stringify(target.position.data)})`,
    );
    this.dragging = false; // TODO: Reconsider when glueing piece to mouse
    this.onMoveTargetClick(target);
  }

  onMoveTargetClick(target: MoveTarget) {
    this.log.add(
      `onMoveTargetClick(MoveTarget at ${JSON.stringify(
        target.position.data,
      )})`,
    );
    this.board.move(this.highlight.position, target.position);

    if (target.type === PacoMoveType.chain) {
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
      `onHighlight(Chess Piece at ${JSON.stringify(piece.position.data)})`,
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
