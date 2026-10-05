import Game from "../models/game.model.js";
import Swipe from "../models/swipe.model.js";

export const getGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json({ success: true, data: games });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Couldn't fetch the games..." });
  }
};

export const postSwipes = async (req, res) => {
  const swipe = {
    userId: req.user.userId,
    gameId: req.body.gameId,
    action: req.body.action,
  };
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
};

export const getSwipes = async (req, res) => {
  const userId = req.user.userId;
  try {
    const userSwipes = await Swipe.find({ userId });
    res.status(200).json({ success: true, data: userSwipes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getRecommendations = async (req, res) => {
  const userId = req.user.userId;
  try {
    const swipes = await Swipe.find({ userId });
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
      const weight = swippedGame.game.genres.length;
      if (weight === 0) {
        continue;
      }
      for (const genre of swippedGame.game.genres) {
        if (!(genre in genreScore)) {
          genreScore[genre] = 0;
        }
        if (swippedGame.action === "like") {
          genreScore[genre] += 1 / weight;
        } else {
          genreScore[genre] -= 1 / weight;
        }
      }
    }
    const unseenGames = games.filter(
      (game) => !swipes.some((swipe) => swipe.gameId === game.externalId),
    );
    const scoredGames = unseenGames.map((ug) => {
      let score = 0;
      const weight = ug.genres.length;
      for (const genre of ug.genres) {
        if (!(genre in genreScore)) {
          score += 0;
        } else {
          score += genreScore[genre] / weight;
        }
      }
      return {
        game: ug,
        score: score,
      };
    });
    const recommendedGames = scoredGames.filter((sg) => sg.score > 0);
    recommendedGames.sort((a, b) => b.score - a.score);
    res.status(200).json({ success: true, recommendations: recommendedGames });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
