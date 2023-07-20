import { Piece } from "./Piece";
import { PieceColor, PieceType, Position } from "../utils";

export class Pawn extends Piece {
  hasMoved: boolean;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    super(x, y, type, color);
    this.hasMoved = false;
  }

  generateMoves(currentBoard: Piece[]) {
    let moves: Position[] = [];

    // White Pawn
    if (this.color === PieceColor.WHITE && this.position.y > 0) {
      moves.push(new Position(this.position.x, this.position.y - 1));
    }

    // Black Pawn
    if (this.color === PieceColor.BLACK && this.position.y < 7) {
      moves.push(new Position(this.position.x, this.position.y + 1));
    }

    return moves;
  }
}
