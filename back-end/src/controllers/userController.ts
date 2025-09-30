import { Request, Response } from "express";
import User from "../models/User";
import { getNextId } from "../utils/getNextId";
export const createUser = async (req: Request, res: Response) => {
  try {
    const nextId = await getNextId("User");
    const { id, name, email, password } = req.body;
    const newUser = await User.create({ id: nextId, name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "error creating user" });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    res.status(500).json({ error: "error searching for users" });
  }
};
