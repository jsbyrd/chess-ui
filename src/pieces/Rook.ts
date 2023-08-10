import { Piece } from "./Piece";
import { PieceColor, PieceType, Position, Move } from "../utils";

export class Rook extends Piece {
  hasMoved: boolean;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    super(x, y, type, color);
    this.hasMoved = false;
  }

  generateMoves(currentBoard: Piece[]) {
    let moves: Move[] = [];
    const xIncrement = [1, -1, 0, 0];
    const yIncrement = [0, 0, 1, -1];

    for (let i = 0; i < xIncrement.length; i++) {
      let newX = this.position.x + xIncrement[i];
      let newY = this.position.y + yIncrement[i];

      while (Position.isLegalPosition(newX, newY)) {
        // Check to see if Rook is pinned to King
        const potentialMove = new Move(this, this.position, new Position(newX, newY), false);
        const simulatedBoardState: Piece[] = Move.simulateMove(currentBoard, potentialMove);
        if (Move.isKingInCheck(simulatedBoardState, this.color)) break;

        // Check to see if there is a piece occupying that particular position
        const potentialPiece: Piece | undefined = currentBoard[newX + (newY * 8)];
        if (potentialPiece) {
          if (!this.isSameColor(potentialPiece)) {
            moves.push(new Move(this, this.position, new Position(newX, newY), false));
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

  generateAttackMoves(currentBoard: Piece[]) {
    let moves: Move[] = [];
    const xIncrement = [1, -1, 0, 0];
    const yIncrement = [0, 0, 1, -1];

    for (let i = 0; i < xIncrement.length; i++) {
      let newX = this.position.x + xIncrement[i];
      let newY = this.position.y + yIncrement[i];

      while (Position.isLegalPosition(newX, newY)) {
        // Check to see if there is a piece occupying that particular position
        const potentialPiece: Piece | undefined = currentBoard[newX + (newY * 8)];
        if (potentialPiece) {
          if (!this.isSameColor(potentialPiece)) {
            moves.push(new Move(this, this.position, new Position(newX, newY), false));
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
    return new Rook(this.position.x, this.position.y, this.type, this.color);
  }
}
