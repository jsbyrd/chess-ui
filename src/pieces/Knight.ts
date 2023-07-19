import { Piece } from "./Piece";
import { PieceColor, PieceType } from "../utils";

export class Knight implements Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  color: PieceColor;

  constructor(x: number, y: number, type: PieceType, color: PieceColor) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.image = `assets/images/${type}_${color}.png`;
  }
}
