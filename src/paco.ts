// Implements the core game logic of Paco Ŝako.
// As "PacoSxako" does not look nice when spelled with "iks-sistemo",
// this module is called paco.ts instead.
import { Position, PlayerColor, PieceType, Observable } from "./basicTypes";

/**
 * A ChessPiece is a data object which tracks its inherent properties
 * and its position.
 */
export class ChessPiece {
  private _type: PieceType;
  public positionObs: Observable<Position>;
  constructor(
    type: PieceType,
    public readonly color: PlayerColor,
    position: Position
  ) {
    this.positionObs = new Observable(position);
    this._type = type;
  }
  /**
   * Returns the type of a piece. This must be a propperty in order to
   * implement promotion while keeping this.type readonly.
   */
  get type() {
    return this._type;
  }
  get position(): Position {
    return this.positionObs.value;
  }
  set position(newPosition: Position) {
    this.positionObs.value = newPosition;
  }
  /**
   * This function promotes a pawn to a queen if possible.
   * @throws If the piece is not a pawn or at the wrong position.
   */
  promote() {
    if (this._type != PieceType.pawn) {
      throw new Error("Only pawns can be promoted.");
    } else if (this.color == PlayerColor.black && this.position.y != 0) {
      throw new Error("Black pawns may only be promoted in row 0.");
    } else if (this.color == PlayerColor.white && this.position.y != 7) {
      throw new Error("White pawns may only be promoted in row 7");
    } else {
      this._type = PieceType.queen;
    }
  }
}

export class ChessPair {
  public readonly white: ChessPiece;
  public readonly black: ChessPiece;
  /**
   * Constructs and validates a ChessPair from a list of ChessPiece objects.
   * @param pieces An array containing a white and a black chess piece on
   *               the same position in any order.
   * @throws If the array does not constitute a valid pair.
   */
  constructor(pieces: Array<ChessPiece>) {
    if (pieces.length != 2) {
      throw new Error(
        "A Pair has exactly two members. Recieved: " + pieces.length
      );
    }
    let whitePiece = pieces.find(piece => piece.color == PlayerColor.white);
    let blackPiece = pieces.find(piece => piece.color == PlayerColor.black);
    if (whitePiece == undefined) {
      throw new Error("You did not supply a white piece to the pair.");
    } else if (blackPiece == undefined) {
      throw new Error("You did not supply a black piece to the pair.");
    } else {
      this.white = whitePiece;
      this.black = blackPiece;
      this.assertIntegrity();
    }
  }
  assertIntegrity() {
    if (!this.white.position.equals(this.black.position)) {
      throw new Error("Pieces of a pair must share a Position.");
    }
  }
  get position(): Position {
    this.assertIntegrity();
    return this.white.position;
  }
  set position(p: Position) {
    this.white.position = p;
    this.black.position = p;
  }
  ofColor(c: PlayerColor) {
    if (c == PlayerColor.white) {
      return this.white;
    } else {
      return this.black;
    }
  }
}

export class PacoBoard {
  /**
   * The current state of all pieces. The objects modelling the pieces
   * will not change during runtime and can be used as keys in a map.
   */
  public readonly pieces: Array<ChessPiece> = initEmptyBoard();
  /**
   * The index of the piece held by the player. Only one piece can be held
   * at a time. Moving a dancing piece carries its piece with it.
   */
  private readonly hand: number | null = null;
  /** Constructs a new board in initial position. */
  constructor() {}
  /**
   * Given a selection position p, PacoBoard.select(p) returns a list of all
   * legal moves or null, if a selection can not be made at the given position.
   *
   * Note that a selection may itself be legal, but may not offer any legal
   * moves. For example, a blocked white pawn may be selected by white but
   * can not be moved. On the other hand, a single black bishop may not be
   * selected by white at all. An empty square can't be selected either.
   *
   * Selection data is not stored in the PacoBoard itself.
   *
   * @param p The position the user wants to select.
   */
  select(p: Position): Array<Position> | null {
    // TODO: This function is lacking a propper implementation.
    if (this.at(p) == null) {
      return null;
    } else {
      return new Array(0);
    }
  }
  /** Returns all pieces at the given position in an unstructured list. */
  private _at(p: Position): Array<ChessPiece> {
    return this.pieces.filter(chessPiece => chessPiece.position.equals(p));
  }
  /**
   * Returns all pieces at the given position in a structured form.
   * @throws May throw if the internal Board state is inconsistent.
   */
  public at(p: Position): null | ChessPiece | ChessPair {
    let pieces = this._at(p);
    switch (pieces.length) {
      case 0:
        return null;
      case 1:
        return pieces[0];
      case 2:
        return new ChessPair(pieces);
      case 3:
        throw new Error(
          "Selecting a tile with three pieces is not implemented."
        );
      default:
        throw new Error(
          "There are more than 3 pieces on the same tile. This is forbidden."
        );
    }
  }
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
