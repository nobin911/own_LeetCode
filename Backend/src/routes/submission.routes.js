/** @format */

import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import {
  getAllSubmission,
  getAllSubmissionForProblem,
  getAllTheSubmissionsForProblem,
} from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmission);

submissionRoutes.get(
  "/get-submission/:problemId",
  authMiddleware,
  getAllSubmissionForProblem
);

submissionRoutes.get(
  "/get-submissions-count/:problemId",
  authMiddleware,
  getAllTheSubmissionsForProblem
);

export default submissionRoutes;
