import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users";

dotenv.config();
const app = express();
const PORT = 3000;
app.use(express.json());
app.use("/", userRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("error connecting to MongoDB", error);
  }
};
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
connectDB();
