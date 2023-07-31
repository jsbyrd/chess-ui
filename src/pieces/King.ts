import { Piece } from "./Piece";
import { PieceColor, PieceType, Position } from "../utils";

export class King extends Piece {
  hasMoved: boolean;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    super(x, y, type, color);
    this.hasMoved = false;
  }

  generateMoves(currentBoard: Piece[]) {
    let moves: Position[] = [];
    const xIncrement = [0, 1, 1, 1, 0, -1, -1, -1];
    const yIncrement = [1, 1, 0, -1, -1, -1, 0, 1];

    for (let i = 0; i < xIncrement.length; i++) {
      const newX = this.position.x + xIncrement[i];
      const newY = this.position.y + yIncrement[i];

      if (!Position.isLegalPosition(newX, newY)) {
        continue;
      }

      const potentialPiece: Piece | undefined = currentBoard[newX + (newY * 8)];
      // Check to see if there is a piece occupying that particular position
      if (potentialPiece) {
        if (!this.isSameColor(potentialPiece)) {
          moves.push(new Position(newX, newY));
        }
        continue;
      }
      // Otherwise, add the position as a valid move
      moves.push(new Position(newX, newY));
    }
    return moves;
  }
}
