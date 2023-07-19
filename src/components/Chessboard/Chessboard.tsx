import { useState, useRef } from "react";
import Tile from "../Tile/Tile";
import { Piece } from "../../pieces/Piece";
import { PieceType, PieceColor } from "../../utils";
import "./Chessboard.css";
import { Pawn } from "../../pieces/Pawn";
import { Rook } from "../../pieces/Rook";
import { Knight } from "../../pieces/Knight";
import { Bishop } from "../../pieces/Bishop";
import { Queen } from "../../pieces/Queen";
import { King } from "../../pieces/King";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

const initialBoardState: Piece[] = [];
// Pawns
for (let i = 0; i < 8; i++) {
  initialBoardState.push(new Pawn(i, 1, PieceType.PAWN, PieceColor.WHITE));
  initialBoardState.push(new Pawn(i, 6, PieceType.PAWN, PieceColor.BLACK));
}

// Major & Minor Pieces
for (let i = 0; i < 2; i++) {
  const pieceColor = i === 0 ? PieceColor.WHITE : PieceColor.BLACK;
  const ypos = i === 0 ? 0 : 7;

  initialBoardState.push(new Rook(0, ypos, PieceType.ROOK, pieceColor));
  initialBoardState.push(new Rook(7, ypos, PieceType.ROOK, pieceColor));
  initialBoardState.push(new Knight(1, ypos, PieceType.KNIGHT, pieceColor));
  initialBoardState.push(new Knight(6, ypos, PieceType.KNIGHT, pieceColor));
  initialBoardState.push(new Bishop(2, ypos, PieceType.BISHOP, pieceColor));
  initialBoardState.push(new Bishop(5, ypos, PieceType.BISHOP, pieceColor));
  initialBoardState.push(new Queen(3, ypos, PieceType.QUEEN, pieceColor));
  initialBoardState.push(new King(4, ypos, PieceType.KING, pieceColor));
}

const Chessboard = () => {
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  let board = [];

  const chessboardRef = useRef<HTMLDivElement>(null);

  // -~-~- Piece movement logic -~-~-

  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if (element.classList.contains("chess-piece") && chessboard) {
      // Saves original position of grabbed piece
      const gridX = Math.floor((e.clientX - chessboard.offsetLeft) / 70);
      const gridY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 560) / 70)
      );
      setGridX(gridX);
      setGridY(gridY);
      // Centers piece onto mouse when grabbed
      const offset = 36.55;
      const x = e.clientX - offset;
      const y = e.clientY - offset;
      element.style.position = "absolute";
      element.style.top = `${y}px`;
      element.style.left = `${x}px`;

      setActivePiece(element);
    }
  };

  const movePiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      // Gets position of mouse
      const offset = 36.55;
      const x = e.clientX - offset;
      const y = e.clientY - offset;
      // Defines the boundaries of board
      const minX = chessboard.offsetLeft - 20;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 55;

      activePiece.style.position = "absolute";

      // Sets x value of piece, ensures the piece is within board
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }

      // Sets y value of piece, ensures the piece is within board
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  };

  const dropPiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 70);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 560) / 70)
      );
      console.log(x, y);
      setPieces((value) => {
        const pieces = value.map((p) => {
          if (p.x === gridX && p.y === gridY) {
            p.x = x;
            p.y = y;
          }
          return p;
        });
        return pieces;
      });
      setActivePiece(null);
    }
  };
  // -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-

  // Places Tiles with Pieces
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      let image = undefined;

      pieces.forEach((p) => {
        if (p.x === i && p.y === j) {
          image = p.image;
        }
      });
      board.push(<Tile key={`${i}_${j}`} image={image} number={i + j} />);
    }
  }

  return (
    <div
      onMouseDown={(e) => grabPiece(e)}
      onMouseMove={(e) => movePiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      id="chessboard"
      ref={chessboardRef}
    >
      {board}
    </div>
  );
};

export default Chessboard;
