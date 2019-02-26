// Implements the core game logic of Paco Ŝako.
// As "PacoSxako" does not look nice when spelled with "iks-sistemo",
// this module is called paco.ts instead.
import { Position, PlayerColor, PieceType } from "./basicTypes";

// export class Move {
//   constructor(public start: Position, public end: Position) {}
// }

export class ChessPiece {
  constructor(
    public readonly type: PieceType,
    public readonly color: PlayerColor,
    public position: Position
  ) {}
}

export class PacoBoard {
  public readonly pieces: Array<ChessPiece> = initEmptyBoard();
  /**
   * The index of the piece held by the player. Only one piece can be held
   * at a time. Moving a dancing piece carries its piece with it.
   */
  private readonly hand: number | null = null;
  /** Constructs a new board in initial position. */
  constructor() {}
}

const basePieceOrder: Array<PieceType> = [
  PieceType.rock,
  PieceType.knight,
  PieceType.bishop,
  PieceType.queen,
  PieceType.king,
  PieceType.bishop,
  PieceType.knight,
  PieceType.rock
];

function initEmptyBoard(): ChessPiece[] {
  let pieces: Array<ChessPiece> = new Array(32);
  // All pawns
  for (let x = 0; x < 8; x++) {
    const pW = new Position(x, 1);
    const w = new Position(x, 0);
    const pB = new Position(x, 6);
    const b = new Position(x, 7);
    pieces[x] = new ChessPiece(PieceType.pawn, PlayerColor.white, pW);
    pieces[8 + x] = new ChessPiece(basePieceOrder[x], PlayerColor.white, w);
    pieces[16 + x] = new ChessPiece(PieceType.pawn, PlayerColor.black, pB);
    pieces[24 + x] = new ChessPiece(basePieceOrder[x], PlayerColor.black, b);
  }
  return pieces;
}
