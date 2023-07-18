import { useState, useRef } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece {
  image: string;
  x: number;
  y: number;
}

const initialBoardState: Piece[] = [];
// Pawns
for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: "assets/images/pawn_w.png", x: i, y: 1 });
  initialBoardState.push({ image: "assets/images/pawn_b.png", x: i, y: 6 });
}

// Major & Minor Pieces
for (let i = 0; i < 2; i++) {
  const color = i === 0 ? "w" : "b";
  const ypos = i === 0 ? 0 : 7;

  initialBoardState.push({
    image: `assets/images/rook_${color}.png`,
    x: 0,
    y: ypos,
  });
  initialBoardState.push({
    image: `assets/images/rook_${color}.png`,
    x: 7,
    y: ypos,
  });
  initialBoardState.push({
    image: `assets/images/knight_${color}.png`,
    x: 1,
    y: ypos,
  });
  initialBoardState.push({
    image: `assets/images/knight_${color}.png`,
    x: 6,
    y: ypos,
  });
  initialBoardState.push({
    image: `assets/images/bishop_${color}.png`,
    x: 2,
    y: ypos,
  });
  initialBoardState.push({
    image: `assets/images/bishop_${color}.png`,
    x: 5,
    y: ypos,
  });
  initialBoardState.push({
    image: `assets/images/queen_${color}.png`,
    x: 3,
    y: ypos,
  });
  initialBoardState.push({
    image: `assets/images/king_${color}.png`,
    x: 4,
    y: ypos,
  });
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
