import { useState } from "react";
import Chessboard from "../Chessboard/Chessboard";
import Options from "../Options/Options"
import { Piece } from "../../pieces/Piece";
import { PieceColor, PieceType, Move } from "../../utils";
import "./Game.css";

const Game = () => {
  const [gamemode, setGamemode] = useState("freestyle");
  const [isActiveGame, setIsActiveGame] = useState(false);
  const [activeColor, setActiveColor] = useState(PieceColor.WHITE);
  const [userColor, setUserColor] = useState(PieceColor.WHITE);
  const [turn, setTurn] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(new Array(64));
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  }

  const handleGamemodeChange = (mode: string) => {
    setGamemode(mode);
  }

  const handleActiveColorChange = (color: PieceColor) => {
    setActiveColor(color)
  }

  const handleUserColorChange = (color: PieceColor) => {
    setUserColor(color);
  }

  const handlePiecesChange = (pieceArray: Piece[]) => {
    setPieces(pieceArray)
  }

  const findAllLegalMoves = (color: PieceColor) => {
    let allLegalMoves: Move[] = [];
    pieces.forEach((piece) => {
      if (piece && piece.color === color) {
        const moves = piece.generateMoves(pieces);
        moves.forEach((move) => {
          allLegalMoves.push(move);
        });
      }
    });
    return allLegalMoves;
  }

  const playGame = () => {
    setIsActiveGame(true);
    setActiveColor(PieceColor.WHITE);
    setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    return;
  }

  // Random chess AI
  const playOpponentMove = () => {
    if (isActiveGame && activeColor !== userColor) {
      if (gamemode === "freestyle") return;
      if (gamemode === "random") {
        // Select a random legal move
      const moves: Move[] = findAllLegalMoves(activeColor);
      if (moves.length === 0) {
        setIsActiveGame(false);
        return;
      }
      const index = getRandomInt(moves.length);
      const move = moves[index];
  
      // Piece Movement Logic
      const piecesClone = new Array(64);
      for (let i = 0; i < pieces.length; i++) {
        piecesClone[i] = pieces[i];
      }
  
      // Move piece to new location
      const oldX = move.piece.position.x;
      const oldY = move.piece.position.y;
      piecesClone[move.position.x + move.position.y * 8] = move.piece;
      piecesClone[move.position.x + move.position.y * 8].position.x = move.position.x;
      piecesClone[move.position.x + move.position.y * 8].position.y = move.position.y;
  
      // Handle hasMoved for certain pieces
      const pieceType: PieceType = move.piece.type;
      if (pieceType === PieceType.PAWN || pieceType === PieceType.KING || pieceType === PieceType.ROOK) {
        piecesClone[move.position.x + move.position.y * 8].hasMoved = true;
      }
      // Delete piece from old location
      piecesClone[oldX + oldY * 8] = undefined;
  
  
      // Change Turns
      setActiveColor(userColor);
      setPieces(piecesClone);
      }
      // TODO: ADD LATER
      if (gamemode === "custom") return;
    }
  }

  playOpponentMove();

  return (
    <div className="game-container">
      <Chessboard 
        fen={fen}
        userColor={userColor}
        activeColor={activeColor}
        pieces={pieces}
        handleActiveColorChange={handleActiveColorChange}
        handlePiecesChange={handlePiecesChange} />
      {!isActiveGame && <Options handleGamemodeChange={handleGamemodeChange} handleUserColorChange={handleUserColorChange} playGame={playGame}/>}
    </div>
  )
}

export default Game;