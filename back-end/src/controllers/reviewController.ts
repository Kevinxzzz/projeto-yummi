import { Request, Response } from "express";
import Review from "../models/review";

export const createReview = async (req: Request, res: Response) => {
  try {
    const { grade, comment, userId, repiceId } = req.body;
    const newReview = await Review.create({ grade, comment, userId, repiceId });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: "error creating review" });
  }
};

export const getReview = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find();
    res.status(201).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "error searching for reviews" });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const reviewFK = await Review.findById(req.params.id)
      .populate("userId")
      .populate("repiceId");
    res.status(201).json(reviewFK);
    if (!Review) return res.status(404).json({ message: "Review not found" });
  } catch (error) {
    res.status(500).json({ error: "Error when searching for review" });
  }
};
