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
    setActiveColor(color);
  }

  const handleUserColorChange = (color: PieceColor) => {
    setUserColor(color);
  }

  const handlePiecesChange = (pieceArray: Piece[]) => {
    setPieces(pieceArray);
  }

  const findAllLegalMoves = (pieces: Piece[], currentColor: PieceColor) => {
    let allLegalMoves: Move[] = [];
    pieces.forEach((piece) => {
      if (piece && piece.color === currentColor) {
        const moves = piece.generateMoves(pieces);
        moves.forEach((move) => {
          allLegalMoves.push(move);
        });
      }
    });
    return allLegalMoves;
  }

  const startGame = () => {
    setIsActiveGame(true);
    setActiveColor(PieceColor.WHITE);
    setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    return;
  }

  const playUserMove = (move: Move) => {
    const piecesClone = new Array(64);
      for (let i = 0; i < pieces.length; i++) {
        piecesClone[i] = pieces[i];
      }

      const oldX = move.oldPosition.x;
      const oldY = move.oldPosition.y;
      const newX = move.newPosition.x;
      const newY = move.newPosition.y;

      // Move piece to new location
      piecesClone[newX + newY * 8] = move.piece;
      piecesClone[newX + newY * 8].position.x = newX;
      piecesClone[newX + newY * 8].position.y = newY;
      const pieceType: PieceType = move.piece.type;
      if (pieceType === PieceType.PAWN || pieceType === PieceType.KING || pieceType === PieceType.ROOK) {
        piecesClone[newX + newY * 8].hasMoved = true;
      }
      // Delete piece from old location
      piecesClone[oldX + oldY * 8] = undefined;

      handlePiecesChange(piecesClone);
      const opponentColor = userColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
      handleActiveColorChange(opponentColor);
  }

  const playOpponentMove = () => {
    const piecesClone = new Array(64);
    if (isActiveGame && activeColor !== userColor) {
      if (gamemode === "freestyle") return;
      if (gamemode === "random") {
        // Select a random legal move
      const moves: Move[] = findAllLegalMoves(pieces, activeColor);
      if (moves.length === 0) {
        setIsActiveGame(false);
        return;
      }
      const index = getRandomInt(moves.length);
      const move = moves[index];
  
      // Piece Movement Logic
      for (let i = 0; i < pieces.length; i++) {
        piecesClone[i] = pieces[i];
      }
  
      // Move piece to new location
      const oldX = move.oldPosition.x;
      const oldY = move.oldPosition.y;
      const newX = move.newPosition.x;
      const newY = move.newPosition.y;

      piecesClone[newX + newY * 8] = move.piece;
      piecesClone[newX + newY * 8].position.x = newX;
      piecesClone[newX + newY * 8].position.y = newY;
  
      // Handle hasMoved for certain pieces
      const pieceType: PieceType = move.piece.type;
      if (pieceType === PieceType.PAWN || pieceType === PieceType.KING || pieceType === PieceType.ROOK) {
        piecesClone[newX + newY * 8].hasMoved = true;
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
        handlePiecesChange={handlePiecesChange}
        playUserMove={playUserMove}
        />
      {!isActiveGame && 
      <Options 
        handleGamemodeChange={handleGamemodeChange} 
        handleUserColorChange={handleUserColorChange} 
        startGame={startGame}
        />}
    </div>
  )
}

export default Game;