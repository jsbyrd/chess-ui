import { PieceType, PieceColor, Position, Move } from "../utils";

export abstract class Piece {
  image: string;
  position: Position;
  type: PieceType;
  color: PieceColor;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    this.position = new Position(x, y);
    this.type = type;
    this.color = color;
    this.image = `assets/images/${type}_${color}.png`;
  }

  displayPieceInfo(): void {
    console.log(
      `Position: (${this.position.x}, ${this.position.y}), PieceType: ${this.type}, PieceColor: ${this.color}`
    );
  }

  isSameColor(otherPiece: Piece): boolean {
    return this.color === otherPiece.color;
  }

  abstract generateMoves(currentBoard: Piece[]): Move[];
  abstract generateAttackMoves(currentBoard: Piece[]): Move[];
  abstract deepCopy(): Piece;
}
