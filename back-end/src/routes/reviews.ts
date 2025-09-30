import { Router } from "express";
import {
  createReview,
  getReview,
  getReviewById,
} from "../controllers/reviewController";

const router = Router();

router.post("reviews", createReview);
router.get("/reviews", getReview);
router.get("/reviews/:id", getReviewById);

export default router;
