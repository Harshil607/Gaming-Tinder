import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore.js";
const GameCard = () => {
  const { getGames, recordSwipe, getSwipes } = useGameStore();
  const [unseenGames, setUnseenGames] = useState([]);
  const [isSwiping, setIsSwiping] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const [gamesResult, swipesResult] = await Promise.all([
        getGames(),
        getSwipes(),
      ]);
      if (!gamesResult.success) {
        setError(gamesResult.message);
        setLoading(false);
        return;
      }
      if (!swipesResult.success) {
        setError(swipesResult.message);
        setLoading(false);
        return;
      }
      const swipes = swipesResult.data;
      const games = gamesResult.data;
      const filteredGames = games.filter(
        (game) => !swipes.some((swipe) => swipe.gameId === game.externalId),
      );
      setUnseenGames(filteredGames);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSwipe = async (action) => {
    setIsSwiping(true);
    const swipe = {
      gameId: unseenGames[0].externalId,
      action: action,
    };
    const result = await recordSwipe(swipe);
    setIsSwiping(false);
    if (!result.success) {
      setError(result.message);
    } else {
      setUnseenGames((g) => g.slice(1));
      setError(null);
    }
  };
  return loading ? (
    <h1>Loading...</h1>
  ) : error ? (
    <h1>{error}</h1>
  ) : unseenGames.length === 0 ? (
    <h1>You have swiped all games</h1>
  ) : (
    <div className="Game-Card">
      <div className="Game-Info">
        <img src={unseenGames[0].image}></img>
        <h1>{unseenGames[0].name}</h1>
        <h2>{unseenGames[0].genres.join(", ")}</h2>
        <p>{unseenGames[0].description}</p>
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
    </div>
  );
};

export default GameCard;
