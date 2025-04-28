/** @format */

import jwt from "jsonwebtoken";
import { db } from "../db/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookie.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No Token Provided",
      });
    }

    let decoded = jwt.verify(token, process.env.JWT_SRCRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized- Invalid Token",
      });
    }
    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error authenticating user", error);
    res.status(500).json({
      message: "Error Authenticating User",
    });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMI") {
      return res.status(403).json({
        message: "Access Denied -Admins Only",
      });
    }
    next();
  } catch (error) {
    console.log("Error Checking Admin Role: ", error);
    res.status(500).json({
      message: "Error Checking Admin Role",
    });
  }
};
