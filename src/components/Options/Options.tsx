import {useState} from "react";
import { PieceColor } from "../../utils";
import "./Options.css"

interface Props {
  handleGamemodeChange: (mode: string) => void;
  handleUserColorChange: (color: PieceColor) => void;
  startGame: () => void;
}

const Options = ({ handleGamemodeChange, handleUserColorChange, startGame }: Props) => {

  const [color, setColor] = useState(PieceColor.WHITE);

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleGamemodeChange(e.target.value);
  }

  const handleStartGameButton = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUserColorChange(color);
    startGame();
  }


  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenColor: string = e.target.value;
    if (chosenColor === PieceColor.WHITE) {
      setColor(PieceColor.WHITE)
    } else if (chosenColor === PieceColor.BLACK) {
      setColor(PieceColor.BLACK);
    } else {
      console.log("Uh oh... your radio buttons arent working!");
    }
  }

  return (
    <div className="options-container">
      <form className="options-form-container" onSubmit={handleStartGameButton}>
        <fieldset className="choose-color">
          <legend className="legend">Select Your Color</legend>
          <div>
            <input type="radio" name="color" value={PieceColor.WHITE} id="play-white" onChange={handleColorChange} />
            <label htmlFor="play-white">&nbsp; White</label>
          </div>
          <div>
            <input type="radio" name="color" value={PieceColor.BLACK} id="play-black" onChange={handleColorChange}/>
            <label htmlFor="play-black">&nbsp; Black</label>
          </div>
        </fieldset>
        <fieldset className="choose-gamemode">
          <legend className="legend">Select Your Gamemode</legend>
          <div>
            <input type="radio" name="mode" value="freestyle" id="freestyle" onChange={handleModeChange} />
            <label htmlFor="play-white">&nbsp; Freestyle</label>
          </div>
          <div>
            <input type="radio" name="mode" value="random" id="random" onChange={handleModeChange}/>
            <label htmlFor="play-black">&nbsp; Random AI</label>
          </div>
          <div>
            <input type="radio" name="mode" value="custom" id="custom" onChange={handleModeChange}/>
            <label htmlFor="play-black">&nbsp; Custom AI</label>
          </div>
        </fieldset>
        <button className="start-button">Start Game</button>
      </form>
    </div>
  )
}

export default Options;