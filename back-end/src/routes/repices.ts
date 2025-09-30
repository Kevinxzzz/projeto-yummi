import { Router } from "express";
import { createRepice, getRepice } from "../controllers/repiceController";

const router = Router();

router.post("/repices", createRepice);
router.get("/repices", getRepice);
