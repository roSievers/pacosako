import { Component, OnInit } from '@angular/core';
import { ChessPiece, PacoBoard, MoveTarget } from '../types';
import { LoggerService } from '../logger.service';
import { BoardService } from '../board.service';
import { PacoMoveType } from '../interfaces';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
  subscription: Subscription;
  boardId: string;

  get highlightTransform(): string {
    if (this.highlight) {
      return `translate(${100 * this.highlight.position.x}px, ${100 *
        (7 - this.highlight.position.y)}px)`;
    }
  }

  constructor(
    private log: LoggerService,
    public boardService: BoardService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const id: string = paramMap.get('id');
      this.log.add(`Current board id is: ${id}`);
      this.onRouteChange(id);
    });
  }

  onRouteChange(boardId: string) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.boardId = boardId;

    this.subscription = this.boardService
      .getBoard(boardId)
      .subscribe(boardDto => {
        this.board = PacoBoard.fromData(boardDto);
      });
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

  onPieceDrop(target: MoveTarget) {
    this.log.add(
      `onPieceDrop(MoveTarget at ${JSON.stringify(target.position.dto)})`,
    );
    this.dragging = false; // TODO: Reconsider when glueing piece to mouse
    this.onMoveTargetClick(target);
  }

  onMoveTargetClick(target: MoveTarget) {
    this.log.add(
      `onMoveTargetClick(MoveTarget at ${JSON.stringify(target.position.dto)})`,
    );
    this.board.move(this.highlight.position, target.position);

    this.boardService.setBoard(this.boardId, this.board.dto);

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
