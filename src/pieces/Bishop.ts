import { Piece } from "./Piece";
import { Move, Position } from "../utils";

export class Bishop extends Piece {

  generateMoves(currentBoard: Piece[]) {
    let moves: Move[] = [];
    const xIncrement = [1, 1, -1, -1];
    const yIncrement = [1, -1, 1, -1];

    for (let i = 0; i < xIncrement.length; i++) {
      let newX = this.position.x + xIncrement[i];
      let newY = this.position.y + yIncrement[i];

      while (Position.isLegalPosition(newX, newY)) {
        // Check to see if piece is pinned
        const potentialMove = new Move(this, this.position, new Position(newX, newY), false);
        const simulatedBoardState: Piece[] = Move.simulateMove(currentBoard, potentialMove);
        if (Move.isKingInCheck(simulatedBoardState, this.color)) break;

        const potentialPiece: Piece | undefined = currentBoard[newX + (newY * 8)];
        // Check to see if there is a piece occupying that particular position
        if (potentialPiece) {
          if (!this.isSameColor(potentialPiece)) {
            moves.push(potentialMove);
          }
          break;
        }
        // Otherwise, add the position as a valid move
        if (this.position.isSamePosition(new Position(newX, newY))) {
          console.log("same position... weird");
        }

        moves.push(new Move(this, this.position, new Position(newX, newY), false));
        newX += xIncrement[i];
        newY += yIncrement[i];
      }
    }

    return moves;
  }

  generateAttackMoves(currentBoard: Piece[]) {
    let moves: Move[] = [];
    const xIncrement = [1, 1, -1, -1];
    const yIncrement = [1, -1, 1, -1];

    for (let i = 0; i < xIncrement.length; i++) {
      let newX = this.position.x + xIncrement[i];
      let newY = this.position.y + yIncrement[i];

      while (Position.isLegalPosition(newX, newY)) {
        const potentialMove = new Move(this, this.position, new Position(newX, newY), false);
        const potentialPiece: Piece | undefined = currentBoard[newX + (newY * 8)];
        // Check to see if there is a piece occupying that particular position
        if (potentialPiece) {
          if (!this.isSameColor(potentialPiece)) {
            moves.push(potentialMove);
          }
          break;
        }
        // Otherwise, add the position as a valid move
        moves.push(new Move(this, this.position, new Position(newX, newY), false));
        newX += xIncrement[i];
        newY += yIncrement[i];
      }
    }
    return moves;
  }

  deepCopy() {
    return new Bishop(this.position.x, this.position.y, this.type, this.color);
  }
}
