import { Piece } from "./Piece";
import { Position, Move } from "../utils";

export class Knight extends Piece {
  generateMoves(currentBoard: Piece[]) {
    let moves: Move[] = [];
    const xIncrement = [1, 2, 2, 1, -1, -2, -2, -1];
    const yIncrement = [2, 1, -1, -2, -2, -1, 1, 2];

    for (let i = 0; i < xIncrement.length; i++) {
      const newX = this.position.x + xIncrement[i];
      const newY = this.position.y + yIncrement[i];

      if (!Position.isLegalPosition(newX, newY)) {
        continue;
      }

      // Check to see if Knight is pinned to king
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
    const xIncrement = [1, 2, 2, 1, -1, -2, -2, -1];
    const yIncrement = [2, 1, -1, -2, -2, -1, 1, 2];

    for (let i = 0; i < xIncrement.length; i++) {
      const newX = this.position.x + xIncrement[i];
      const newY = this.position.y + yIncrement[i];

      if (!Position.isLegalPosition(newX, newY)) {
        continue;
      }

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

  deepCopy() {
    return new Knight(this.position.x, this.position.y, this.type, this.color);
  }
}