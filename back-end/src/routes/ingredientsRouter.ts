import { Router, Request, Response } from "express";
import { pool } from "../db";
import type { Ingredient } from "../types/ingredient";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM ingredients");
  res.json(result.rows);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await pool.query("SELECT * FROM ingredients WHERE id = $1", [
    id,
  ]);
  res.json(result.rows[0]);
});

router.post("/", async (req: Request, res: Response) => {
  const { ingredient } = req.body as Pick<Ingredient, "ingredient">;
  const result = await pool.query(
    "INSERT INTO ingredients (ingredient) VALUES ($1) RETURNING *",
    [ingredient]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { ingredient } = req.body as Pick<Ingredient, "ingredient">;
  const result = await pool.query(
    "UPDATE ingredients SET ingredient = $1 WHERE id = $2 RETURNING *",
    [ingredient, id]
  );
  res.json(result.rows[0]);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await pool.query("DELETE FROM ingredients WHERE id = $1", [id]);
  res.status(204).send();
});

export default router;
