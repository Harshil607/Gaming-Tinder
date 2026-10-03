import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore.js";
const GameCard = () => {
  const { getGames, recordSwipe, getSwipes } = useGameStore();
  const [unseenGames, setUnseenGames] = useState([]);
  const [currIdx, setCurrIdx] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      const gamesResult = await getGames();
      const swipesResult = await getSwipes(123);

      const swipes = swipesResult.data;
      const games = gamesResult.data;
      const filteredGames = games.filter(
        (game) => !swipes.some((swipe) => swipe.gameId === game.externalId),
      );
      setUnseenGames(filteredGames);
      console.log("Unseen games", filteredGames);
    };

    loadData();
  }, []);

  const handleSwipe = async (action) => {
    setIsSwiping(true);
    const swipe = {
      userId: 123,
      gameId: unseenGames[currIdx].externalId,
      action: action,
    };
    const result = await recordSwipe(swipe);
    setIsSwiping(false);
    if (!result.success) {
      setError(result.message);
    }
    if (result.success) {
      if (currIdx === unseenGames.length - 1) {
        setCurrIdx(-1);
      } else {
        setCurrIdx((c) => c + 1);
      }
      setError(null);
    }
  };
  return unseenGames.length === 0 ? (
    <h1>Loading...</h1>
  ) : currIdx === -1 ? (
    <h1>You have reached the end of the list</h1>
  ) : (
    <div className="Game-Card">
      <div className="Game-Info">
        <img src={unseenGames[currIdx].image}></img>
        <h1>{unseenGames[currIdx].name}</h1>
        <h2>{unseenGames[currIdx].genres.join(", ")}</h2>
        <p>{unseenGames[currIdx].description}</p>
      </div>

      <button
        id="like-btn"
        disabled={isSwiping}
        onClick={() => handleSwipe("like")}>
        ❤️
      </button>
      <button
        id="dislike-btn"
        disabled={isSwiping}
        onClick={() => handleSwipe("dislike")}>
        ❌
      </button>
      {error && <h1 className="error">{error}</h1>}
    </div>
  );
};

export default GameCard;
