// index.ts
import message from "./message";

console.log(message);

function simpleLog(text: string) {
  let p = document.createElement("p");
  p.innerHTML = text;
  document.getElementById("output").appendChild(p);
}

const blackTileColor = 0x448844;
const whiteTileColor = 0xccffcc;

let pixiNode = document.getElementById("pixi");

let app = new PIXI.Application(900, 900, {
  backgroundColor: whiteTileColor
});
pixiNode.innerHTML = "";
pixiNode.appendChild(app.view);

function boardBackground() {
  var graphics = new PIXI.Graphics();
  graphics.lineStyle();
  graphics.beginFill(0x000000);
  graphics.drawRect(45, 45, 810, 810);
  return graphics;
}

function blackTile(x, y) {
  var graphics = new PIXI.Graphics();
  graphics.beginFill(blackTileColor);
  graphics.lineStyle();
  graphics.drawRect(50 + x * 100, 50 + y * 100, 100, 100);
  return graphics;
}

function whiteTile(x, y) {
  var graphics = new PIXI.Graphics();
  graphics.beginFill(whiteTileColor);
  graphics.lineStyle();
  graphics.drawRect(50 + x * 100, 50 + y * 100, 100, 100);
  return graphics;
}

type TileColor = "whiteTile" | "blackTile";

class Tile extends PIXI.Graphics {
  readonly tileColor: TileColor;
  constructor(readonly tilePosition: Position, private board: Board) {
    super();
    if (isEvenPosition(this.tilePosition)) {
      this.tileColor = "whiteTile";
    } else {
      this.tileColor = "blackTile";
    }

    this.lineStyle();
    this.beginFill(this.fill());
    this.drawRect(0, 0, 100, 100);
    this.x = tilePosition.x * 100;
    this.y = tilePosition.y * 100;

    this.on("click", event => board.onClick(this.tilePosition));
    this.interactive = true;
  }
  fill(): number {
    if (this.tileColor == "whiteTile") {
      return whiteTileColor;
    } else {
      return blackTileColor;
    }
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
  private highlight: Position | null;
  constructor() {
    super();

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        let tile = new Tile({ kind: "position", x, y }, this);
        this.addChild(tile);
      }
    }
    this.on("mousedown", event => console.log("testing"));
  }
  onClick(p: Position) {
    simpleLog("hi from " + p.x + ", " + p.y);
  }
}

app.stage.addChild(boardBackground());
let board = new Board();
board.x = 50;
board.y = 50;
app.stage.addChild(board);
