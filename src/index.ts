// index.ts
import message from "./message";

console.log(message);

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

type TileColor = "whiteTile" | "blackTile";

class Tile extends PIXI.Graphics {
  readonly tileColor: TileColor;
  private highlight: boolean = false;
  constructor(readonly tilePosition: Position, private board: Board) {
    super();
    if (isEvenPosition(this.tilePosition)) {
      this.tileColor = "whiteTile";
    } else {
      this.tileColor = "blackTile";
    }
    this.determineTint();

    this.lineStyle();
    this.beginFill(0xffffff);
    this.drawRect(0, 0, 100, 100);
    this.x = tilePosition.x * 100;
    this.y = tilePosition.y * 100;

    this.on("click", () => board.onClick(this.tilePosition));
    this.interactive = true;
  }
  determineTint() {
    if (!this.highlight) {
      if (this.tileColor == "whiteTile") {
        this.tint = whiteTileColor;
      } else {
        this.tint = blackTileColor;
      }
    } else {
      if (this.tileColor == "whiteTile") {
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

interface Position {
  kind: "position";
  x: number;
  y: number;
}

function isEvenPosition(p: Position) {
  return (p.x + p.y) % 2 == 0;
}

class Board extends PIXI.Container {
  private highlight: Position | null = null;
  private tiles: Array<Array<Tile>> = new Array(8);
  constructor() {
    super();

    for (let x = 0; x < 8; x++) {
      let column = new Array(8);
      for (let y = 0; y < 8; y++) {
        let tile = new Tile({ kind: "position", x, y }, this);
        this.addChild(tile);
        column[y] = tile;
      }
      this.tiles[x] = column;
    }
    this.on("mousedown", () => console.log("testing"));
  }
  onClick(p: Position) {
    simpleLog("Click on " + p.x + ", " + p.y);
    this.clearHighlight();
    this.setHighlight(p);
  }
  clearHighlight() {
    if (this.highlight == null) {
      simpleLog("isNull");
      return;
    }
    this.tiles[this.highlight.x][this.highlight.y].clearHighlight();
  }
  setHighlight(p: Position) {
    this.tiles[p.x][p.y].setHighlight();
    this.highlight = p;
  }
}

app.stage.addChild(boardBackground());
let board = new Board();
board.x = 50;
board.y = 50;
app.stage.addChild(board);
