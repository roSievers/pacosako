import { Subject } from 'rxjs';

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
 * Returns the opposite player color.
 * @param c
 */
function oppositeColor(c: PlayerColor): PlayerColor {
  if (c == PlayerColor.white) {
    return PlayerColor.black;
  } else {
    return PlayerColor.white;
  }
}

/**
 * Type of a move that is offered to the player.
 */
export enum PacoMoveType {
  plain,
  union,
  chain,
}

/**
 * Describes a possible move target and specifies what will happen
 * when you move there.
 */
export class MoveTarget {
  constructor(readonly position: Position, readonly type: PacoMoveType) {}
}

/**
 * A data only version of the Position class.
 */
export interface IPosition {
  readonly x: number;
  readonly y: number;
}

/**
 * The Position class expresses a position on the board. Both x and y
 * must be in the set {0, 1, .., 7}. A Position is immutable.
 */
export class Position implements IPosition {
  constructor(public readonly x: number, public readonly y: number) {
    if (x < 0 || 7 < x || y < 0 || 7 < y) {
      throw new Error("Can't initialize Position with x=${x}, y=${y}.");
    }
  }
  equals(other: IPosition): boolean {
    return this.x == other.x && this.y == other.y;
  }
  /**
   * Helper function for coloring the tiles.
   * @param p
   */
  get isEven(): boolean {
    return (this.x + this.y) % 2 == 0;
  }
  /**
   * Adds an offset to the position and returns it, if it is on the board.
   * Returns null instead of an invalid position.
   * @param x
   * @param y
   */
  public add(other: IPosition): Position | null {
    try {
      return new Position(this.x + other.x, this.y + other.y);
    } catch {
      return null;
    }
  }

  /** Serialize a Position object into a data only object. */
  get data(): IPosition {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /** Create a Position object from a data only object. */
  public static fromData(data: IPosition): Position {
    return new Position(data.x, data.y);
  }
}

/**
 * A ChessPiece is a data object which tracks its inherent properties
 * and its position.
 */
export class ChessPiece {
  public state: PieceState = PieceState.alone;

  constructor(
    public type: PieceType,
    public readonly color: PlayerColor,
    public position: Position,
  ) {}

  /**
   * This function promotes a pawn to a queen if possible.
   * @throws If the piece is not a pawn or at the wrong position.
   */
  promote() {
    if (this.type != PieceType.pawn) {
      throw new Error('Only pawns can be promoted.');
    } else if (this.color == PlayerColor.black && this.position.y != 0) {
      throw new Error('Black pawns may only be promoted in row 0.');
    } else if (this.color == PlayerColor.white && this.position.y != 7) {
      throw new Error('White pawns may only be promoted in row 7');
    } else {
      this.type = PieceType.queen;
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
  constructor(pieces: ChessPiece[]) {
    if (pieces.length != 2) {
      throw new Error(
        'A Pair has exactly two members. Received: ' + pieces.length,
      );
    }
    let whitePiece = pieces.find(piece => piece.color == PlayerColor.white);
    let blackPiece = pieces.find(piece => piece.color == PlayerColor.black);
    if (whitePiece == undefined) {
      throw new Error('You did not supply a white piece to the pair.');
    } else if (blackPiece == undefined) {
      throw new Error('You did not supply a black piece to the pair.');
    } else {
      this.white = whitePiece;
      this.black = blackPiece;
      this.assertIntegrity();
    }
  }
  assertIntegrity() {
    if (!this.white.position.equals(this.black.position)) {
      throw new Error('Pieces of a pair must share a Position.');
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

function piecesInInitialPosition(): ChessPiece[] {
  return [
    new ChessPiece(PieceType.rock, PlayerColor.white, new Position(0, 0)),
    new ChessPiece(PieceType.knight, PlayerColor.white, new Position(1, 0)),
    new ChessPiece(PieceType.bishop, PlayerColor.white, new Position(2, 0)),
    new ChessPiece(PieceType.queen, PlayerColor.white, new Position(3, 0)),
    new ChessPiece(PieceType.king, PlayerColor.white, new Position(4, 0)),
    new ChessPiece(PieceType.bishop, PlayerColor.white, new Position(5, 0)),
    new ChessPiece(PieceType.knight, PlayerColor.white, new Position(6, 0)),
    new ChessPiece(PieceType.rock, PlayerColor.white, new Position(7, 0)),
    new ChessPiece(PieceType.pawn, PlayerColor.white, new Position(0, 1)),
    new ChessPiece(PieceType.pawn, PlayerColor.white, new Position(1, 1)),
    new ChessPiece(PieceType.pawn, PlayerColor.white, new Position(2, 1)),
    new ChessPiece(PieceType.pawn, PlayerColor.white, new Position(3, 1)),
    new ChessPiece(PieceType.pawn, PlayerColor.white, new Position(4, 1)),
    new ChessPiece(PieceType.pawn, PlayerColor.white, new Position(5, 1)),
    new ChessPiece(PieceType.pawn, PlayerColor.white, new Position(6, 1)),
    new ChessPiece(PieceType.pawn, PlayerColor.white, new Position(7, 1)),
    new ChessPiece(PieceType.rock, PlayerColor.black, new Position(0, 7)),
    new ChessPiece(PieceType.knight, PlayerColor.black, new Position(1, 7)),
    new ChessPiece(PieceType.bishop, PlayerColor.black, new Position(2, 7)),
    new ChessPiece(PieceType.queen, PlayerColor.black, new Position(3, 7)),
    new ChessPiece(PieceType.king, PlayerColor.black, new Position(4, 7)),
    new ChessPiece(PieceType.bishop, PlayerColor.black, new Position(5, 7)),
    new ChessPiece(PieceType.knight, PlayerColor.black, new Position(6, 7)),
    new ChessPiece(PieceType.rock, PlayerColor.black, new Position(7, 7)),
    new ChessPiece(PieceType.pawn, PlayerColor.black, new Position(0, 6)),
    new ChessPiece(PieceType.pawn, PlayerColor.black, new Position(1, 6)),
    new ChessPiece(PieceType.pawn, PlayerColor.black, new Position(2, 6)),
    new ChessPiece(PieceType.pawn, PlayerColor.black, new Position(3, 6)),
    new ChessPiece(PieceType.pawn, PlayerColor.black, new Position(4, 6)),
    new ChessPiece(PieceType.pawn, PlayerColor.black, new Position(5, 6)),
    new ChessPiece(PieceType.pawn, PlayerColor.black, new Position(6, 6)),
    new ChessPiece(PieceType.pawn, PlayerColor.black, new Position(7, 6)),
  ];
}

/**
 * A Paco Ŝako board holding all the pieces and enforcing movement rules.
 */
export class PacoBoard {
  /**
   * The piece currently leaving a union without a defined target.
   */
  private chaining: ChessPiece | null = null;
  /**
   * Color of the current player
   */
  public currentPlayer: PlayerColor = PlayerColor.white;
  /**
   * The current state of all pieces. The objects modelling the pieces
   * will not change during runtime and can be used as keys in a map.
   */
  public pieces: ChessPiece[] = piecesInInitialPosition();

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
  select(p: Position): MoveTarget[] | null {
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
      pieces.color == this.currentPlayer
    ) {
      return chessMoves(this, pieces);
    } else if (pieces instanceof ChessPair) {
      // Pairs may always move, but they can only execute plain moves.
      let singlePieceMoves = chessMoves(
        this,
        pieces.ofColor(this.currentPlayer),
      );
      return singlePieceMoves.filter(move => move.type == PacoMoveType.plain);
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
    if (
      legalMoves == null ||
      legalMoves.every(p => !p.position.equals(target))
    ) {
      throw new Error('This move is not allowed.');
    }
    // Analyze situation
    if (this.chaining != null) {
      // A chain is active, the chaining piece must move.
      if (this.chaining.position.equals(start)) {
        this.singleMove(this.chaining, target);
        this._at(start).forEach(piece => (piece.state = PieceState.dancing));
      } else {
        throw new Error('A chain is active, move the chaining piece.');
      }
    } else {
      let movingPieces = this.at(start);
      if (movingPieces instanceof ChessPiece) {
        // Moving a single piece works just as moving the chain piece
        this.singleMove(movingPieces, target);
      } else if (movingPieces instanceof ChessPair) {
        this.pairMove(movingPieces, target);
      } else {
        throw new Error('There is no piece at the start position!');
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
      throw new Error('Pairs may only be moved onto empty squares.');
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
    this.currentPlayer = oppositeColor(this.currentPlayer);
  }

  /**
   * Returns all pieces at the given position in an unstructured list.
   * Note that the `chaining` piece is excluded as it has a virtual position.
   */
  private _at(p: Position): ChessPiece[] {
    return this.pieces.filter(
      chessPiece =>
        chessPiece.position.equals(p) && chessPiece != this.chaining,
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
          'There are more than two pieces on the same tile. This is forbidden.',
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
        'There is more one pieces of a color on the same tile. This is forbidden.',
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
      throw new Error('The piece is not on the board.');
    }
    return index;
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
        throw new Error('A non chaining piece must be found at its position.');
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

/**
 * Calculate a list of all positions, where the piece may move according to
 * chess rules.
 * @param board
 * @param p
 */
function chessMoves(board: PacoBoard, piece: ChessPiece): MoveTarget[] | null {
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

function chessPawnMoves(board: PacoBoard, piece: ChessPiece): MoveTarget[] {
  let forward = piece.color == PlayerColor.white ? 1 : -1;
  let possibleMoves: MoveTarget[] = new Array();
  {
    let strikeLeft = piece.position.add({ x: -1, y: forward });
    if (strikeLeft !== null) {
      let target = board.at(strikeLeft);
      if (target instanceof ChessPiece && target.color !== piece.color) {
        possibleMoves.push(new MoveTarget(strikeLeft, PacoMoveType.union));
      } else if (target instanceof ChessPair) {
        possibleMoves.push(new MoveTarget(strikeLeft, PacoMoveType.chain));
      }
    }
  }
  {
    let strikeRight = piece.position.add({ x: 1, y: forward });
    if (strikeRight !== null) {
      let target = board.at(strikeRight);
      if (target instanceof ChessPiece && target.color !== piece.color) {
        possibleMoves.push(new MoveTarget(strikeRight, PacoMoveType.union));
      } else if (target instanceof ChessPair) {
        possibleMoves.push(new MoveTarget(strikeRight, PacoMoveType.chain));
      }
    }
  }
  {
    let moveForward = piece.position.add({ x: 0, y: forward });
    if (moveForward != null && board.at(moveForward) == null) {
      possibleMoves.push(new MoveTarget(moveForward, PacoMoveType.plain));
      if (
        (piece.position.y == 1 && piece.color == PlayerColor.white) ||
        (piece.position.y == 6 && piece.color == PlayerColor.black)
      ) {
        let leapForward = piece.position.add({ x: 0, y: 2 * forward });
        if (leapForward != null && board.at(leapForward) == null) {
          possibleMoves.push(new MoveTarget(leapForward, PacoMoveType.plain));
        }
      }
    }
  }
  return possibleMoves;
}

function chessSlideMoves(
  board: PacoBoard,
  piece: ChessPiece,
  direction: IPosition,
): MoveTarget[] {
  let possibleMoves: MoveTarget[] = new Array();
  let slide = piece.position.add(direction);
  while (slide != null) {
    let target = board.at(slide);
    if (target instanceof ChessPair) {
      possibleMoves.push(new MoveTarget(slide, PacoMoveType.chain));
      return possibleMoves;
    } else if (target instanceof ChessPiece) {
      if (target.color != piece.color) {
        possibleMoves.push(new MoveTarget(slide, PacoMoveType.union));
        return possibleMoves;
      } else {
        return possibleMoves;
      }
    } else {
      possibleMoves.push(new MoveTarget(slide, PacoMoveType.plain));
      slide = slide.add(direction);
    }
  }

  return possibleMoves;
}

function chessRockMoves(board: PacoBoard, piece: ChessPiece): MoveTarget[] {
  let possibleMoves: MoveTarget[] = new Array();
  const directions: IPosition[] = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
  ];
  directions.forEach(direction => {
    possibleMoves = possibleMoves.concat(
      chessSlideMoves(board, piece, direction),
    );
  });
  return possibleMoves;
}

function chessKnightMoves(board: PacoBoard, piece: ChessPiece): MoveTarget[] {
  let possibleMoves: MoveTarget[] = new Array();
  const directions: IPosition[] = [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: 1, y: -2 },
    { x: -1, y: -2 },
    { x: -2, y: -1 },
    { x: -2, y: 1 },
    { x: -1, y: 2 },
  ];
  directions.forEach(p => {
    let position = piece.position.add(p);
    if (position !== null) {
      let target = board.at(position);
      if (target === null) {
        possibleMoves.push(new MoveTarget(position, PacoMoveType.plain));
      } else if (target instanceof ChessPair) {
        possibleMoves.push(new MoveTarget(position, PacoMoveType.chain));
      } else if (target.color != piece.color) {
        possibleMoves.push(new MoveTarget(position, PacoMoveType.union));
      }
    }
  });
  return possibleMoves;
}

function chessBishopMoves(board: PacoBoard, piece: ChessPiece): MoveTarget[] {
  let possibleMoves: MoveTarget[] = new Array();
  const directions: IPosition[] = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];
  directions.forEach(direction => {
    possibleMoves = possibleMoves.concat(
      chessSlideMoves(board, piece, direction),
    );
  });
  return possibleMoves;
}

function chessQueenMoves(board: PacoBoard, piece: ChessPiece): MoveTarget[] {
  let possibleMoves: MoveTarget[] = new Array();
  const directions: IPosition[] = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];
  directions.forEach(direction => {
    possibleMoves = possibleMoves.concat(
      chessSlideMoves(board, piece, direction),
    );
  });
  return possibleMoves;
}

function chessKingMoves(board: PacoBoard, piece: ChessPiece): MoveTarget[] {
  const directions: IPosition[] = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];
  return directions
    .map(direction => piece.position.add(direction))
    .filter((p): p is Position => p != null)
    .filter(p => board.at(p) == null)
    .map(p => new MoveTarget(p, PacoMoveType.plain));
}
