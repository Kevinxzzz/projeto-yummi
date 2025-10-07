import { Router, Request, Response } from 'express';
import { pool } from '../db';
import type { User } from '../types/user';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  res.json(result.rows[0]);
});

router.post('/', async (req: Request, res: Response) => {
  const { name, email, password } = req.body as Pick<User, 'name' | 'email' | 'password'>;
  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, password]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, password } = req.body as Pick<User, 'name' | 'email' | 'password'>;
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
    [name, email, password, id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  res.status(204).send();
});

export default router;
