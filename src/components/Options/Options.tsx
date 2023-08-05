import {useState} from "react";
import { PieceColor } from "../../utils";
import "./Options.css"

interface Props {
  handleUserColorChange: (color: PieceColor) => void;
  playGame: () => void;
}

const Options = ({ handleUserColorChange, playGame }: Props) => {

  const [color, setColor] = useState(PieceColor.WHITE);

  const handleStartGameButton = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUserColorChange(color);
    playGame();
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
        <fieldset>
          <legend>Select Your Color</legend>
          <div>
            <input type="radio" name="color" value={PieceColor.WHITE} id="play-white" onChange={handleColorChange} />
            <label htmlFor="play-white">&nbsp; White</label>
          </div>
          <div>
            <input type="radio" name="color" value={PieceColor.BLACK} id="play-black" onChange={handleColorChange}/>
            <label htmlFor="play-black">&nbsp; Black</label>
          </div>
        </fieldset>
        <button className="start-button">Start Game</button>
      </form>
    </div>
  )
}

export default Options;