import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Game from "./models/game.model.js";
import Swipe from "./models/swipe.model.js";
dotenv.config();

await connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.get("/api/games", async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json({ success: true, data: games });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Couldn't fetch the games..." });
  }
});

app.post("/api/swipes", async (req, res) => {
  const swipe = req.body;
  if (swipe.action !== "like" && swipe.action !== "dislike") {
    return res.status(400).json({ success: false, message: "Invalid swipe" });
  }
  const newSwipe = new Swipe(swipe);
  try {
    await newSwipe.save();
    res.status(201).json({ success: true, data: newSwipe });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(409)
        .json({ success: false, message: "Game is already swiped" });
    } else {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
});

app.get("/api/swipes/:userId", async (req, res) => {
  const { userId } = req.params;
  if (isNaN(Number(userId))) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }
  try {
    const userSwipes = await Swipe.find({ userId: Number(userId) });
    res.status(200).json({ success: true, data: userSwipes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/api/recommendations/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const swipes = await Swipe.find({ userId: Number(userId) });
    const games = await Game.find({});
    const swippedGames = swipes.map((swipe) => {
      const game = games.find((game) => game.externalId === swipe.gameId);
      return {
        game: game,
        action: swipe.action,
      };
    });
    if (swipes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Start swiping to get recommendations",
      });
    }
    const genreScore = {};
    for (const swippedGame of swippedGames) {
      for (const genre of swippedGame.game.genres) {
        if (!(genre in genreScore)) {
          genreScore[genre] = 0;
        }
        if (swippedGame.action === "like") {
          genreScore[genre]++;
        } else {
          genreScore[genre]--;
        }
      }
    }
    const unseenGames = games.filter(
      (game) => !swipes.some((swipe) => swipe.gameId === game.externalId),
    );
    const scoredGames = unseenGames.map((ug) => {
      let score = 0;
      for (const genre of ug.genres) {
        if (!(genre in genreScore)) {
          score += 0;
        } else {
          score += genreScore[genre];
        }
      }
      return {
        game: ug,
        score: score,
      };
    });
    const recommendedGames = scoredGames.filter((sg) => sg.score >= 0);
    recommendedGames.sort((a, b) => b.score - a.score);
    res.status(200).json({ success: true, recommendations: recommendedGames });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
