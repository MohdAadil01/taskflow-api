import Project from "../models/project.model";
import ApiError from "../utils/ApiError";
import AsyncHandler from "../utils/AsyncHandler";

const createProject = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const { id } = req.user_data!;

  if (!id) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (!name || !description) {
    throw new ApiError(400, "All fields are required");
  }

  const newProject = await Project.create({
    name,
    description,
    owner: id,
  });

  return res.status(201).json({
    success: true,
    message: "Created new project",
    project: newProject,
  });
});

const updateProject = AsyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isAuthorized = project.owner.toString() === req.user_data?.id;
  if (!isAuthorized) {
    throw new ApiError(403, "You are not authorized to update this project");
  }

  const { name, description } = req.body;

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { name, description },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Updated project",
    project: updatedProject,
  });
});

const deleteProject = AsyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isAuthorized = project.owner.toString() === req.user_data?.id;
  if (!isAuthorized) {
    throw new ApiError(403, "You are not authorized to delete this project");
  }

  await Project.findByIdAndDelete(projectId);

  return res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});

const getAllProject = AsyncHandler(async (req, res) => {
  const owner_id = req.user_data?.id;
  const allProjects = await Project.find({ owner: owner_id });

  return res.status(200).json({
    success: true,
    message: "Fetched all projects",
    projects: allProjects,
  });
});

export { createProject, updateProject, deleteProject, getAllProject };
