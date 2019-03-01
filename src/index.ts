// index.ts
import {
  BoardMap,
  Position,
  TileColor,
  PlayerColor,
  PieceType,
  Vector
} from "./basicTypes";
import { PacoBoard, ChessPiece, ChessPair } from "./paco";

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
    if (this.tilePosition.isEven) {
      this.tileColor = TileColor.black;
    } else {
      this.tileColor = TileColor.white;
    }
    this.determineTint();

    this.lineStyle();
    this.beginFill(0xffffff);
    this.drawRect(0, 0, 100, 100);
    const pos = pixelPosition(tilePosition);
    this.x = pos.x;
    this.y = pos.y;

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
  private highlight: null | ChessPiece | ChessPair = null;
  /** The tiles which make up the board. */
  private readonly tiles: BoardMap<Tile>;
  /** Internal representation of the Board. */
  private pacoBoard: PacoBoard = new PacoBoard();
  /** A flat list of all pieces. They remember their own position. */
  private readonly pieces: Map<ChessPiece, VisualPiece> = this.createPieces();
  constructor() {
    super();

    this.tiles = new BoardMap(p => new Tile(p, this));
    this.tiles.forEach((_, tile) => this.addChild(tile));

    this.pieces.forEach(piece => this.addChild(piece.sprite));

    this.on("mousedown", () => console.log("testing"));
  }
  private createPieces(): Map<ChessPiece, VisualPiece> {
    // Type hint is due to https://github.com/Microsoft/TypeScript/issues/8936
    return new Map<ChessPiece, VisualPiece>(
      this.pacoBoard.pieces.map(
        chessPiece =>
          [chessPiece, new VisualPiece(chessPiece)] as [ChessPiece, VisualPiece]
      )
    );
  }
  public getVisual(abstract: ChessPiece): VisualPiece {
    let visual = this.pieces.get(abstract);
    if (visual != undefined) {
      return visual;
    } else {
      throw new Error("Chess Piece is not on Board.");
    }
  }
  /**
   * This event is triggered, when any tile is clicked. Based on its state,
   * the Board decides which action to take.
   */
  public onClick(p: Position) {
    if (this.highlight == null) {
      this.onBeginSelection(p);
    } else {
      const piecesOnClickedTile = this.pacoBoard.at(p);
      // const piecesOnClickedTile: Array<VisualPiece> = this.piecesAt(p);
      if (piecesOnClickedTile == null) {
        this.onMoveCommand(this.highlight, p);
      } else if (this.highlight instanceof ChessPiece) {
        if (piecesOnClickedTile instanceof ChessPiece) {
          this.onDanceCommand(this.highlight, piecesOnClickedTile);
        } else {
          this.onChainCommand(this.highlight, piecesOnClickedTile);
        }
      } else {
        this.clearHighlight();
      }
    }
  }
  /**
   * Dancing a piece into a Pair starts or extends a chain.
   *
   * @param highlight
   * @param piecesOnClickedTile Must contain exactly two entries.
   * TODO: Change the type of piecesOnClickedTile to Pair.
   *       This requires some refactoring of the calling method.
   */
  onChainCommand(highlight: ChessPiece, piecesOnClickedTile: ChessPair) {
    // Select the piece of same color from the pair.
    let freePiece = piecesOnClickedTile.ofColor(highlight.color);
    if (!freePiece) {
      throw new Error("This code path should be inaccessible.");
    }
    this.tiles.get(highlight.position).clearHighlight();
    highlight.position = freePiece.position;
    this.getVisual(highlight).state = PieceState.takingOver;
    this.getVisual(freePiece).state = PieceState.leavingUnion;
    this.highlight = freePiece;
  }
  onDanceCommand(highlightedPiece: ChessPiece, partner: ChessPiece) {
    if (highlightedPiece.color != partner.color) {
      this.getVisual(highlightedPiece).state = PieceState.dancing;
      this.getVisual(partner).state = PieceState.dancing;
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
  onMoveCommand(highlightedPieces: ChessPiece | ChessPair, target: Position) {
    // TODO: Check if this is a legal move.

    this.clearHighlight(); // Here it is important that we clear before we move.
    highlightedPieces.position = target;
  }
  private onBeginSelection(p: Position) {
    const piecesOnClickedTile = this.pacoBoard.at(p);
    if (piecesOnClickedTile == null) {
      return;
    }
    this.setHighlight(piecesOnClickedTile);
  }
  clearHighlight() {
    // TODO: clean up calls to this function.
    if (this.highlight == null) {
      return;
    }
    this.tiles.get(this.highlight.position).clearHighlight();
    this.highlight = null;
  }
  setHighlight(highlightedPieces: ChessPiece | ChessPair) {
    this.tiles.get(highlightedPieces.position).setHighlight();
    this.highlight = highlightedPieces;
  }
}

function loadPieceSprite(chessPiece: ChessPiece): PIXI.Sprite {
  if (chessPiece.color == PlayerColor.white) {
    switch (chessPiece.type) {
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
        return chessPiece.type; // Here piece is of type never, so we may return it as a Pixi.Sprite
    }
  } else {
    switch (chessPiece.type) {
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
        return chessPiece.type; // Here piece is of type never, so we may return it as a Pixi.Sprite
    }
  }
}

enum PieceState {
  alone,
  dancing,
  takingOver,
  leavingUnion
}

/**
 * Here Piece can't extend PIXI.Sprite, as we initialize the sprite via a
 * static function, not a constructor.
 */
class VisualPiece {
  public sprite: PIXI.Sprite;
  public _state: PieceState = PieceState.alone;
  constructor(readonly data: ChessPiece) {
    this.sprite = loadPieceSprite(data);
    data.positionObs.subscribe(_ => this.recalculatePosition());
    this.recalculatePosition();
  }
  get color(): PlayerColor {
    return this.data.color;
  }
  get offset(): Vector {
    if (this.state == PieceState.alone) {
      return Vector.zero;
    }
    if (this.state == PieceState.dancing) {
      if (this.color == PlayerColor.white) {
        return Vector.x(20);
      } else {
        return Vector.x(-20);
      }
    }
    if (this.state == PieceState.takingOver) {
      if (this.color == PlayerColor.white) {
        return new Vector(10, 10);
      } else {
        return new Vector(-10, 10);
      }
    }
    if (this.state == PieceState.leavingUnion) {
      if (this.color == PlayerColor.white) {
        return new Vector(30, -10);
      } else {
        return new Vector(-30, -10);
      }
    }
    return Vector.zero;
  }
  get state(): PieceState {
    return this._state;
  }
  set state(newState: PieceState) {
    this._state = newState;
    this.recalculatePosition();
  }
  recalculatePosition() {
    const pos = pixelPosition(this.data.position).add(this.offset);
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
  }
  isAt(p: Position): any {
    return this.data.position.x == p.x && this.data.position.y == p.y;
  }
}

/**
 * Calculates the screen position of a tile position relative to the board.
 */
function pixelPosition(p: Position): Vector {
  return new Vector(100 * p.x, 700 - 100 * p.y);
}

app.stage.addChild(boardBackground());
let board = new Board();
board.x = 50;
board.y = 50;
app.stage.addChild(board);
