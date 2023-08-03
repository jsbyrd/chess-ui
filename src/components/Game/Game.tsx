import { useState } from "react";
import Chessboard from "../Chessboard/Chessboard";
import Options from "../Options/Options"
import { PieceColor } from "../../utils";
import "./Game.css";

const Game = () => {
  const [isActiveGame, setIsActiveGame] = useState(false);
  const [activeColor, setActiveColor] = useState(PieceColor.WHITE);
  const [userColor, setUserColor] = useState(PieceColor.WHITE);
  const [turn, setTurn] = useState(0);

  const handleUserColorChange = (color: PieceColor) => {
    setUserColor(color);
  }

  const handleIsActiveGameChange = (isActive: boolean) => {
    setIsActiveGame(isActive);
  }

  return (
    <div className="game-container">
      <Chessboard userColor={userColor} />
      {!isActiveGame && <Options handleUserColorChange={handleUserColorChange} handleIsActiveGameChange={handleIsActiveGameChange}/>}
    </div>
  )
}

export default Game;