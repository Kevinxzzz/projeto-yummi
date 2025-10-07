import { Router, Request, Response } from "express";
import { pool } from "../db";
import type { Recipe } from "../types/recipe";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM recipes");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    res.status(500).json({ error: "Error searching for recipes" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [
      id,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar receita:", error);
    res.status(500).json({ error: "Error fetching recipe" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      title,
      type,
      userId,
      ingredientId,
      image,
      prepTime,
      servings,
      description,
    } = req.body as Omit<Recipe, "id">;

    const result = await pool.query(
      `
      INSERT INTO recipes 
        (title, type, userId, ingredientId, image, prepTime, servings, description)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
      `,
      [
        title,
        type,
        userId,
        ingredientId,
        image,
        prepTime,
        servings,
        description,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    res.status(500).json({ error: "Error creating recipe" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const {
    title,
    type,
    userId,
    ingredientId,
    image,
    prepTime,
    servings,
    description,
  } = req.body as Omit<Recipe, "id">;

  try {
    const result = await pool.query(
      `
      UPDATE recipes SET 
        title = $1, type = $2, userId = $3, ingredientId = $4,
        image = $5, prepTime = $6, servings = $7, description = $8
      WHERE id = $9
      RETURNING *;
      `,
      [
        title,
        type,
        userId,
        ingredientId,
        image,
        prepTime,
        servings,
        description,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    res.status(500).json({ error: "Error updating recipe" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar receita:", error);
    res.status(500).json({ error: "Error deleting recipe" });
  }
});

export default router;
