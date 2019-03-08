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
  king
}

/**
 * Current state of the Piece. This describes the situation in which the piece
 * is on its tile.
 */
export enum PieceState {
  alone,
  dancing,
  takingOver,
  leavingUnion
}

/**
 * The PlayerColor is either white or black.
 */
export enum PlayerColor {
  white,
  black
}

/**
 * A ChessPiece is a data object which tracks its inherent properties
 * and its position.
 */
export class ChessPiece {
  public state: PieceState = PieceState.alone;
  constructor(
    public type: PieceType,
    public color: PlayerColor,
    public position: { x: number; y: number }
  ) {}
}
