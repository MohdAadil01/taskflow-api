import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/brcypt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    const hashPass = await hashPassword(password);
    const newUser = await User.create({ name, email, hashPass });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (e) {
    console.log("Error while registering user...");
    console.log(e);
  }
};
