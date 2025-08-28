import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AsyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import User from "../models/User";

declare module "express-serve-static-core" {
  interface Request {
    user_data?: {
      id: string;
      email: string;
    };
  }
}

const authHandler = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    const header_jwt_token = authorization?.split(" ")[1];
    if (!header_jwt_token) {
      throw new ApiError(401, "Unauthorized request");
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(404, "JWT_SECRET not set in environment variables");
    }

    const decoded = jwt.verify(
      header_jwt_token,
      process.env.JWT_SECRET
    ) as JwtPayload & {
      id: string;
      email: string;
    };

    if (!decoded?.id || !decoded?.email) {
      throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user_data = { id: decoded.id, email: decoded.email };

    next();
  }
);

export default authHandler;
