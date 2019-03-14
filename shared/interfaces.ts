// This module holds only enums and interfaces without any implementation logic.

/**
 * A data only version of the Position class.
 */
export interface IPosition {
  readonly x: number;
  readonly y: number;
}

/**
 * The PieceType enum lists all possible kinds of chess pieces.
 * Pawn, Rock, Knight, Bishop, Queen, King
 */
export enum PieceType {
  pawn,
  rock,
  knight,
  bishop,
  queen,
  king,
}

/**
 * Current state of the Piece. This describes the situation in which the piece
 * is on its tile.
 */
export enum PieceState {
  alone,
  dancing,
  takingOver,
  leavingUnion,
}

/**
 * The PlayerColor is either white or black.
 */
export enum PlayerColor {
  white,
  black,
}

/**
 * Type of a move that is offered to the player.
 */
export enum PacoMoveType {
  plain,
  union,
  chain,
}
