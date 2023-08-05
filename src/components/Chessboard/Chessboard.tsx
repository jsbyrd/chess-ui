import { useState, useRef, useEffect } from "react";
import Tile from "../Tile/Tile";
import { Piece } from "../../pieces/Piece";
import { PieceType, PieceColor, Position, Move } from "../../utils";
import "./Chessboard.css";
import { Pawn } from "../../pieces/Pawn";
import { Rook } from "../../pieces/Rook";
import { Knight } from "../../pieces/Knight";
import { Bishop } from "../../pieces/Bishop";
import { Queen } from "../../pieces/Queen";
import { King } from "../../pieces/King";

interface Props {
  userColor: PieceColor;
  pieces: Piece[];
  handleActiveColorChange: (color: PieceColor) => void;
  handlePiecesChange: (pieceArray: Piece[]) => void;
}

const Chessboard = ({ userColor, pieces, handleActiveColorChange, handlePiecesChange }: Props) => {
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);

  const chessboardRef = useRef<HTMLDivElement>(null);

  const isDigit = (character: string) => {
    if (character.length === 1) {
        const code: number | undefined = character.codePointAt(0);
        if (code) {
          return 47 < code && code < 58;
        }
    }
    return false;
  };

  // Assumes accurate notation and valid position
  const loadPositionFromFen = () => {
    let x = 0;
    let y = 0;
    let divider = 0;
    const piecesClone: Piece[] = new Array(64);

    // Piece Placement
    for (let i = 0; i < fen.length; i++) {
      const char = fen[i];
      if (char === " ") {
        divider = i;
        break;
      }
      if (char === "/") {
        x = 0;
        y++;
        continue;
      }
      if (isDigit(char)) {
        const digit = parseInt(char);
        x += digit;
      } else {
        const pieceColor = (char === char.toUpperCase()) ? PieceColor.WHITE : PieceColor.BLACK;
        const lowercaseChar = char.toLowerCase();
        switch (lowercaseChar) {
          case "p":
            piecesClone[x + y * 8] = new Pawn(x, y, PieceType.PAWN, pieceColor)
            break;
          case "k":
            piecesClone[x + y * 8] = new King(x, y, PieceType.KING, pieceColor)
            break;
          case "r":
            piecesClone[x + y * 8] = new Rook(x, y, PieceType.ROOK, pieceColor)
            break;
          case "b":
            piecesClone[x + y * 8] = new Bishop(x, y, PieceType.BISHOP, pieceColor)
            break;
          case "n":
            piecesClone[x + y * 8] = new Knight(x, y, PieceType.KNIGHT, pieceColor)
            break;
          case "q":
            piecesClone[x + y * 8] = new Queen(x, y, PieceType.QUEEN, pieceColor)
            break;
          default:
            break;
        }
        x++;
      }
    }
    handlePiecesChange(piecesClone);
    // Game Info (whose turn, castling rights, etc.)
    for (let i = divider; i < fen.length; i++) {
      
    }
  }

  useEffect(() => {
    loadPositionFromFen();
  }, [fen]);

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
      const potentialMoves: Move[] = piece.generateMoves(pieces);
      const potentialHints: NodeListOf<HTMLDivElement> = document.querySelectorAll(".potential-hint");
      potentialMoves.forEach((move) => {
        const x: number = move.position.x;
        const y: number = move.position.y;
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
      const allLegalMoves: Move[] = piece.generateMoves(pieces);
      let isLegalMove: boolean = false;

      allLegalMoves.forEach((move) => {
        if (move.position.isSamePosition(potentialPosition)) {
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
  
        handlePiecesChange(piecesClone);
        const opponentColor = userColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
        handleActiveColorChange(opponentColor);
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
