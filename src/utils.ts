export enum PieceType {
  PAWN = "pawn",
  KNIGHT = "knight",
  BISHOP = "bishop",
  ROOK = "rook",
  QUEEN = "queen",
  KING = "king",
}

export enum PieceColor {
  WHITE = "w",
  BLACK = "b",
}

export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isSamePosition(otherPosition: Position): boolean {
    return otherPosition.x === this.x && otherPosition.y === this.y;
  }

  static isLegalPosition(x: number, y: number): boolean {
    return (x >= 0 && x < 8 && y >= 0 && y < 8);
  }
}
