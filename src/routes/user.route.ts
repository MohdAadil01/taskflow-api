import { Router } from "express";
import {
  getUserInfo,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import authHandler from "../middleware/auth.middleware";

const userRoute = Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);

userRoute.get("/me", authHandler, getUserInfo);

export default userRoute;
