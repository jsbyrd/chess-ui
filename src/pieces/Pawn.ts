import { Piece } from "./Piece";
import { PieceColor, PieceType, Position, Move } from "../utils";

export class Pawn extends Piece {
  hasMoved: boolean;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    super(x, y, type, color);
    this.hasMoved = false;
  }

  generateMoves(currentBoard: Piece[]) {
    let moves: Move[] = [];
    const moveIncrement: number = this.color === PieceColor.WHITE ? -1 : 1;

    if (this.position.y > 0 && this.position.y < 7) {
      // Move forward so long as no piece is in front of it
      if (currentBoard[(this.position.x) + ((this.position.y + moveIncrement) * 8)] === undefined) {
        moves.push(new Move(this, new Position(this.position.x, this.position.y + moveIncrement), false));
      }
      // A pawn can move 2 spaces forward on its first move
      if (!this.hasMoved) {
        moves.push(new Move(this, new Position(this.position.x, this.position.y + (moveIncrement * 2)), false));
      }
      // Check for captures (left column from white's perspective)
      if (this.position.x > 0 && this.position.x < 8) {
        const potentialVictim: Piece | null = currentBoard[(this.position.x - 1) + (this.position.y + moveIncrement) * 8];
        if (potentialVictim && !this.isSameColor(potentialVictim)) {
          moves.push(new Move(this, potentialVictim.position, false));
        }
      }
      // Check for captures (right column from white's perspective)
      if (this.position.x < 7 && this.position.x >= 0) {
        const potentialVictim: Piece | null = currentBoard[(this.position.x + 1) + (this.position.y + moveIncrement) * 8];
        if (potentialVictim && !this.isSameColor(potentialVictim)) {
          moves.push(new Move(this, potentialVictim.position, false));
        }
      }
    }

    return moves;
  }
}
