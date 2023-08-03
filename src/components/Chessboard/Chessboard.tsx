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

interface Props {
  userColor: PieceColor;
}

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

const Chessboard = ({ userColor }: Props) => {
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);

  const chessboardRef = useRef<HTMLDivElement>(null);

  const getCorrectCoordinate = (coordinate: number)  => {
    return userColor === PieceColor.WHITE ? coordinate : 7 - coordinate;
  }

  // -~-~- Piece movement logic -~-~-
  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if (element.classList.contains("chess-piece") && chessboard) {
      // Saves original position of grabbed piece
      const gridX = Math.floor((e.clientX - chessboard.offsetLeft) / 70);
      const gridY = Math.floor((e.clientY - chessboard.offsetTop) / 70);
      const newGridY = getCorrectCoordinate(gridY);
      setGridX(gridX);
      setGridY(newGridY);
      // Centers piece onto mouse when grabbed
      const offset = 36.55;
      const x = e.clientX - offset;
      const y = e.clientY - offset;
      element.style.position = "absolute";
      element.style.top = `${y}px`;
      element.style.left = `${x}px`;

      setActivePiece(element);

      // Find the piece object that corresponds to grabbed HTMLElement
      const piece: Piece = pieces[gridX + newGridY * 8];
      // Display all possible moves in the form of a hint icon
      const potentialMoves: Position[] = piece.generateMoves(pieces);
      const potentialHints: NodeListOf<HTMLDivElement> = document.querySelectorAll(".potential-hint");
      potentialMoves.forEach((position) => {
        const x: number = position.x;
        const y: number = position.y;
        const correctY: number = getCorrectCoordinate(y);
        // Note: Remember, when playing as the black pieces, the pieces array and the boardUI array are essentially
        // reflections of each other. Seeing as potentialHints is based on the boardUI and NOT the pieces array, two
        // separate indices are required for accessing both arrays because they are not in sync.
        const targetIndexForPieces: number = x + (y * 8);
        const targetIndexForHints: number = x + (correctY * 8);
        potentialHints[targetIndexForHints].classList.add("hint");
        // Show hint for non-capture move
        if (pieces[targetIndexForPieces] === undefined) {
          potentialHints[targetIndexForHints].classList.add("small-hint");
        }
        // Show hint for capture move
        else {
          potentialHints[targetIndexForHints].classList.add("big-hint");
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
      const correctY: number = getCorrectCoordinate(y);
      const piece: Piece = pieces[gridX + gridY * 8];
      const potentialPosition: Position = new Position(x, correctY);
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
        piecesClone[x + correctY * 8] = pieces[gridX + gridY * 8];
        piecesClone[x + correctY * 8].position.x = x;
        piecesClone[x + correctY * 8].position.y = correctY;
        const pieceType: PieceType = piece.type;
        if (pieceType === PieceType.PAWN || pieceType === PieceType.KING || pieceType === PieceType.ROOK) {
          piecesClone[x + correctY * 8].hasMoved = true;
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

  // Renders the board
  const boardUI: JSX.Element[] = new Array(64);
  // Start from top right, render your way through by going right and down (like reading a book)
  if (userColor === PieceColor.WHITE) {
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      const image = p ? p.image : undefined;
      const x = i % 8;
      const y = Math.floor(i / 8);
      boardUI[i] = <Tile key={`${i}`} image={image} number={x + y} index={i} />;
    }
  }
  // Start from bottom right, render your way through by going right and up (honestly this is really ugly)
  if (userColor === PieceColor.BLACK) {
    for (let y = 7; y >= 0; y--) {
      for (let x = 0; x < 8; x++) {
        const p = pieces[y * 8 + x];
        const image = p ? p.image : undefined;
        boardUI[(7 - y) * 8 + x] = <Tile key={`${(7 - y) * 8 + x}`} image={image} number={x + y + 1} index={y * 8 + x} />;
      }
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
      {boardUI}
    </div>
  );
};

export default Chessboard;
