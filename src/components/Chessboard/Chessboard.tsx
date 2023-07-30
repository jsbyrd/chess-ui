import { useState, useRef } from "react";
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
      const piece: Piece = pieces[gridX + gridY * 8];
      piece.displayPieceInfo();
      // Display all possible moves in the form of a hint icon
      const potentialMoves: Position[] = piece.generateMoves(pieces);
      potentialMoves.forEach((position) => {
        console.log(position);
      })
      const potentialHints: NodeListOf<HTMLDivElement> = document.querySelectorAll(".potential-hint");
      potentialMoves.forEach((position) => {
        const x: number = position.x;
        const y: number = position.y;
        const targetIndex: number = x + (y * 8);
        potentialHints[targetIndex].classList.add("hint");
        // Show hint for non-capture move
        if (pieces[targetIndex] === undefined) {
          potentialHints[targetIndex].classList.add("small-hint");
        }
        // Show hint for capture move
        else {
          potentialHints[targetIndex].classList.add("big-hint");
        }
      });
    }
  };

  const movePiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      // Get position of mouse
      const offset = 36.55;
      const x = e.clientX - offset;
      const y = e.clientY - offset;
      // Set position of piece to be the same as mouse (makes it look like the mouse is grabbing and dragging the piece) 
      activePiece.style.position = "absolute";
      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;
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

      // Remove all hint icons
      const potentialHints: NodeListOf<HTMLDivElement> = document.querySelectorAll(".potential-hint");
      potentialHints.forEach((hint) => {
        hint.classList.remove("hint");
        hint.classList.remove("small-hint");
        hint.classList.remove("big-hint");
      });


      // Make the move so long as its legal
      if (isLegalMove) {
        const piecesClone = new Array(64);
  
        for (let i = 0; i < pieces.length; i++) {
          piecesClone[i] = pieces[i];
        }
  
        // Move piece to new location
        piecesClone[x + y * 8] = pieces[gridX + gridY * 8];
        piecesClone[x + y * 8].position.x = x;
        piecesClone[x + y * 8].position.y = y;
        const pieceType: PieceType = piece.type;
        if (pieceType === PieceType.PAWN || pieceType === PieceType.KING || pieceType === PieceType.ROOK) {
          piecesClone[x + y * 8].hasMoved = true;
        }
        // Delete piece from old location
        piecesClone[gridX + gridY * 8] = undefined;
  
        setPieces(piecesClone);
      }
      // If an illegal move, move the piece back to its original position
      else {
        activePiece.style.position = "relative";
        activePiece.style.removeProperty("top");
        activePiece.style.removeProperty("left");
        activePiece.style.removeProperty("position");
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
