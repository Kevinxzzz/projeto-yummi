import express from "express";
import usersRouter from "./src/routes/users";
import ingredientRouter from "./src/routes/ingredients";
import PreparationMethod from "./src/routes/preparationMethod";
import recipeRouter from "./src/routes/recipe";
import reviewRouter from "./src/routes/review";
import cors from "cors";
const app = express();
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const port = 3000;

app.use(express.json());

app.use("/users", usersRouter);
app.use("/ingredients", ingredientRouter);
app.use("/preparationMethods", PreparationMethod);
app.use("/recipes", recipeRouter);
app.use("/reviews", reviewRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
