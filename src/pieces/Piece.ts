import { PieceType, PieceColor } from "../utils";

export interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  color: PieceColor;
}
