import { useEffect } from "react";
import { useGameStore } from "../store/gameStore.js";
import { useState } from "react";

const Recommendations = () => {
  const { recommendedGames, getRecommendedGames } = useGameStore();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      const reqGames = await getRecommendedGames();
      if (!reqGames.success) {
        setError(reqGames.message);
      }
      setLoading(false);
    };
    loadData();
  }, []);
  const list = recommendedGames.map((rg) => (
    <li key={rg.game.externalId}>
      <img src={rg.game.image}></img>
      <h1>{rg.game.name}</h1>
      <h2>{rg.game.genres.join(", ")}</h2>
      <h2>Score: {rg.score}</h2>
      <p>{rg.game.description}</p>
    </li>
  ));
  return loading ? (
    <h1>Loading</h1>
  ) : error ? (
    <h1>{error}</h1>
  ) : recommendedGames.length === 0 ? (
    <h1>There are currently no recommendations</h1>
  ) : (
    <div className="recommendations">
      <ul>{list}</ul>
    </div>
  );
};

export default Recommendations;
