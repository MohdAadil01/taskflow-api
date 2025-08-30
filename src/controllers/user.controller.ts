import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/user.model";
import { hashPassword } from "../utils/brcypt";
import ApiError from "../utils/ApiError";
import AsyncHandler from "../utils/AsyncHandler";

export const registerUser = AsyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email already registered");
    }

    const hashPass = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashPass,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { name, email },
    });
  }
);

export const loginUser = AsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const jwt_token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRY || "7d" } as SignOptions
  );

  res.status(200).json({
    message: "Login successful",
    jwt_token,
  });
});

export const getUserInfo = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user_data!;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new ApiError(404, "No user found");
  }

  return res.status(200).json({
    success: true,
    message: "User found",
    user,
  });
});
