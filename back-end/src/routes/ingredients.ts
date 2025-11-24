import express from "express";
import { prisma } from "../db";
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).send("Error search ingredients");
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const ingredientId = parseInt(req.params.id);
    const ingredient = await prisma.ingredient.findUnique({
      where: {
        id: ingredientId,
      },
    });
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).send("Error search for this ingredient");
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { ingredients, recipeId } = req.body;
    const newIngredient = await prisma.ingredient.create({
      data: {
        ingredients,
        recipe: { connect: { id: recipeId } },
      },
    });
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(500).send({ message: "Error creating ingredient" });
  }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const ingredientId = parseInt(req.params.id);
    const { ingredients, recipeId } = req.body;
    const updateIngredient = await prisma.ingredient.update({
      where: {
        id: ingredientId,
      },
      data: {
        ingredients,
        recipe: { connect: { id: recipeId } },
      },
    });
    res.status(200).json(updateIngredient);
  } catch (error) {
    res.status(500).send("Error updating ingredient");
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const ingredientId = parseInt(req.params.id);
    await prisma.ingredient.delete({
      where: {
        id: ingredientId,
      },
    });
    res.status(204).send("Ingredient deleted");
  } catch (error) {
    res.status(500).send("Error deleting ingredient");
  }
});

export default router;
