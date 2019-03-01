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
  constructor(public readonly x: number, public readonly y: number) {
    if (x < 0 || 7 < x || y < 0 || 7 < y) {
      throw new Error("Can't initialize Position with x=${x}, y=${y}.");
    }
  }
  equals(other: Position): boolean {
    return this.x == other.x && this.y == other.y;
  }
  /**
   * Helper function for coloring the tiles.
   * @param p
   */
  get isEven(): boolean {
    return (this.x + this.y) % 2 == 0;
  }
}

/**
 * The Vector class expresses an immutable pair of numbers x, y.
 */
export class Vector {
  constructor(public readonly x: number, public readonly y: number) {}
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
  /** Takes another Vector and returns the sum as a new Vector. */
  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }
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

/**
 * A very basic implementation of observables.
 */
export class Observable<T> {
  private subscribers: Array<Observer<T>> = new Array();
  constructor(private _value: T) {}
  get value() {
    return this._value;
  }
  set value(newValue: T) {
    this._value = newValue;
    this.subscribers.forEach(observer => {
      observer(newValue);
    });
  }
  subscribe(observer: Observer<T>) {
    this.subscribers.push(observer);
  }
}

/**
 * An Observer<T> is just a function that gets called on change.
 */
export type Observer<T> = (newValue: T) => any;
