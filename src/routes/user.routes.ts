import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";

const userRoute = Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);

export default userRoute;
