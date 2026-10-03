import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/game.routes.js";
import authRouter from "./routes/auth.routes.js";

dotenv.config();

await connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
