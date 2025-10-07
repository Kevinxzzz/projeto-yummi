import { pool } from "../db";

export async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id SERIAL PRIMARY KEY,
      ingredient TEXT[] NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(100)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      userId INTEGER,
      ingredientId INTEGER,
      image VARCHAR(255),
      prepTime VARCHAR(100),
      servings INTEGER,
      description TEXT,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (ingredientId) REFERENCES ingredients(id) ON DELETE SET NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS preparationmethods (
      id SERIAL PRIMARY KEY,
      step TEXT[] NOT NULL,
      recipeId INTEGER,
      FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      grade INTEGER NOT NULL,
      comment TEXT,
      userId INTEGER,
      recipeId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE
    );
  `);

  console.log("Tabelas criadas com sucesso!");
}
