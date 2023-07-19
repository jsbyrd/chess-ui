import { Piece } from "./Piece";
import { PieceColor, PieceType } from "../utils";

export class Pawn extends Piece {
  hasMoved: boolean;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    super(x, y, type, color);
    this.hasMoved = false;
  }
}
