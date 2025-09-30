import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  quantity: { type: String, required: true },
});

export default mongoose.model("Igredient", IngredientSchema);
