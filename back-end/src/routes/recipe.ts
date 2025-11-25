import express from "express";
import { prisma } from "../db";

const router = express.Router();

interface PreparationMethodsbody {
  steps: string[];
}
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      imageUrl,
      prepTime,
      servings,
      userId,
      difficulty,
    } = req.body;

    const data: any = {
      title,
      description,
      type,
      imageUrl,
      prepTime,
      servings,
      difficulty,
      user: { connect: { id: userId } },
    };

    const recipe = await prisma.recipe.create({ data });

    res.status(201).json(recipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const recipes = await prisma.recipe.findMany();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.get(
  "/allInformations",
  async (req: express.Request, res: express.Response) => {
    try {
      const recipes = await prisma.recipe.findMany({
        include: {
          ingredients: true,
          preparationMethods: true,
          reviews: true,
        },
      });
      res.status(200).json(recipes);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Failed to fetch recipe with all informations" });
    }
  }
);

router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const recipeId = parseInt(req.params.id);
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

router.get(
  "/user/:userId",
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const recipes = await prisma.recipe.findMany({
        where: { userId: userId },
      });
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes for user" });
    }
  }
);

router.get(
  "/allInformations/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const recipeId = parseInt(req.params.id);
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        include: {
          ingredients: true,
          preparationMethods: true,
        },
      });
      res.status(200).json(recipe);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch recipe with all informations" });
    }
  }
);

router.put("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const recipeId = parseInt(req.params.id);
    const {
      title,
      description,
      type,
      imageUrl,
      prepTime,
      servings,
      userId,
      difficulty,
    } = req.body;

    const data: any = {
      title,
      description,
      type,
      imageUrl,
      prepTime,
      servings,
      difficulty,
      user: { connect: { id: userId } },
    };

    const updateRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data,
    });
    res.status(200).json(updateRecipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const recipeId = parseInt(req.params.id);
    await prisma.recipe.delete({
      where: { id: recipeId },
    });
    res.status(204).send("recipe deleted");
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});
export default router;
