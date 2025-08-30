import { Router } from "express";
import authHandler from "../middleware/auth.middleware";
import {
  createProject,
  deleteProject,
  getAllProject,
  updateProject,
} from "../controllers/project.controller";

const router = Router();

router
  .route("/")
  .post(authHandler, createProject)
  .get(authHandler, getAllProject);

router
  .route("/:id")
  .patch(authHandler, updateProject)
  .delete(authHandler, deleteProject);

export default router;
