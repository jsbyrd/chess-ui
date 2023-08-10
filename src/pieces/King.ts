import { Piece } from "./Piece";
import { PieceColor, PieceType, Position, Move } from "../utils";

export class King extends Piece {
  hasMoved: boolean;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    super(x, y, type, color);
    this.hasMoved = false;
  }

  generateMoves(currentBoard: Piece[]) {
    let moves: Move[] = [];
    const xIncrement = [0, 1, 1, 1, 0, -1, -1, -1];
    const yIncrement = [1, 1, 0, -1, -1, -1, 0, 1];

    for (let i = 0; i < xIncrement.length; i++) {
      const newX = this.position.x + xIncrement[i];
      const newY = this.position.y + yIncrement[i];

      if (!Position.isLegalPosition(newX, newY)) {
        continue;
      }

      // Don't allow the King to walk into an attack
      const potentialMove = new Move(this, this.position, new Position(newX, newY), false);
      const simulatedBoardState: Piece[] = Move.simulateMove(currentBoard, potentialMove);
      if (Move.isKingInCheck(simulatedBoardState, this.color)) break;

      // Check to see if there is a piece occupying that particular position
      const potentialPiece: Piece | undefined = currentBoard[newX + (newY * 8)];
      if (potentialPiece) {
        if (!this.isSameColor(potentialPiece)) {
          moves.push(new Move(this, this.position, new Position(newX, newY), false));
        }
        continue;
      }
      // Otherwise, add the position as a valid move
      moves.push(new Move(this, this.position, new Position(newX, newY), false));
    }
    return moves;
  }

  generateAttackMoves(currentBoard: Piece[]) {
    let moves: Move[] = [];
    const xIncrement = [0, 1, 1, 1, 0, -1, -1, -1];
    const yIncrement = [1, 1, 0, -1, -1, -1, 0, 1];

    for (let i = 0; i < xIncrement.length; i++) {
      const newX = this.position.x + xIncrement[i];
      const newY = this.position.y + yIncrement[i];

      if (!Position.isLegalPosition(newX, newY)) {
        continue;
      }

      // Check to see if there is a piece occupying that particular position
      const potentialMove = new Move(this, this.position, new Position(newX, newY), false);
      const potentialPiece: Piece | undefined = currentBoard[newX + (newY * 8)];
      if (potentialPiece) {
        if (!this.isSameColor(potentialPiece)) {
          moves.push(potentialMove);
        }
        continue;
      }
      // Otherwise, add the position as a valid move
      moves.push(new Move(this, this.position, new Position(newX, newY), false));
    }
    return moves;
  }

  deepCopy() {
    return new King(this.position.x, this.position.y, this.type, this.color);
  }
}
