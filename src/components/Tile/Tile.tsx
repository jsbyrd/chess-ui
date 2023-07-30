import "./Tile.css";

interface Props {
  image?: string;
  number: number;
}

const Tile = ({ number, image }: Props) => {
  const color: String = number % 2 === 0 ? "black" : "white";
  // Renders black tile
    return (
      <div className={`tile ${color}-tile`}>
        <div className="potential-hint">
          {image && (
            <div
              style={{ backgroundImage: `url(${image})` }}
              className="chess-piece"
            ></div>)}
        </div>
      </div>
    );
};

export default Tile;
