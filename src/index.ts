// index.ts
import {
  BoardMap,
  Position,
  TileColor,
  PlayerColor,
  PieceType,
  isEvenPosition,
  samePosition
} from "./basicTypes";

// Placeholder Graphics from https://openclipart.org/user-detail/akiross
// TODO: Use a Tileset
// TODO: Get graphics which look even better.
const whitePawnFile: string = require("../assets/pawn-w.png");
const whiteRockFile: string = require("../assets/rock-w.png");
const whiteKnightFile: string = require("../assets/knight-w.png");
const whiteBishopFile: string = require("../assets/bishop-w.png");
const whiteQueenFile: string = require("../assets/queen-w.png");
const whiteKingFile: string = require("../assets/king-w.png");
const blackPawnFile: string = require("../assets/pawn-b.png");
const blackRockFile: string = require("../assets/rock-b.png");
const blackKnightFile: string = require("../assets/knight-b.png");
const blackBishopFile: string = require("../assets/bishop-b.png");
const blackQueenFile: string = require("../assets/queen-b.png");
const blackKingFile: string = require("../assets/king-b.png");

const outputContainer = document.getElementById("output");
if (outputContainer) {
  outputContainer.innerHTML = "";
}

function simpleLog(text: string) {
  let p = document.createElement("p");
  p.innerHTML = text;
  if (outputContainer) {
    outputContainer.appendChild(p);
  }
}

const blackTileColor = 0x448844;
const whiteTileColor = 0xccffcc;
const blackTileHighlightColor = 0xaaaa66;
const whiteTileHighlightColor = 0xddddcc;

let pixiNode = document.getElementById("pixi");

let app = new PIXI.Application(900, 900, {
  backgroundColor: whiteTileColor
});
if (pixiNode) {
  pixiNode.innerHTML = "";
  pixiNode.appendChild(app.view);
}

function boardBackground() {
  var graphics = new PIXI.Graphics();
  graphics.lineStyle();
  graphics.beginFill(0x000000);
  graphics.drawRect(45, 45, 810, 810);
  return graphics;
}

class Tile extends PIXI.Graphics {
  readonly tileColor: TileColor;
  private highlight: boolean = false;
  constructor(readonly tilePosition: Position, private board: Board) {
    super();
    if (isEvenPosition(this.tilePosition)) {
      this.tileColor = TileColor.black;
    } else {
      this.tileColor = TileColor.white;
    }
    this.determineTint();

    this.lineStyle();
    this.beginFill(0xffffff);
    this.drawRect(0, 0, 100, 100);
    const pos = pixelPosition(tilePosition);
    this.x = pos.x_px;
    this.y = pos.y_px;

    this.on("click", () => board.onClick(this.tilePosition));
    this.interactive = true;
    this.interactiveChildren = false;
    this.hitArea = new PIXI.Rectangle(0, 0, 100, 100);
  }
  determineTint() {
    if (!this.highlight) {
      if (this.tileColor == TileColor.white) {
        this.tint = whiteTileColor;
      } else {
        this.tint = blackTileColor;
      }
    } else {
      if (this.tileColor == TileColor.black) {
        this.tint = blackTileHighlightColor;
      } else {
        this.tint = whiteTileHighlightColor;
      }
    }
  }
  clearHighlight() {
    this.highlight = false;
    this.determineTint();
  }
  setHighlight() {
    this.highlight = true;
    this.determineTint();
  }
}

class Board extends PIXI.Container {
  /** Represents the piece that is currently held by the player. */
  private highlight: null | Piece | Pair = null;
  /** The tiles which make up the board. */
  private readonly tiles: BoardMap<Tile>;
  /** A flat list of all pieces. They remember their own position. */
  private readonly pieces: Array<Piece> = this.createPieces();
  constructor() {
    super();

    this.tiles = new BoardMap(p => new Tile(p, this));
    this.tiles.forEach((_, tile) => this.addChild(tile));

    this.pieces.forEach(piece => this.addChild(piece.sprite));

    this.on("mousedown", () => console.log("testing"));
  }
  createPieces(): Array<Piece> {
    let pieces: Array<Piece> = new Array(32);
    // All pawns
    for (let x = 0; x < 8; x++) {
      pieces[x] = new Piece(PieceType.pawn, PlayerColor.white, { x, y: 1 });
      pieces[x + 16] = new Piece(PieceType.pawn, PlayerColor.black, {
        x,
        y: 6
      });
    }
    // White pieces
    pieces[8] = new Piece(PieceType.rock, PlayerColor.white, { x: 0, y: 0 });
    pieces[9] = new Piece(PieceType.knight, PlayerColor.white, { x: 1, y: 0 });
    pieces[10] = new Piece(PieceType.bishop, PlayerColor.white, { x: 2, y: 0 });
    pieces[11] = new Piece(PieceType.queen, PlayerColor.white, { x: 3, y: 0 });
    pieces[12] = new Piece(PieceType.king, PlayerColor.white, { x: 4, y: 0 });
    pieces[13] = new Piece(PieceType.bishop, PlayerColor.white, { x: 5, y: 0 });
    pieces[14] = new Piece(PieceType.knight, PlayerColor.white, { x: 6, y: 0 });
    pieces[15] = new Piece(PieceType.rock, PlayerColor.white, { x: 7, y: 0 });
    // Black pieces
    pieces[24] = new Piece(PieceType.rock, PlayerColor.black, { x: 0, y: 7 });
    pieces[25] = new Piece(PieceType.knight, PlayerColor.black, { x: 1, y: 7 });
    pieces[26] = new Piece(PieceType.bishop, PlayerColor.black, { x: 2, y: 7 });
    pieces[27] = new Piece(PieceType.queen, PlayerColor.black, { x: 3, y: 7 });
    pieces[28] = new Piece(PieceType.king, PlayerColor.black, { x: 4, y: 7 });
    pieces[29] = new Piece(PieceType.bishop, PlayerColor.black, { x: 5, y: 7 });
    pieces[30] = new Piece(PieceType.knight, PlayerColor.black, { x: 6, y: 7 });
    pieces[31] = new Piece(PieceType.rock, PlayerColor.black, { x: 7, y: 7 });
    return pieces;
  }
  piecesAt(p: Position): Array<Piece> {
    return this.pieces.filter(piece => piece.isAt(p));
  }
  /**
   * This event is triggered, when any tile is clicked. Based on its state,
   * the Board decides which action to take.
   */
  public onClick(p: Position) {
    if (this.highlight == null) {
      this.onBeginSelection(p);
    } else {
      const piecesOnClickedTile: Array<Piece> = this.piecesAt(p);
      if (piecesOnClickedTile.length == 0) {
        this.onMoveCommand(this.highlight, p);
      } else if (this.highlight instanceof Piece) {
        if (piecesOnClickedTile.length == 1) {
          this.onDanceCommand(this.highlight, piecesOnClickedTile[0]);
        } else {
          this.clearHighlight();
        }
      } else {
        this.clearHighlight();
      }
    }
  }
  onDanceCommand(highlightedPiece: Piece, partner: Piece): any {
    if (highlightedPiece.color != partner.color) {
      this.onMoveCommand(highlightedPiece, partner.position);
    } else {
      this.clearHighlight();
    }
  }
  /**
   * Moves a piece to the target position without regard for pieces that are
   * already present at the target position. Make sure that moving is ok,
   * before you call this function.
   *
   * This function should however check, if the move is legal.
   */
  onMoveCommand(highlightedPieces: Piece | Pair, target: Position): any {
    // TODO: Check if this is a legal move.

    this.clearHighlight(); // Here it is important that we clear before we move.
    highlightedPieces.position = target;
  }
  private onBeginSelection(p: Position): any {
    const piecesOnClickedTile: Array<Piece> = this.piecesAt(p);
    if (piecesOnClickedTile.length == 1) {
      this.setHighlight(piecesOnClickedTile[0]);
    }
    if (piecesOnClickedTile.length == 2) {
      this.setHighlight(
        new Pair(piecesOnClickedTile[0], piecesOnClickedTile[1])
      );
    }
  }
  clearHighlight() {
    // TODO: clean up calls to this function.
    if (this.highlight == null) {
      return;
    }
    this.tiles.get(this.highlight.position).clearHighlight();
    this.highlight = null;
  }
  setHighlight(highlightedPieces: Piece | Pair) {
    this.tiles.get(highlightedPieces.position).setHighlight();
    this.highlight = highlightedPieces;
  }
}

function loadPieceSprite(piece: PieceType, color: PlayerColor): PIXI.Sprite {
  if (color == PlayerColor.white) {
    switch (piece) {
      case PieceType.pawn:
        return PIXI.Sprite.fromImage(whitePawnFile, undefined, 1);
      case PieceType.rock:
        return PIXI.Sprite.fromImage(whiteRockFile, undefined, 1);
      case PieceType.knight:
        return PIXI.Sprite.fromImage(whiteKnightFile, undefined, 1);
      case PieceType.bishop:
        return PIXI.Sprite.fromImage(whiteBishopFile, undefined, 1);
      case PieceType.queen:
        return PIXI.Sprite.fromImage(whiteQueenFile, undefined, 1);
      case PieceType.king:
        return PIXI.Sprite.fromImage(whiteKingFile, undefined, 1);
      default:
        return piece; // Here piece is of type never, so we may return it as a Pixi.Sprite
    }
  } else {
    switch (piece) {
      case PieceType.pawn:
        return PIXI.Sprite.fromImage(blackPawnFile, undefined, 1);
      case PieceType.rock:
        return PIXI.Sprite.fromImage(blackRockFile, undefined, 1);
      case PieceType.knight:
        return PIXI.Sprite.fromImage(blackKnightFile, undefined, 1);
      case PieceType.bishop:
        return PIXI.Sprite.fromImage(blackBishopFile, undefined, 1);
      case PieceType.queen:
        return PIXI.Sprite.fromImage(blackQueenFile, undefined, 1);
      case PieceType.king:
        return PIXI.Sprite.fromImage(blackKingFile, undefined, 1);
      default:
        return piece; // Here piece is of type never, so we may return it as a Pixi.Sprite
    }
  }
}

/**
 * Here Piece can't extend PIXI.Sprite, as we initialize the sprite via a
 * static function, not a constructor.
 */
class Piece {
  public sprite: PIXI.Sprite;
  private _position: Position;
  constructor(
    readonly type: PieceType,
    readonly color: PlayerColor,
    position: Position
  ) {
    this.sprite = loadPieceSprite(type, color);
    this.position = position;
  }
  get offset(): number {
    if (this.color == PlayerColor.white) {
      return 20;
    } else {
      return -20;
    }
  }
  get position(): Position {
    return this._position;
  }
  set position(p: Position) {
    this._position = p;
    const pos = pixelPosition(p);
    this.sprite.x = pos.x_px + this.offset;
    this.sprite.y = pos.y_px;
  }
  isAt(p: Position): any {
    return this._position.x == p.x && this._position.y == p.y;
  }
}

class Pair {
  constructor(public whitePiece: Piece, public blackPiece: Piece) {
    this.assertIntegrity();
  }
  assertIntegrity() {
    if (!samePosition(this.whitePiece.position, this.blackPiece.position)) {
      throw new Error("Pieces of a pair must share of Position.");
    }
  }
  get position(): Position {
    this.assertIntegrity();
    return this.whitePiece.position;
  }
  set position(p: Position) {
    this.whitePiece.position = p;
    this.blackPiece.position = p;
  }
}

/**
 * Calculates the screen position of a tile position relative to the board.
 * This function returns {x_px, y_px} so it can't be mixed up with a Position.
 */
function pixelPosition(p: Position): { x_px: number; y_px: number } {
  return { x_px: 100 * p.x, y_px: 700 - 100 * p.y };
}

app.stage.addChild(boardBackground());
let board = new Board();
board.x = 50;
board.y = 50;
app.stage.addChild(board);
