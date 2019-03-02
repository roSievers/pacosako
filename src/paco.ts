// Implements the core game logic of Paco Ŝako.
// As "PacoSxako" does not look nice when spelled with "iks-sistemo",
// this module is called paco.ts instead.
import {
  Position,
  PlayerColor,
  PieceType,
  Observable,
  PieceState
} from "./basicTypes";

/**
 * A ChessPiece is a data object which tracks its inherent properties
 * and its position.
 */
export class ChessPiece {
  public readonly stateObs: Observable<PieceState> = new Observable(
    PieceState.alone
  );
  private _type: PieceType;
  public readonly positionObs: Observable<Position>;
  constructor(
    type: PieceType,
    public readonly color: PlayerColor,
    position: Position
  ) {
    this.positionObs = new Observable(position);
    this._type = type;
  }
  /**
   * Returns the type of a piece. This must be a property in order to
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
  get state(): PieceState {
    return this.stateObs.value;
  }
  set state(newState: PieceState) {
    this.stateObs.value = newState;
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
        "A Pair has exactly two members. Received: " + pieces.length
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
   * The piece currently leaving a union without a defined target.
   */
  private chaining: ChessPiece | null = null;
  /**
   * Color of the current player
   */
  public readonly currentPlayer: Observable<PlayerColor> = new Observable(
    PlayerColor.white
  );
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
    // TODO: This function is lacking a proper implementation.
    const pieces = this.at(p);
    if (this.chainingPiece != null) {
      // When a chain is active, no new selection may be made.
      return null;
    } else if (
      pieces instanceof ChessPiece &&
      pieces.color == this.currentPlayer.value
    ) {
      return new Array(p);
    } else if (pieces instanceof ChessPair) {
      // Pairs may always move.
      return new Array(p);
    } else {
      // The Position is empty.
      return null;
    }
  }
  /**
   * Moves the piece or pieces from the start to the target position.
   * @param start `this.select(start)` must not be `null`.
   * @param target must be an entry of `this.select(start)`
   */
  move(start: Position, target: Position) {
    let legalMoves = this.select(start);
    if (legalMoves == null || legalMoves.every(p => !p.equals(target))) {
      // throw new Error("This move is not allowed.");
    }
    // Analyze situation
    if (this.chaining != null) {
      // A chain is active, the chaining piece must move.
      if (this.chaining.position.equals(start)) {
        this.singleMove(this.chaining, target);
        this._at(start).forEach(piece => (piece.state = PieceState.dancing));
      } else {
        throw new Error("A chain is active, move the chaining piece.");
      }
    } else {
      let movingPieces = this.at(start);
      if (movingPieces instanceof ChessPiece) {
        // Moving a single piece works just as moving the chain piece
        this.singleMove(movingPieces, target);
      } else if (movingPieces instanceof ChessPair) {
        this.pairMove(movingPieces, target);
      } else {
        throw new Error("There is no piece at the start position!");
      }
    }
  }
  /**
   * This internal function moves a pair. This is only possible, when the target
   * position is empty.
   * @param movingPair The ChessPair being moved.
   * @param target The target Position.
   */
  private pairMove(movingPair: ChessPair, target: Position) {
    if (this.at(target) == null) {
      movingPair.position = target;
      this.swapPlayerColor();
    } else {
      throw new Error("Pairs may only be moved onto empty squares.");
    }
  }
  /**
   * This internal function moves a single piece. It does not matter whether
   * the piece is from a chain or not.
   * @param movingPiece The ChessPiece being moved.
   * @param target The target Position.
   */
  private singleMove(movingPiece: ChessPiece, target: Position) {
    let targetPieces = this.at(target);
    if (targetPieces == null) {
      // Empty target tile, the chain is over.
      movingPiece.position = target;
      movingPiece.state = PieceState.alone;
      this.chaining = null;
      this.swapPlayerColor();
    } else if (targetPieces instanceof ChessPiece) {
      // Single Target, verify color and move there. The chain is over.
      if (movingPiece.color == targetPieces.color) {
        throw new Error("Can't form a union from pieces with the same color.");
      }
      movingPiece.position = target;
      movingPiece.state = PieceState.dancing;
      targetPieces.state = PieceState.dancing;
      this.chaining = null;
      this.swapPlayerColor();
    } else {
      // Pair target, a chain continues or begins
      movingPiece.position = target;
      movingPiece.state = PieceState.takingOver;
      this.chaining = targetPieces.ofColor(movingPiece.color);
      this.chaining.state = PieceState.leavingUnion;
    }
  }
  private swapPlayerColor() {
    if (this.currentPlayer.value == PlayerColor.white) {
      this.currentPlayer.value = PlayerColor.black;
    } else {
      this.currentPlayer.value = PlayerColor.white;
    }
  }
  /**
   * Returns all pieces at the given position in an unstructured list.
   * Note that the `chaining` piece is excluded as it has a virtual position.
   */
  private _at(p: Position): Array<ChessPiece> {
    return this.pieces.filter(
      chessPiece => chessPiece.position.equals(p) && chessPiece != this.chaining
    );
  }
  /**
   * Returns all pieces at the given position in a structured form.
   * Note that the `chaining` piece is excluded as it has a virtual position.
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
  get chainingPiece(): ChessPiece | null {
    return this.chaining;
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
