/** @format */

import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { executeCode } from "../controllers/executeCode.controller.js";

const executionRoute = express.Router();

executionRoute.post("/", authMiddleware, executeCode);
export default executionRoute;
