import { Component, OnInit, Input } from '@angular/core';
import {
  ChessPiece,
  PieceType,
  PlayerColor,
  PacoBoard,
  IPosition,
  PieceState,
} from '../types';
import { LoggerService } from '../logger.service';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css'],
})
export class PieceComponent implements OnInit {
  @Input() piece: ChessPiece;
  @Input() board: PacoBoard;
  @Input() handler?: BoardComponent;

  get transform(): string {
    let fieldOffset = this.fieldOffset;
    let stateOffset = this.stateOffset;
    let offset = {
      x: fieldOffset.x + stateOffset.x,
      y: fieldOffset.y + stateOffset.y,
    };

    return `translate(${offset.x}px, ${offset.y}px)`;
  }

  get cssClasses(): string {
    return `piece ${this.pieceClass}-${this.colorLetter}`;
  }

  get fieldOffset(): IPosition {
    return {
      x: 100 * this.piece.position.x,
      y: 100 * (7 - this.piece.position.y),
    };
  }

  get stateOffset(): IPosition {
    if (this.piece.state == PieceState.alone) {
      return { x: 0, y: 0 };
    }
    if (this.piece.state == PieceState.dancing) {
      if (this.piece.color == PlayerColor.white) {
        return { x: 20, y: 0 };
      } else {
        return { x: -20, y: 0 };
      }
    }
    if (this.piece.state == PieceState.takingOver) {
      if (this.piece.color == PlayerColor.white) {
        return { x: 10, y: 10 };
      } else {
        return { x: -10, y: 10 };
      }
    }
    if (this.piece.state == PieceState.leavingUnion) {
      if (this.piece.color == PlayerColor.white) {
        return { x: 30, y: -10 };
      } else {
        return { x: -30, y: -10 };
      }
    }
    return { x: 0, y: 0 };
  }

  constructor(private log: LoggerService) {}

  private get pieceClass(): string {
    switch (this.piece.type) {
      case PieceType.pawn:
        return 'pawn';
      case PieceType.rock:
        return 'rock';
      case PieceType.knight:
        return 'knight';
      case PieceType.bishop:
        return 'bishop';
      case PieceType.queen:
        return 'queen';
      case PieceType.king:
        return 'king';
      default:
        return this.piece.type;
    }
  }

  private get colorLetter(): 'w' | 'b' {
    if (this.piece.color === PlayerColor.white) {
      return 'w';
    } else {
      return 'b';
    }
  }

  ngOnInit() {}

  onClick(clickEvent: any) {
    clickEvent.stopPropagation();
    if (this.handler !== null) {
      this.handler.onPieceClick(this.piece);
    }
  }

  drag(event) {
    event.dataTransfer.setData('text', this.piece);
    if (this.handler !== null) {
      this.handler.onPieceDrag(this.piece);
    }
  }

  dragEnd(event) {
    this.handler.onDragEnd();
  }
}
