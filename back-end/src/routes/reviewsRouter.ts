import { Router, Request, Response } from "express";
import { pool } from "../db";
import type { Review } from "../types/review";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM reviews");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar reviews:", error);
    res.status(500).json({ error: "Error searching for reviews" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      `
      SELECT r.*, 
             u.name as user_name, u.email as user_email,
             rec.title as recipe_title, rec.description as recipe_description
      FROM reviews r
      LEFT JOIN users u ON r.userId = u.id
      LEFT JOIN recipes rec ON r.recipeId = rec.id
      WHERE r.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar review:", error);
    res.status(500).json({ error: "Error when searching for review" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { grade, comment, userId, recipeId } = req.body as Omit<Review, "id">;

    const result = await pool.query(
      `
      INSERT INTO reviews (grade, comment, userId, recipeId)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [grade, comment, userId, recipeId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar review:", error);
    res.status(500).json({ error: "Error creating review" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { grade, comment, userId, recipeId } = req.body as Omit<Review, "id">;

  try {
    const result = await pool.query(
      `
      UPDATE reviews
      SET grade = $1, comment = $2, userId = $3, recipeId = $4
      WHERE id = $5
      RETURNING *
      `,
      [grade, comment, userId, recipeId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar review:", error);
    res.status(500).json({ error: "Error updating review" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM reviews WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar review:", error);
    res.status(500).json({ error: "Error deleting review" });
  }
});

export default router;
