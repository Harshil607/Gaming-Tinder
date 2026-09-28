import { getGames } from "../services/igdb.services.js";
import { connectDB } from "../config/db.js";
import Game from "../models/game.model.js";

await connectDB();

const games = await getGames();
const reqGames = games.map((game) => ({
  externalId: game.id,
  name: game.name,
  description: game.summary || "",
  image: `https:${game.cover.url}`,
  genres: game.genres ? game.genres.map((genre) => genre.name) : [],
  platforms: game.platforms
    ? game.platforms.map((platform) => platform.name)
    : [],
}));

try {
  await Game.insertMany(reqGames);
  console.log("Added games to DB...");
} catch (error) {
  console.log(`Error: ${error.message}`);
}
