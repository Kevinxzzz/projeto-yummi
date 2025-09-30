import mongoose from "mongoose";

const RepiceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Igredient",
    required: false,
  },
});

export default mongoose.model("Repice", RepiceSchema);
