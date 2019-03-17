// This file defines data transfer objects for types defined in types.ts

import { IPosition, PieceType, PlayerColor } from './interfaces';
import { Move } from './types';

export class PositionDto implements IPosition {
  constructor(public x: number, public y: number) {}
}

export class PieceDto {
  constructor(
    public type: PieceType,
    public color: PlayerColor,
    public position: IPosition,
  ) {}
}

export class BoardDto {
  constructor(
    public pieces: PieceDto[],
    public currentPlayer: PlayerColor,
    public chaining: number | null,
    public history: Move[],
  ) {}
}
