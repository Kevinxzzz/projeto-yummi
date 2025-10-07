import { Router, Request, Response } from "express";
import { pool } from "../db";
import type { PreparationMethod } from "../types/preparationMethod";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM preparationmethods");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar métodos de preparo:", error);
    res.status(500).json({ error: "Erro ao buscar métodos de preparo" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const result = await pool.query(
      "SELECT * FROM preparationmethods WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Método de preparo não encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar método de preparo:", error);
    res.status(500).json({ error: "Erro ao buscar método de preparo" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { step, recipeId } = req.body as Pick<
    PreparationMethod,
    "step" | "recipeId"
  >;
  console.log("AQUI req.body:", req.body);
  try {
    const result = await pool.query(
      "INSERT INTO preparationmethods (step, recipeId) VALUES ($1, $2) RETURNING *",
      [step, recipeId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar método de preparo:", error);
    res.status(500).json({ error: "Erro ao criar método de preparo" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { step, recipeId } = req.body || {};

  if (!Array.isArray(step) || typeof recipeId !== "number") {
    return res.status(400).json({
      error: "Campos obrigatórios: step (array de strings) e recipeId (número)",
    });
  }

  try {
    const result = await pool.query(
      "UPDATE preparationmethods SET step = $1, recipeId = $2 WHERE id = $3 RETURNING *",
      [step, recipeId, id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Método de preparo não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar método de preparo:", error);
    res.status(500).json({ error: "Erro ao atualizar método de preparo" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM preparationmethods WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Método de preparo não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar método de preparo:", error);
    res.status(500).json({ error: "Erro ao deletar método de preparo" });
  }
});

export default router;
