/** @format */

import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middlewares.js";
import {
  createProblems,
  getAllProblems,
  getAllSolvedProblemsByUser,
  getProblemById,
  updateProblem,
  deleteProblem,
} from "../controllers/problem.controller.js";

const problemRoutes = Router();

problemRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblems
);

problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);
problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);
problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem
);
problemRoutes.delete(
  "/delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem
);

problemRoutes.get(
  "/get-solved-problem",
  authMiddleware,
  getAllSolvedProblemsByUser
);

export default problemRoutes;
