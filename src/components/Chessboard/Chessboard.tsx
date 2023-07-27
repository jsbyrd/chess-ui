import { useState, useRef, useEffect } from "react";
import Tile from "../Tile/Tile";
import { Piece } from "../../pieces/Piece";
import { PieceType, PieceColor, Position } from "../../utils";
import "./Chessboard.css";
import { Pawn } from "../../pieces/Pawn";
import { Rook } from "../../pieces/Rook";
import { Knight } from "../../pieces/Knight";
import { Bishop } from "../../pieces/Bishop";
import { Queen } from "../../pieces/Queen";
import { King } from "../../pieces/King";

// const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
// const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

const initialBoardState: Piece[] = new Array(64);
// Pawns
for (let i = 0; i < 8; i++) {
  initialBoardState[i + 48] = new Pawn(i, 6, PieceType.PAWN, PieceColor.WHITE);
  initialBoardState[i + 8] = new Pawn(i, 1, PieceType.PAWN, PieceColor.BLACK);
}

// Major & Minor Pieces
for (let i = 0; i < 2; i++) {
  const pieceColor = i === 0 ? PieceColor.WHITE : PieceColor.BLACK;
  const ypos = i === 0 ? 7 : 0;

  // Rooks
  initialBoardState[ypos * 8] = new Rook(0, ypos, PieceType.ROOK, pieceColor);
  initialBoardState[7 + ypos * 8] = new Rook(7, ypos, PieceType.ROOK, pieceColor);
  // Knights
  initialBoardState[1 + ypos * 8] = new Knight(1, ypos, PieceType.KNIGHT, pieceColor);
  initialBoardState[6 + ypos * 8] = new Knight(6,ypos,PieceType.KNIGHT,pieceColor);
  // Bishops
  initialBoardState[2 + ypos * 8] = new Bishop(2,ypos,PieceType.BISHOP,pieceColor);
  initialBoardState[5 + ypos * 8] = new Bishop(5,ypos,PieceType.BISHOP,pieceColor);
  // Queen
  initialBoardState[3 + ypos * 8] = new Queen(3,ypos,PieceType.QUEEN,pieceColor);
  // King
  initialBoardState[4 + ypos * 8] = new King(4,ypos,PieceType.KING,pieceColor);
}

const Chessboard = () => {
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);

  const chessboardRef = useRef<HTMLDivElement>(null);

  // -~-~- Piece movement logic -~-~-
  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if (element.classList.contains("chess-piece") && chessboard) {
      // Saves original position of grabbed piece
      const gridX = Math.floor((e.clientX - chessboard.offsetLeft) / 70);
      const gridY = Math.floor((e.clientY - chessboard.offsetTop) / 70);
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

      // Find the piece object that corresponds to grabbed HTMLElement
      const piece = pieces.find(
        (p) => p && p.position.x === gridX && p.position.y === gridY
      );
      if (piece) {
        piece.displayPieceInfo();
      }
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
    const chessboard: HTMLDivElement | null = chessboardRef.current;
    if (activePiece && chessboard) {
      const x: number = Math.floor((e.clientX - chessboard.offsetLeft) / 70);
      const y: number = Math.floor((e.clientY - chessboard.offsetTop) / 70);
      const piece: Piece = pieces[gridX + gridY * 8];
      const potentialPosition: Position = new Position(x, y);
      const allLegalMoves: Position[] = piece.generateMoves(pieces);
      let isLegalMove: boolean = false;

      allLegalMoves.forEach((position) => {
        if (position.isSamePosition(potentialPosition)) {
          isLegalMove = true;
        }
      });

      if (isLegalMove) {
        console.log("Yay, this is a legal move!");
        const piecesClone = new Array(64);
  
        for (let i = 0; i < pieces.length; i++) {
          piecesClone[i] = pieces[i];
        }
  
        // Move piece to new location
        piecesClone[x + y * 8] = pieces[gridX + gridY * 8];
        // Delete piece from old location
        piecesClone[gridX + gridY * 8] = null;
  
        setPieces(piecesClone);
      } else {
        activePiece.style.position = "relative";
        activePiece.style.removeProperty("top");
        activePiece.style.removeProperty("left");
      }

      setActivePiece(null);
    }
  };
  // -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-

  // Board is the array of Tile components that will be rendered onto the screen
  const board: JSX.Element[] = new Array(64);

  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    const image = p ? p.image : undefined;
    const x = i % 8;
    const y = Math.floor(i / 8);
    board[i] = <Tile key={`${i}`} image={image} number={x + y} />;
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
