import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  grade: { type: Number, required: true },
  comment: { type: String, required: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  repiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repice",
    required: true,
  },
});

export default mongoose.model("Review", reviewSchema);
