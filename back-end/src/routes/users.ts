import express from "express";
import { prisma } from "../db";
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Error search users");
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Error search for this user");
  }
});

router.get(
  "/userName/:userName",
  async (req: express.Request, res: express.Response) => {
    try {
      const userName = String(req.params.userName);
      const user = await prisma.user.findUnique({
        where: {
          userName: userName,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error search for this user");
    }
  }
);

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { name, userName, email, password } = req.body;

    const verifyExisting = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { userName: userName }],
      },
    });
    if (verifyExisting) {
      return res
        .status(400)
        .json({ message: "User with this email or username already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        userName,
        email,
        password,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send({ message: "Error creating user" });
  }
});

router.post("/login", async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password !== user?.password) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Error search for this user");
  }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, userName, email, password } = req.body;
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: { name, userName, email, password },
    });
    res
      .status(200)
      .json({ message: "User updated successfully", user: updateUser });
  } catch (error) {
    res.status(500).send("Error updating user");
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const userId = parseInt(req.params.id);
    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(204).send("User deleted");
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
});

export default router;
