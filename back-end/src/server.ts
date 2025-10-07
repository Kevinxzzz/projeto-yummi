import express from "express";
import usersRouter from "./routes/usersRouter";
import ingredientsRouter from "./routes/ingredientsRouter";
import PreparationMethodsRouter from "./routes/preparationMethodsRouter";
import recipesRouter from "./routes/recipesRouter";
import reviewsRouter from "./routes/reviewsRouter";
import { createTables } from "./db/migrations";

const app = express();
app.use(express.json());

app.use("/users", usersRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/preparationMethods", PreparationMethodsRouter);
app.use("/recipes", recipesRouter);
app.use("/reviews", reviewsRouter);

createTables()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000");
    });
  })
  .catch((err) => {
    console.error("Erro ao criar tabelas", err);
  });
