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
swipeSchema.index({ userId: 1, gameId: 1 }, { unique: true });
const Swipe = mongoose.model("Swipe", swipeSchema);
export default Swipe;
