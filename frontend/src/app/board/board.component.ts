import { Component, OnInit } from "@angular/core";
import { ChessPiece, PieceType, PlayerColor } from "../types";
import { LoggerService } from "../logger.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"]
})
export class BoardComponent implements OnInit {
  pieces: ChessPiece[] = [
    new ChessPiece(PieceType.rock, PlayerColor.white, { x: 0, y: 0 }),
    new ChessPiece(PieceType.knight, PlayerColor.white, { x: 1, y: 0 }),
    new ChessPiece(PieceType.bishop, PlayerColor.white, { x: 2, y: 0 }),
    new ChessPiece(PieceType.queen, PlayerColor.white, { x: 3, y: 0 }),
    new ChessPiece(PieceType.king, PlayerColor.white, { x: 4, y: 0 }),
    new ChessPiece(PieceType.bishop, PlayerColor.white, { x: 5, y: 0 }),
    new ChessPiece(PieceType.knight, PlayerColor.white, { x: 6, y: 0 }),
    new ChessPiece(PieceType.rock, PlayerColor.white, { x: 7, y: 0 }),
    new ChessPiece(PieceType.pawn, PlayerColor.white, { x: 0, y: 1 }),
    new ChessPiece(PieceType.pawn, PlayerColor.white, { x: 1, y: 1 }),
    new ChessPiece(PieceType.pawn, PlayerColor.white, { x: 2, y: 1 }),
    new ChessPiece(PieceType.pawn, PlayerColor.white, { x: 3, y: 1 }),
    new ChessPiece(PieceType.pawn, PlayerColor.white, { x: 4, y: 1 }),
    new ChessPiece(PieceType.pawn, PlayerColor.white, { x: 5, y: 1 }),
    new ChessPiece(PieceType.pawn, PlayerColor.white, { x: 6, y: 1 }),
    new ChessPiece(PieceType.pawn, PlayerColor.white, { x: 7, y: 1 }),
    new ChessPiece(PieceType.rock, PlayerColor.black, { x: 0, y: 7 }),
    new ChessPiece(PieceType.knight, PlayerColor.black, { x: 1, y: 7 }),
    new ChessPiece(PieceType.bishop, PlayerColor.black, { x: 2, y: 7 }),
    new ChessPiece(PieceType.queen, PlayerColor.black, { x: 3, y: 7 }),
    new ChessPiece(PieceType.king, PlayerColor.black, { x: 4, y: 7 }),
    new ChessPiece(PieceType.bishop, PlayerColor.black, { x: 5, y: 7 }),
    new ChessPiece(PieceType.knight, PlayerColor.black, { x: 6, y: 7 }),
    new ChessPiece(PieceType.rock, PlayerColor.black, { x: 7, y: 7 }),
    new ChessPiece(PieceType.pawn, PlayerColor.black, { x: 0, y: 6 }),
    new ChessPiece(PieceType.pawn, PlayerColor.black, { x: 1, y: 6 }),
    new ChessPiece(PieceType.pawn, PlayerColor.black, { x: 2, y: 6 }),
    new ChessPiece(PieceType.pawn, PlayerColor.black, { x: 3, y: 6 }),
    new ChessPiece(PieceType.pawn, PlayerColor.black, { x: 4, y: 6 }),
    new ChessPiece(PieceType.pawn, PlayerColor.black, { x: 5, y: 6 }),
    new ChessPiece(PieceType.pawn, PlayerColor.black, { x: 6, y: 6 }),
    new ChessPiece(PieceType.pawn, PlayerColor.black, { x: 7, y: 6 })
  ];

  constructor(public loggingService: LoggerService) {}

  ngOnInit() {}

  onPieceClick(piece: ChessPiece) {
    this.loggingService.add(`Piece clicked: ${JSON.stringify(piece)}`);
  }
}
