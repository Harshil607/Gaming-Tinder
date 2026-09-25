import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.get("/api/recommendations", (req, res) => {
  res.status(200).json({ success: true, data: "recommended games" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listening on port ${PORT}...`);
});
