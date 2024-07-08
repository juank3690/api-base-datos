import express from "express";
import authMiddleware from "../middleware/authMidleware.js";
import { createTask, getTasks, updateTask, deleteTask,updateTaskSection,getAllTasksUser} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.post("/tasks/:id_section",authMiddleware, createTask);
taskRouter.get("/tasks/:id_section",authMiddleware, getTasks);
taskRouter.put("/tasks/:id_task",authMiddleware, updateTask);
taskRouter.delete("/tasks/:id_task",authMiddleware, deleteTask);
taskRouter.patch("/tasks/:id_task",authMiddleware, updateTaskSection);
taskRouter.get("/tasks",authMiddleware, getAllTasksUser);

export default taskRouter;