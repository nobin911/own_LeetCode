/** @format */

import express from "express";
import {
  register,
  login,
  logout,
  check,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/check", check);

export default authRouter;
