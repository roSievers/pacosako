// index.ts
import {
  BoardMap,
  Position,
  TileColor,
  PlayerColor,
  PieceType,
  Vector,
  PieceState,
  colorName
} from "./basicTypes";
import { PacoBoard, ChessPiece } from "./paco";

// Placeholder Graphics from https://openclipart.org/user-detail/akiross
// TODO: Use a tile set
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
  private _selection: Position | null = null;
  /** The tiles which make up the board. */
  private readonly tiles: BoardMap<Tile>;
  /** Internal representation of the Board. */
  public readonly pacoBoard: PacoBoard = new PacoBoard();
  /** A flat list of all pieces. They remember their own position. */
  private readonly pieces: Map<ChessPiece, VisualPiece> = this.createPieces();
  constructor() {
    super();

    this.tiles = new BoardMap(p => new Tile(p, this));
    this.tiles.forEach((_, tile) => this.addChild(tile));

    this.pieces.forEach(piece => this.addChild(piece.sprite));
  }
  /** Replaces the internal representation with the supplied representation. */
  load(pacoBoard: PacoBoard) {
    // Replace pieces.
    this.pacoBoard.copyInformation(pacoBoard);
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
    if (this.selection == null) {
      this.onBeginSelection(p);
    } else {
      this.onCommandMove(this.selection, p);
      if (this.pacoBoard.chainingPiece != null) {
        this.selection = this.pacoBoard.chainingPiece.position;
      } else {
        this.selection = null;
      }
    }
  }
  private onCommandMove(start: Position, target: Position) {
    try {
      this.pacoBoard.move(start, target);
    } catch (error) {
      simpleLog("Error while moving: " + error);
    }
  }
  private onBeginSelection(p: Position) {
    let legalMoves = this.pacoBoard.select(p);
    if (legalMoves != null && legalMoves.length > 0) {
      this.selection = p;
    }
  }
  get selection(): Position | null {
    return this._selection;
  }
  set selection(newSelection: Position | null) {
    // Clear old highlight, if there was one.
    if (this._selection != null) {
      this.tiles.get(this._selection).clearHighlight();
    }
    this._selection = newSelection;
    // Add new highlight, if there is one.
    if (newSelection != null) {
      this.tiles.get(newSelection).setHighlight();
    }
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

/**
 * Here Piece can't extend PIXI.Sprite, as we initialize the sprite via a
 * static function, not a constructor.
 */
class VisualPiece {
  public sprite: PIXI.Sprite;
  constructor(readonly data: ChessPiece) {
    this.sprite = loadPieceSprite(data);
    data.positionObs.subscribe(_ => this.recalculatePosition());
    data.stateObs.subscribe(_ => this.recalculatePosition());
    this.recalculatePosition();
  }
  get color(): PlayerColor {
    return this.data.color;
  }
  get offset(): Vector {
    if (this.data.state == PieceState.alone) {
      return Vector.zero;
    }
    if (this.data.state == PieceState.dancing) {
      if (this.color == PlayerColor.white) {
        return Vector.x(20);
      } else {
        return Vector.x(-20);
      }
    }
    if (this.data.state == PieceState.takingOver) {
      if (this.color == PlayerColor.white) {
        return new Vector(10, 10);
      } else {
        return new Vector(-10, 10);
      }
    }
    if (this.data.state == PieceState.leavingUnion) {
      if (this.color == PlayerColor.white) {
        return new Vector(30, -10);
      } else {
        return new Vector(-30, -10);
      }
    }
    return Vector.zero;
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

// TODO: We should not directly change the DOM. Use a framework like Angular/Vue.
board.pacoBoard.currentPlayer.subscribeAndFire(color => {
  let label = document.getElementById("currentPlayer");
  if (label != null) {
    label.innerHTML = colorName(color);
  }
});

let jsonStore: string | null = null;

function onStoreState() {
  const json = JSON.stringify(board.pacoBoard.json);

  var request = new XMLHttpRequest();
  request.open("POST", "/board", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(json);
}

function onLoadState() {
  // Fire AJAX request for the board state and listen to result.

  var request = new XMLHttpRequest();
  request.open("GET", "/board", true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      simpleLog(`Received data: ${request.responseText}`);
      var data = JSON.parse(request.responseText);
      onLoadSuccess(data);
    } else {
      simpleLog(
        `We reached our target server, but it returned an error: ${
          request.status
        }`
      );
    }
  };

  request.onerror = function() {
    simpleLog("There was a connection error of some sort.");
  };

  request.send();
}

function onLoadSuccess(data: any) {
  try {
    let pacoBoard = PacoBoard.fromJson(data);
    simpleLog(`Retrieved ${pacoBoard} from storage.`);
    board.load(pacoBoard);
  } catch (error) {
    simpleLog(`Error during deserialization: ${error}.`);
    throw error;
  }
}

let storeButton = document.getElementById("storeButton");
if (storeButton) {
  // Clone the button in order to remove all event listeners.
  let clone = storeButton.cloneNode(true);
  if (storeButton.parentNode != null)
    storeButton.parentNode.replaceChild(clone, storeButton);
  clone.addEventListener("click", onStoreState);
}

let loadButton = document.getElementById("loadButton");
if (loadButton) {
  // Clone the button in order to remove all event listeners.
  let clone = loadButton.cloneNode(true);
  if (loadButton.parentNode != null)
    loadButton.parentNode.replaceChild(clone, loadButton);
  clone.addEventListener("click", onLoadState);
}
