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

router.post("/allInformations", async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      imageUrl,
      prepTime,
      servings,
      difficulty,
      userId,
      ingredients,
      preparationMethods,
    } = req.body;

    // Validações básicas
    if (!title || !description || !type || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Garantir que ingredients e preparationMethods sejam arrays (ou transformar)
    const normalizedIngredients = Array.isArray(ingredients) ? ingredients : [];
    const normalizedPreparationMethods = Array.isArray(preparationMethods)
      ? preparationMethods
      : [];

    // Transação: cria receita e os registros relacionados
    const createdRecipe = await prisma.$transaction(async (tx) => {
      // 1) cria a receita
      const recipe = await tx.recipe.create({
        data: {
          title,
          description,
          type,
          imageUrl,
          prepTime,
          servings,
          difficulty,
          user: { connect: { id: Number(userId) } },
        },
      });

      // 2) cria registro de ingredients (assumindo que sua tabela/Model aceita um array no campo 'ingredients')
      if (normalizedIngredients.length > 0) {
        await tx.ingredient.create({
          data: {
            recipeId: recipe.id,
            ingredients: normalizedIngredients, // grava o array direto, como no seu PUT
          },
        });
      }

      // 3) cria registro de preparationMethods (assumindo campo 'steps' que recebe array)
      if (normalizedPreparationMethods.length > 0) {
        await tx.preparationMethod.create({
          data: {
            recipeId: recipe.id,
            steps: normalizedPreparationMethods, // grava o array direto
          },
        });
      }

      return recipe;
    });

    // Buscar a receita completa com relations para retornar ao cliente
    const fullRecipe = await prisma.recipe.findUnique({
      where: { id: createdRecipe.id },
      include: {
        ingredients: true,
        preparationMethods: true,
      },
    });

    return res.status(201).json(fullRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return res.status(500).json({ error: "Failed to create recipe" });
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

router.get(
  "/allInformations/userId/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = parseInt(req.params.id);
      const recipe = await prisma.recipe.findMany({
        where: { userId: userId },
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

router.put("/allInformations/:id", async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);

    const {
      title,
      description,
      type,
      imageUrl,
      prepTime,
      servings,
      difficulty,
      userId,
      ingredients,
      preparationMethods,
    } = req.body;

    await prisma.$transaction(async (prisma) => {
      // Atualiza receita
      await prisma.recipe.update({
        where: { id: recipeId },
        data: {
          title,
          description,
          type,
          imageUrl,
          prepTime,
          servings,
          difficulty,
          user: { connect: { id: userId } },
        },
      });

      await prisma.ingredient.deleteMany({ where: { recipeId } });

if (ingredients?.length > 0) {
  await prisma.ingredient.create({
    data: {
      recipeId,
      ingredients, // ← aqui vai direto o array
    },
  });
}


      // Métodos de preparo
      await prisma.preparationMethod.deleteMany({ where: { recipeId } });

      if (preparationMethods?.length > 0) {
  await prisma.preparationMethod.create({
    data: {
      recipeId,
      steps: preparationMethods, // ← aqui vai direto o array
    },
  });
}
    });

    // Retorna receita atualizada
    const updatedRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: true,
        preparationMethods: true,
      },
    });

    res.status(200).json(updatedRecipe);

  } catch (error) {
    console.log(error);
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
