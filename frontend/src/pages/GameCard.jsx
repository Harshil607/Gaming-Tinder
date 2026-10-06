import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore.js";
import { useNavigate } from "react-router-dom";
const GameCard = () => {
  const MIN_SWIPES = 10;
  const [swipecount, setSwipecount] = useState(0);
  const { getGames, recordSwipe, getSwipes } = useGameStore();
  const [unseenGames, setUnseenGames] = useState([]);
  const [isSwiping, setIsSwiping] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
      setSwipecount(swipes.length);
      const games = gamesResult.data;
      const filteredGames = games.filter(
        (game) => !swipes.some((swipe) => swipe.gameId === game.externalId),
      );
      setUnseenGames(filteredGames);
      setLoading(false);
    };

    loadData();
  }, []);

  const getRecommendations = () => {
    navigate("/recommendations");
  };

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
      setSwipecount((sc) => sc + 1);
      setUnseenGames((g) => g.slice(1));
      setError(null);
    }
  };
  return loading ? (
    <h1>Loading...</h1>
  ) : error ? (
    <h1>{error}</h1>
  ) : unseenGames.length === 0 ? (
    <div>
      <h1>You have swiped all games</h1>
      {swipecount >= MIN_SWIPES && (
        <div>
          <p>Your recommendations are ready!</p>
          <button onClick={getRecommendations}>View Recommendations</button>
        </div>
      )}
    </div>
  ) : (
    <div>
      <div className="Game-Card">
        <div className="Game-Info">
          <img src={unseenGames[0].image} alt={unseenGames[0].name}></img>
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
      {swipecount >= MIN_SWIPES && (
        <div>
          <p>Your recommendations are ready!</p>
          <button onClick={getRecommendations}>View Recommendations</button>
        </div>
      )}
    </div>
  );
};

export default GameCard;
