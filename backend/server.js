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
    res.status(200).json({ success: true, data: newSwipe });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
