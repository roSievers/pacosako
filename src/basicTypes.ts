// basicTypes.ts

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
 * The PlayerColor is either white or black.
 */
export enum PlayerColor {
  white,
  black
}

/**
 * The TileColor is either white or black. This is separate from the PlayerColor
 * as they are not related.
 */
export enum TileColor {
  white,
  black
}

/**
 * The Position class expresses a position on the board. Both x and y
 * must be in the set {0, 1, .., 7}. A Position is immutable.
 */
export class Position {
  constructor(private _x: number, private _y: number) {
    if (_x < 0 || 7 < _x || _y < 0 || 7 < _y) {
      throw new Error("Can't initialize Position with x=${x}, y=${y}.");
    }
  }
  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
}

/**
 * The Vector class expresses an immutable pair of numbers x, y.
 */
export class Vector {
  constructor(private _x: number, private _y: number) {}
  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
  /** Returns a new zero vector. */
  static get zero(): Vector {
    return new Vector(0, 0);
  }
  /** Returns a new vector with the given x and y = 0. */
  static x(_x: number): Vector {
    return new Vector(_x, 0);
  }
  /** Returns a new vector with x = 0 and the given y. */
  static y(_y: number): Vector {
    return new Vector(0, _y);
  }
}

/**
 * Helper function for coloring the tiles.
 * @param p
 */
export function isEvenPosition(p: Position): boolean {
  return (p.x + p.y) % 2 == 0;
}

export function samePosition(p1: Position, p2: Position): boolean {
  return p1.x == p2.x && p1.y == p2.y;
}

export function addPosition(p1: Position, p2: Position): Position {
  return new Position(p1.x + p2.x, p1.y + p2.y);
}
export function addVector(p1: Vector, p2: Vector) {
  return new Vector(p1.x + p2.x, p1.y + p2.y);
}

/**
 * Helper function to turn an internal position {x:5, y:2} into a human readable
 * position "f3".
 * @param p
 */
export function chessPosition(p: Position): string {
  return "abcdefgh"[p.x] + p.y;
}

/**
 * The BoardMap class implements a Map object which takes Position as the index
 * and stores a value of type T.
 */
export class BoardMap<T> {
  private values: Array<Array<T>> = new Array(8);
  constructor(init: (p: Position) => T) {
    for (let x = 0; x < 8; x++) {
      this.values[x] = new Array(8);
      for (let y = 0; y < 8; y++) {
        this.values[x][y] = init(new Position(x, y));
      }
    }
  }
  public get(p: Position): T {
    return this.values[p.x][p.y];
  }
  public set(p: Position, value: T) {
    this.values[p.x][p.y] = value;
  }
  /**
   * The `forEach()` method executes a provided function once for each position
   * of the Board. It will execute the leftmost column first from top to bottom
   * and then continue column by column.
   * @param f Function to execute for each element.
   */
  public forEach(f: (p: Position, v: T, map: BoardMap<T>) => any) {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        f(new Position(x, y), this.get(new Position(x, y)), this);
      }
    }
  }
}
