import Project from "../models/project.model";
import Task from "../models/task.model";
import ApiError from "../utils/ApiError";
import AsyncHandler from "../utils/AsyncHandler";

// Create Task
export const createTask = AsyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const uid = req.user_data?.id;
  const { title, description } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  if (project.owner.toString() !== uid) {
    throw new ApiError(403, "Unauthorized");
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    owner: uid,
  });

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

// Update Task
export const updateTask = AsyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { title, description, status } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  if (task.owner?.toString() !== req.user_data?.id) {
    throw new ApiError(403, "Unauthorized");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { title, description, status },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
});

// Delete Task
export const deleteTask = AsyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  if (task.owner?.toString() !== req.user_data?.id) {
    throw new ApiError(403, "Unauthorized");
  }

  await Task.findByIdAndDelete(taskId);

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

// Get All Tasks for a Project
export const getProjectTasks = AsyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  if (project.owner.toString() !== req.user_data?.id) {
    throw new ApiError(403, "Unauthorized");
  }

  const tasks = await Task.find({ project: projectId });

  return res.status(200).json({
    success: true,
    message: "Tasks fetched successfully",
    tasks,
  });
});
