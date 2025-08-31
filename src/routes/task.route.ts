import { Router } from "express";
import authHandler from "../middleware/auth.middleware";
import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTask,
} from "../controllers/task.controller";

const router = Router();

router.post("/:id", authHandler, createTask);
router.patch("/:id", authHandler, updateTask);
router.delete("/:id", authHandler, deleteTask);
router.get("/:id", authHandler, getProjectTasks);

export default router;
