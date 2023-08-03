import "./Tile.css";

interface Props {
  image?: string;
  number: number;
  index: number;
}

const Tile = ({ number, image, index }: Props) => {
  const color: String = number % 2 === 0 ? "black" : "white";
  // Renders black tile
  // For later use: {`(${index % 8}, ${Math.floor(index / 8)})`}
    return (
      <div className={`tile ${color}-tile`}>
        <div className="potential-hint">
          {image && (
            <div
              style={{ backgroundImage: `url(${image})` }}
              className="chess-piece"
            >{index}</div>)}
        </div>
      </div>
    );
};

export default Tile;
