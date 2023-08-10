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
        // Check to see if Pawn is pinned to King
        const potentialMove = new Move(this, this.position, new Position(this.position.x, this.position.y + moveIncrement), false);
        const simulatedBoardState: Piece[] = Move.simulateMove(currentBoard, potentialMove);
        if (!Move.isKingInCheck(simulatedBoardState, this.color)) {
          moves.push(potentialMove);
        }
      }
      // A pawn can move 2 spaces forward on its first move
      if (!this.hasMoved) {
        // Check to see if Pawn is pinned to King
        const potentialMove = new Move(this, this.position, new Position(this.position.x, this.position.y + (moveIncrement * 2)), false);
        const simulatedBoardState: Piece[] = Move.simulateMove(currentBoard, potentialMove);
        if (!Move.isKingInCheck(simulatedBoardState, this.color)) {
          moves.push(potentialMove);
        }
      }
      // Check for captures (left column from white's perspective)
      if (this.position.x > 0 && this.position.x < 8) {
        const potentialVictim: Piece | null = currentBoard[(this.position.x - 1) + (this.position.y + moveIncrement) * 8];
        if (potentialVictim && !this.isSameColor(potentialVictim)) {
          // Check to see if Pawn is pinned to King
          const potentialMove = new Move(this, this.position, potentialVictim.position, false);
          const simulatedBoardState: Piece[] = Move.simulateMove(currentBoard, potentialMove);
          if (!Move.isKingInCheck(simulatedBoardState, this.color)) {
            moves.push(potentialMove);
          }
        }
      }
      // Check for captures (right column from white's perspective)
      if (this.position.x < 7 && this.position.x >= 0) {
        const potentialVictim: Piece | null = currentBoard[(this.position.x + 1) + (this.position.y + moveIncrement) * 8];
        if (potentialVictim && !this.isSameColor(potentialVictim)) {
          // Check to see if Pawn is pinned to King
          const potentialMove = new Move(this, this.position, potentialVictim.position, false);
          const simulatedBoardState: Piece[] = Move.simulateMove(currentBoard, potentialMove);
          if (!Move.isKingInCheck(simulatedBoardState, this.color)) {
            moves.push(potentialMove);
          }
        }
      }
    }
    return moves;
  }

  generateAttackMoves(currentBoard: Piece[]) {
    let attackMoves: Move[] = [];
    const moveIncrement: number = this.color === PieceColor.WHITE ? -1 : 1;

    if (this.position.y > 0 && this.position.y < 7) {
      // Check for captures (left column from white's perspective)
      if (this.position.x > 0 && this.position.x < 8) {
        const potentialVictim: Piece | null = currentBoard[(this.position.x - 1) + (this.position.y + moveIncrement) * 8];
        if (potentialVictim && !this.isSameColor(potentialVictim)) {
          attackMoves.push(new Move(this, this.position, potentialVictim.position, false));
        }
      }
      // Check for captures (right column from white's perspective)
      if (this.position.x < 7 && this.position.x >= 0) {
        const potentialVictim: Piece | null = currentBoard[(this.position.x + 1) + (this.position.y + moveIncrement) * 8];
        if (potentialVictim && !this.isSameColor(potentialVictim)) {
          attackMoves.push(new Move(this, this.position, potentialVictim.position, false));
        }
      }
    }
    return attackMoves;
  }

  deepCopy() {
    return new Pawn(this.position.x, this.position.y, this.type, this.color);
  }
}
