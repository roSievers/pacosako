import { Component, OnInit, Input } from '@angular/core';
import { ChessPiece, PieceType, PlayerColor } from '../types';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css'],
})
export class PieceComponent implements OnInit {
  @Input() piece: ChessPiece;
  @Input() clickHandler?: (piece: ChessPiece) => void;

  get transform(): string {
    return `translate(${100 * this.piece.position.x}px, ${100 *
      (7 - this.piece.position.y)}px)`;
  }

  get cssClasses(): string {
    return `piece ${this.pieceClass}-${this.colorLetter}`;
  }

  constructor() {}

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
    if (this.clickHandler !== null) {
      this.clickHandler(this.piece);
    }
  }
}
