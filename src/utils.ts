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

export class PositionHashSet {
  private positions: boolean[];

  constructor() {
    this.positions = new Array(64);
  }

  add(position: Position) {
    const x = position.x;
    const y = position.y;
    this.positions[x + y * 8] = true;
  }

  contains(position: Position) {
    const x = position.x;
    const y = position.y;
    return this.positions[x + y * 8];
  }

  delete(position: Position) {
    const x = position.x;
    const y = position.y;
    this.positions[x + y * 8] = false;
  }

}
