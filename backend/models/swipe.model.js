import mongoose from "mongoose";

const swipeSchema = mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  gameId: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    enum: ["like", "dislike"],
    required: true,
  },
});

const Swipe = mongoose.model("Swipe", swipeSchema);
export default Swipe;
