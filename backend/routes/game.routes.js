import express from "express";
import {
  getGames,
  getSwipes,
  postSwipes,
  getRecommendations,
} from "../controller/game.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/test-auth", protect, (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "You are authenticated" });
});
router.get("/games", getGames);
router.post("/swipes", protect, postSwipes);
router.get("/swipes", protect, getSwipes);
router.get("/recommendations", protect, getRecommendations);

export default router;
