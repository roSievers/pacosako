// index.ts
import {
  BoardMap,
  Position,
  TileColor,
  PlayerColor,
  PieceType,
  isEvenPosition
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
      this.tileColor = TileColor.white;
    } else {
      this.tileColor = TileColor.black;
    }
    this.determineTint();

    this.lineStyle();
    this.beginFill(0xffffff);
    this.drawRect(0, 0, 100, 100);
    this.x = tilePosition.x * 100;
    this.y = tilePosition.y * 100;

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
        this.tint = whiteTileHighlightColor;
      } else {
        this.tint = blackTileHighlightColor;
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
  private highlight: Position | null = null;
  private readonly tiles: BoardMap<Tile>;
  private readonly pieces: BoardMap<Piece | null>;
  constructor() {
    super();

    this.tiles = new BoardMap(p => new Tile(p, this));
    this.tiles.forEach((_, tile) => this.addChild(tile));

    this.pieces = new BoardMap(this.initPiece);
    this.pieces.forEach((_, piece) => {
      if (piece != null) {
        this.addChild(piece.sprite);
      }
    });

    this.on("mousedown", () => console.log("testing"));
  }
  private initPiece(p: Position): Piece | null {
    let pieceColor: PlayerColor;
    let pieceType: PieceType;

    if (p.y > 1 && p.y < 6) {
      // There are no pieces in the middle.
      return null;
    } else if (p.y == 1 || p.y == 6) {
      pieceType = PieceType.pawn;
    } else if (p.x == 0 || p.x == 7) {
      pieceType = PieceType.rock;
    } else if (p.x == 1 || p.x == 6) {
      pieceType = PieceType.knight;
    } else if (p.x == 2 || p.x == 5) {
      pieceType = PieceType.bishop;
    } else if (isEvenPosition(p)) {
      pieceType = PieceType.queen;
    } else {
      pieceType = PieceType.king;
    }

    if (p.y <= 1) {
      pieceColor = PlayerColor.black;
    } else {
      pieceColor = PlayerColor.white;
    }

    return new Piece(pieceType, pieceColor, p);
  }
  onClick(p: Position) {
    this.clearHighlight();
    this.setHighlight(p);
  }
  clearHighlight() {
    if (this.highlight == null) {
      return;
    }
    this.tiles.get(this.highlight).clearHighlight();
  }
  setHighlight(p: Position) {
    this.tiles.get(p).setHighlight();
    this.highlight = p;
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
  constructor(
    readonly type: PieceType,
    readonly color: PlayerColor,
    readonly position: Position
  ) {
    this.sprite = loadPieceSprite(type, color);
    this.sprite.x = 100 * position.x;
    this.sprite.y = 100 * position.y;
  }
}

app.stage.addChild(boardBackground());
let board = new Board();
board.x = 50;
board.y = 50;
app.stage.addChild(board);
