import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore.js";
const GameCard = () => {
  const { games, getGames, recordSwipe } = useGameStore();
  useEffect(() => {
    getGames();
  }, []);
  const [currIdx, setCurrIdx] = useState(0);
  const handleLike = async () => {
    const swipe = {
      userId: 123,
      gameId: games[currIdx].externalId,
      action: "like",
    };
    const result = await recordSwipe(swipe);
    if (result.success) {
      setCurrIdx((c) => (c + 1) % games.length);
    }
  };
  const handleDislike = async () => {
    const swipe = {
      userId: 123,
      gameId: games[currIdx].externalId,
      action: "dislike",
    };
    const result = await recordSwipe(swipe);
    if (result.success) {
      setCurrIdx((c) => (c + 1) % games.length);
    }
  };
  return games.length === 0 ? (
    <h1>Loading...</h1>
  ) : (
    <div className="Game-Card">
      <div className="Game-Info">
        <img src={games[currIdx].image}></img>
        <h1>{games[currIdx].name}</h1>
        <h2>{games[currIdx].genres.join(", ")}</h2>
        <p>{games[currIdx].description}</p>
      </div>

      <button id="like-btn" onClick={handleLike}>
        ❤️
      </button>
      <button id="dislike-btn" onClick={handleDislike}>
        ❌
      </button>
    </div>
  );
};

export default GameCard;
