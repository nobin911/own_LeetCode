/** @format */

import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// docker run --name my-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
