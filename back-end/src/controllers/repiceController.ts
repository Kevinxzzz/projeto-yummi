import { Request, Response } from "express";
import Repice from "../models/Repice";

export const createRepice = async (req: Request, res: Response) => {
  try {
    const { name, type, userId, ingredientId } = req.body;
    const newRepice = await Repice.create({ name, type, userId, ingredientId });
    res.status(201).json(newRepice);
  } catch (error) {
    res.status(500).json({ error: "error creating repice" });
  }
};

export const getRepice = async (req: Request, res: Response) => {
  try {
    const getRepice = await Repice.find();
    res.status(201).json(getRepice);
  } catch (error) {
    res.status(500).json({ error: "error searching for repices" });
  }
};
