import { PositionalAudio } from "three";

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
 * The Position interface expresses a position on the board. Both x and y
 * should be in the set {0, 1, .., 7}.
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Helper function for coloring the tiles.
 * @param p
 */
export function isEvenPosition(p: Position) {
  return (p.x + p.y) % 2 == 0;
}

export function samePosition(p1: Position, p2: Position) {
  return p1.x == p2.x && p1.y == p2.y;
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
        this.values[x][y] = init({ x, y });
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
        f({ x, y }, this.get({ x, y }), this);
      }
    }
  }
}
