import express from "express";
import {
  getGames,
  getSwipes,
  postSwipes,
  getRecommendations,
} from "../controller/game.controller.js";

const router = express.Router();

router.get("/games", getGames);
router.post("/swipes", postSwipes);
router.get("/swipes/:userId", getSwipes);
router.get("/recommendations/:userId", getRecommendations);

export default router;
