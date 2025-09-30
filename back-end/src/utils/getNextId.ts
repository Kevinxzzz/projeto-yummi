// utils/getNextId.js
import Counter from "../models/Counter";

export async function getNextId(modelName: String) {
  const counter = await Counter.findOneAndUpdate(
    { model: modelName },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  return counter.count;
}
