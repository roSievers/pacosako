// Implements the core game logic of Paco Ŝako.
// As "PacoSxako" does not look nice when spelled with "iks-sistemo",
// this module is called paco.ts instead.
import {
  Position,
  PlayerColor,
  PieceType,
  Observable,
  PieceState,
  oppositeColor
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

  /** Serialize a ChessPiece object into a data only JSON object. */
  get json(): Object {
    return {
      position: this.position.json,
      type: this.type,
      color: this.color
    };
  }

  /** Deserialize a JSON object into a ChessPiece */
  public static fromJson(json: any): ChessPiece {
    if (
      !json ||
      json.type === undefined ||
      json.color === undefined ||
      !json.position
    ) {
      throw new Error(`Error parsing ${JSON.stringify(json)} as a ChessPiece.`);
    }
    return new ChessPiece(
      json.type,
      json.color,
      Position.fromJson(json.position)
    );
  }

  public copyInformation(source: ChessPiece) {
    this._type = source._type;
    this.positionObs.value = source.position;
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

/**
 * A Paco Ŝako board holding all the pieces and enforcing movement rules.
 */
export class PacoBoard {
  /**
   * The piece currently leaving a union without a defined target.
   */
  private chaining: ChessPiece | null;
  /**
   * Constructs a new board. When no parameters are supplied, an empty
   * board is constructed.
   * @param pieces
   * @param currentPlayer
   * @param chainingIndex Index of the chaining Piece or null.
   */
  constructor(
    /**
     * The current state of all pieces. The objects modelling the pieces
     * will not change during runtime and can be used as keys in a map.
     */
    public readonly pieces: Array<ChessPiece> = initEmptyBoard(),
    /**
     * Color of the current player
     */
    public readonly currentPlayer: Observable<PlayerColor> = new Observable(
      PlayerColor.white
    ),
    chainingIndex: number | null = null
  ) {
    this.chaining = chainingIndex != null ? pieces[chainingIndex] : null;
  }

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
      // The selection must be at the current virtual position of
      // the chaining piece.
      if (this.chainingPiece.position.equals(p)) {
        return chessMoves(this, this.chainingPiece);
      } else {
        return null;
      }
    } else if (
      pieces instanceof ChessPiece &&
      pieces.color == this.currentPlayer.value
    ) {
      return chessMoves(this, pieces);
    } else if (pieces instanceof ChessPair) {
      // Pairs may always move.
      return chessMoves(this, pieces.ofColor(this.currentPlayer.value));
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
      throw new Error("This move is not allowed.");
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
    this.currentPlayer.apply(oppositeColor);
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
      default:
        throw new Error(
          "There are more than two pieces on the same tile. This is forbidden."
        );
    }
  }

  /**
   * Returns pieces at the given position with the given color.
   * The `chaining` piece is excluded as it has a virtual position.
   * With this constraint, there is at most one such piece.
   * @throws May throw if the internal Board state is inconsistent.
   */
  public atWithColor(p: Position, c: PlayerColor): ChessPiece | null {
    let piece = this._at(p).filter(chessPiece => chessPiece.color == c);
    if (piece.length == 0) {
      return null;
    } else if (piece.length == 1) {
      return piece[0];
    } else {
      throw new Error(
        "There is more one pieces of a color on the same tile. This is forbidden."
      );
    }
  }

  /**
   * Determines wether a piece of color c may move into position p by moving,
   * dancing or chaining.
   * @param p
   * @param c
   */
  public canMoveWithColor(p: Position, c: PlayerColor): boolean {
    let pieces = this.at(p);
    if (pieces == null) {
      return true;
    } else if (pieces instanceof ChessPair) {
      return true;
    } else {
      return pieces.color != c;
    }
  }

  get chainingPiece(): ChessPiece | null {
    return this.chaining;
  }

  public indexOf(piece: ChessPiece): number {
    let index = this.pieces.indexOf(piece);
    if (index < 0) {
      throw new Error("The piece is not on the board.");
    }
    return index;
  }

  /** Serialize a PacoBoard object into a data only JSON object. */
  get json(): Object {
    return {
      pieces: this.pieces.map(piece => piece.json),
      chaining: this.chaining != null ? this.indexOf(this.chaining) : null,
      currentPlayer: this.currentPlayer.value
    };
  }

  /** Deserialize a JSON object into a PacoBoard */
  public static fromJson(json: any): PacoBoard {
    console.log(json);
    if (
      !json ||
      !json.pieces ||
      json.currentPlayer === undefined ||
      json.chaining === undefined
    ) {
      throw new Error(`Error parsing ${JSON.stringify(json)} as a PacoBoard.`);
    }
    return new PacoBoard(
      json.pieces.map(ChessPiece.fromJson),
      new Observable(json.currentPlayer),
      json.chaining
    );
  }

  /**
   * Update values of this PacoBoard instance from a provided instance.
   * This keeps Observers on the various properties alive.
   */
  public copyInformation(source: PacoBoard) {
    this.pieces.forEach((piece, index) =>
      piece.copyInformation(source.pieces[index])
    );
    this.currentPlayer.value = source.currentPlayer.value;
    if (source.chaining != null) {
      let index = source.pieces.findIndex(piece => piece == source.chaining);
      this.chaining = this.pieces[index];
      console.log(`index: ${index}, piece: ${this.pieces[index]}`);
      // console.log(`Restoring chaining: ${JSON.stringify(this.chaining.json)}`);
    } else {
      this.chaining = null;
      console.log(`Restoring chaining: null`);
    }

    console.log(`chaining: ${this.chainingPiece}`);

    this.realignPieceStates();
  }

  private realignPieceStates() {
    this.pieces.forEach(piece => {
      piece.state = this.recomputePieceState(piece);
    });
  }

  private recomputePieceState(piece: ChessPiece): PieceState {
    if (piece == this.chaining) {
      return PieceState.leavingUnion;
    } else {
      let pieces = this.at(piece.position);
      if (pieces instanceof ChessPiece) {
        return PieceState.alone;
      } else if (pieces == null) {
        throw new Error("A non chaining piece must be found at its position.");
      } else if (
        this.chaining != null &&
        pieces.position.equals(this.chaining.position) &&
        piece.color == this.chaining.color
      ) {
        return PieceState.takingOver;
      } else {
        return PieceState.dancing;
      }
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

/**
 * Set up an empty Board according to PacoŜako rules.
 * @returns An array containing exactly 32 entries.
 */
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

/**
 * Calculate a list of all positions, where the piece may move according to
 * chess rules.
 * @param board
 * @param p
 */
function chessMoves(
  board: PacoBoard,
  piece: ChessPiece
): Array<Position> | null {
  switch (piece.type) {
    case PieceType.pawn:
      return chessPawnMoves(board, piece);
    case PieceType.rock:
      return chessRockMoves(board, piece);
    case PieceType.knight:
      return chessKnightMoves(board, piece);
    case PieceType.bishop:
      return chessBishopMoves(board, piece);
    case PieceType.queen:
      return chessQueenMoves(board, piece);
    case PieceType.king:
      return chessKingMoves(board, piece);
    default:
      return piece.type; // The type is never.
  }
}

function chessPawnMoves(board: PacoBoard, piece: ChessPiece): Array<Position> {
  let forward = piece.color == PlayerColor.white ? 1 : -1;
  let possibleMoves = new Array();
  {
    let strikeLeft = piece.position.add(-1, forward);
    if (
      strikeLeft != null &&
      board.atWithColor(strikeLeft, oppositeColor(piece.color)) != null
    ) {
      possibleMoves.push(strikeLeft);
    }
  }
  {
    let strikeRight = piece.position.add(1, forward);
    if (
      strikeRight != null &&
      board.atWithColor(strikeRight, oppositeColor(piece.color)) != null
    ) {
      possibleMoves.push(strikeRight);
    }
  }
  {
    let moveForward = piece.position.add(0, forward);
    if (moveForward != null && board.at(moveForward) == null) {
      possibleMoves.push(moveForward);
      if (
        (piece.position.y == 1 && piece.color == PlayerColor.white) ||
        (piece.position.y == 6 && piece.color == PlayerColor.black)
      ) {
        let leapForward = piece.position.add(0, 2 * forward);
        if (leapForward != null && board.at(leapForward) == null) {
          possibleMoves.push(leapForward);
        }
      }
    }
  }
  return possibleMoves;
}

function chessSlideMoves(
  board: PacoBoard,
  piece: ChessPiece,
  direction: [number, number]
): Array<Position> {
  let possibleMoves = new Array();
  let slide = piece.position.add(direction[0], direction[1]);
  while (slide != null) {
    let target = board.at(slide);
    if (target instanceof ChessPair) {
      possibleMoves.push(slide);
      return possibleMoves;
    } else if (target instanceof ChessPiece) {
      if (target.color != piece.color) {
        possibleMoves.push(slide);
        return possibleMoves;
      } else {
        return possibleMoves;
      }
    } else {
      possibleMoves.push(slide);
      slide = slide.add(direction[0], direction[1]);
    }
  }

  return possibleMoves;
}

function chessRockMoves(board: PacoBoard, piece: ChessPiece): Array<Position> {
  let possibleMoves: Array<Position> = new Array();
  const directions: Array<[number, number]> = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
  ];
  directions.forEach(direction => {
    possibleMoves = possibleMoves.concat(
      chessSlideMoves(board, piece, direction)
    );
  });
  return possibleMoves;
}

function chessKnightMoves(
  board: PacoBoard,
  piece: ChessPiece
): Array<Position> {
  const directions: Array<[number, number]> = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2]
  ];
  return directions
    .map(direction => piece.position.add(direction[0], direction[1]))
    .filter((p): p is Position => p != null)
    .filter(p => board.canMoveWithColor(p, piece.color));
}

function chessBishopMoves(
  board: PacoBoard,
  piece: ChessPiece
): Array<Position> {
  let possibleMoves: Array<Position> = new Array();
  const directions: Array<[number, number]> = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1]
  ];
  directions.forEach(direction => {
    possibleMoves = possibleMoves.concat(
      chessSlideMoves(board, piece, direction)
    );
  });
  return possibleMoves;
}

function chessQueenMoves(board: PacoBoard, piece: ChessPiece): Array<Position> {
  let possibleMoves: Array<Position> = new Array();
  const directions: Array<[number, number]> = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1]
  ];
  directions.forEach(direction => {
    possibleMoves = possibleMoves.concat(
      chessSlideMoves(board, piece, direction)
    );
  });
  return possibleMoves;
}

function chessKingMoves(board: PacoBoard, piece: ChessPiece): Array<Position> {
  const directions: Array<[number, number]> = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1]
  ];
  return directions
    .map(direction => piece.position.add(direction[0], direction[1]))
    .filter((p): p is Position => p != null)
    .filter(p => board.at(p) == null);
}
