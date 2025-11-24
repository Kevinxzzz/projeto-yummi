import express from "express";
import { prisma } from "../db";
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const recipes = await prisma.recipe.findMany();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const {rating, comment, userId, recipeId} = req.body;
    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        recipeId
      },
    });
    res.status(201).json(newReview);
  }catch (error) {
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

export default router;