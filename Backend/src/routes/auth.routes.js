/** @format */

import express from "express";
import {
  register,
  login,
  logout,
  check,
} from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/check", check);

export default userRouter;
