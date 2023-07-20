import { Piece } from "./Piece";
import { PieceColor, PieceType } from "../utils";

export class Rook extends Piece {
  hasMoved: boolean;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    super(x, y, type, color);
    this.hasMoved = false;
  }

  generateMoves(currentBoard: Piece[]) {
    console.log(currentBoard);
    return null;
  }
}
