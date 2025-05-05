/** @format */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

//importing custom routes
import userRoutes from "./src/routes/auth.routes.js";
import problemRoutes from "./src/routes/problem.routes.js";
import executionRoutes from "./src/routes/executeCode.routes.js";
import submissionRoutes from "./src/routes/submission.routes.js";

import playlistRoutes from ".src/routes/playlist.routes.js";

//app initialization
const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("welcome judge0");
});

//routes

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
