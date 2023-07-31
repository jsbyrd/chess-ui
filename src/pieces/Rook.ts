import { Piece } from "./Piece";
import { PieceColor, PieceType, Position } from "../utils";

export class Rook extends Piece {
  hasMoved: boolean;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    super(x, y, type, color);
    this.hasMoved = false;
  }

  generateMoves(currentBoard: Piece[]) {
    let moves: Position[] = [];
    const xIncrement = [1, -1, 0, 0];
    const yIncrement = [0, 0, 1, -1];

    for (let i = 0; i < xIncrement.length; i++) {
      let newX = this.position.x + xIncrement[i];
      let newY = this.position.y + yIncrement[i];

      while (Position.isLegalPosition(newX, newY)) {
        const potentialPiece: Piece | undefined = currentBoard[newX + (newY * 8)];
        // Check to see if there is a piece occupying that particular position
        if (potentialPiece) {
          if (!this.isSameColor(potentialPiece)) {
            moves.push(new Position(newX, newY));
          }
          break;
        }
        // Otherwise, add the position as a valid move
        moves.push(new Position(newX, newY));
        newX += xIncrement[i];
        newY += yIncrement[i];
      }
    }
    return moves;
  }
}
