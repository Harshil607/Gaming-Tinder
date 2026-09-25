import mongoose, { mongo } from "mongoose";

const gameSchema = mongoose.Schema({
  externalId: {
    type: Number,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
  },

  genres: {
    type: [String],
    default: [],
  },

  tags: {
    type: [String],
    default: [],
  },

  platforms: {
    type: [String],
    default: [],
  },

  rating: {
    type: Number,
  },

  releaseDate: {
    type: Date,
  },
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
