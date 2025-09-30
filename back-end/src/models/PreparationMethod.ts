import mongoose from "mongoose";

const PreparationMethodSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  step: { type: String, required: true },
  Order: { type: Number, required: true },
  repiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repice",
    required: true,
  },
});

export default mongoose.model("Preparation Method", PreparationMethodSchema);
