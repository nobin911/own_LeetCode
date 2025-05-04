/** @format */

import bcrypt from "bcryptjs";
import { db } from "../db/db.js";
import { UserRole } from "../generated/prisma/index.js";
// import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "USer already Exists",
      });
    }

    //hashing the password

    const hashedPassword = await bcrypt.hash(password, 10);

    // const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole,
      },
    });

    // send mail

    // const mailTransporter = nodemailer.createTransport({
    //   host: process.env.MAIL_TRAP_HOST,
    //   port: process.env.MAIL_TRAP_PORT,
    //   secure: false, // true for port 465, false for other ports
    //   auth: {
    //     user: process.env.MAIL_TRAP_USERNAME,
    //     pass: process.env.MAIL_TRAP_PASSWORD,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.MAIL_TRAP_SENDER, // sender address
    //   to: user.email, // list of receivers
    //   subject: "verify account", // Subject line
    //   text: `Please click the following link: ${process.env.BACKEND_BASE_URL}/api/v1/users/verify/${verificationToken}`,
    // };

    // await mailTransporter.sendMail(mailOptions);

    //sending Success message

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
      message: "User is not Registered",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const verifyPassword = bcrypt.compare(password, user.passwod);

    if (!verifyPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    //token generation by jwt
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    //cookie option settings

    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };

    res.cookie("jwt", token, cookieOptions);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: "User Logged in Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Login Failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    };
    res.clearCookie("jwt", cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Error logging out user",
    });
  }
};
export const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({
      error: "Error checking user",
    });
  }
};
