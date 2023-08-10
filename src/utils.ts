import { Piece } from "./pieces/Piece";

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

export class Move {
  piece: Piece;
  oldPosition: Position;
  newPosition: Position;
  isCastleMove: boolean;

  constructor(piece: Piece, oldPosition: Position, newPosition: Position, isCastleMove: boolean) {
    this.piece = piece;
    this.oldPosition = oldPosition;
    this.newPosition = newPosition;
    this.isCastleMove = isCastleMove;
  }

  static findAllAttackMoves(pieces: Piece[], currentColor: PieceColor): Move[]  {
    let allAttackMoves: Move[] = [];
    pieces.forEach((piece) => {
      if (piece && piece.color === currentColor) {
        const moves = piece.generateAttackMoves(pieces);
        moves.forEach((move) => {
          allAttackMoves.push(move);
        });
      }
    });
    return allAttackMoves;
  }
  
  // Returns the piece array that would occur if a particular move is made
  static simulateMove(pieces: Piece[], move: Move): Piece[] {
    const piecesClone = new Array(64);
  
    for (let i = 0; i < pieces.length; i++) {
      piecesClone[i] = (pieces[i]) ? pieces[i].deepCopy() : undefined;
    }

    const oldX = move.oldPosition.x;
    const oldY = move.oldPosition.y;
    const newX = move.newPosition.x;
    const newY = move.newPosition.y;

    const pieceCopy = piecesClone[oldX + oldY * 8];

    // Move piece to new location
    piecesClone[newX + newY * 8] = pieceCopy;
    piecesClone[newX + newY * 8].position = new Position(newX, newY);
    const pieceType: PieceType = move.piece.type;
    if (pieceType === PieceType.PAWN || pieceType === PieceType.KING || pieceType === PieceType.ROOK) {
      piecesClone[newX + newY * 8].hasMoved = true;
    }
    // Delete piece from old location
    piecesClone[oldX + oldY * 8] = undefined;
    
    return piecesClone;
  }

  static isKingInCheck (pieces: Piece[], currentColor: PieceColor): boolean {
    // Find all attacking moves of the opponent
    const opponentColor = (currentColor === PieceColor.WHITE) ? PieceColor.BLACK : PieceColor.WHITE;
    const allOpponentAttackMoves = Move.findAllAttackMoves(pieces, opponentColor);
    let isKingAttacked = false;

    if (!allOpponentAttackMoves || !pieces) {
      console.log("uh oh");
      return false;
    }
    
    // Find current player's king
    let currentKing: Piece | undefined = undefined;
    pieces.forEach((piece) => {
      if (piece && piece.type === PieceType.KING && piece.color === currentColor) {
        currentKing = piece;
      }
    });

    // Can't find currentColor's king
    if (!currentKing) {
      console.log("Couldn't find the king");
      return false;
    }

    // Check to see if the king's current position corresponds to a possible attacking move's position
    allOpponentAttackMoves.forEach((move) => {
      if (currentKing && currentKing.position.isSamePosition(move.newPosition)) {
        isKingAttacked = true;
      }
    });
    
    return isKingAttacked;
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
