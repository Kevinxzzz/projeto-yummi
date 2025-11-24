import express from "express";
import { prisma } from "../db";
import { connect } from "http2";
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const preparationMethods = await prisma.preparationMethod.findMany();
    res.status(200).json(preparationMethods);
  } catch (error) {
    res.status(500).send("Error fetching preparation methods");
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const methodId = parseInt(req.params.id);
    const method = await prisma.preparationMethod.findUnique({
      where: {
        id: methodId,
      },
    });
    res.status(200).json(method);
  } catch (error) {
    res.status(500).send("Error fetching this preparation method");
  }
});

router.get(
  "/recipe/:recipeId",
  async (req: express.Request, res: express.Response) => {
    try {
      const recipeId = parseInt(req.params.recipeId);
      const methods = await prisma.preparationMethod.findMany({
        where: {
          recipeId: recipeId,
        },
      });
      res.status(200).json(methods);
    } catch (error) {
      res.status(500).send("Error fetching preparation methods for this user");
    }
  }
);

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { steps, recipeId } = req.body;
    const newMethod = await prisma.preparationMethod.create({
      data: {
        steps,
        recipe: {connect:{ id: recipeId}},
      },
    });
    res.status(201).json(newMethod);
  } catch (error) {
    res.status(500).send("Error creating preparation method");
  }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const methodId = parseInt(req.params.id);
    const { steps, recipeId } = req.body;
    const updatedMethod = await prisma.preparationMethod.update({
      where: {
        id: methodId,
      },
      data: {
        steps,
        recipe: {connect: {id: recipeId}},
      },
    });
    res.status(200).json(updatedMethod);
  } catch (error) {
    res.status(500).send("Error updating preparation method");
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const methodId = parseInt(req.params.id);
    await prisma.preparationMethod.delete({
      where: {
        id: methodId,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send({
      error: "Error deleting preparation method",
      details: {
        message: (error as Error).message,
      },
    });
  }
});

export default router;
