import express from "express";
import authMiddleware from "../middleware/authMidleware.js";
import { createSection,getSections,updateSection,deleteSection,getAllSectionsUser } from "../controllers/sectionController.js";


const sectionRouter = express.Router();


sectionRouter.post("/sections/:id_user",authMiddleware, createSection);
sectionRouter.get("/sections/:id_user",authMiddleware, getSections);
sectionRouter.put("/sections/:id_section",authMiddleware, updateSection);
sectionRouter.delete("/sections/:id_section",authMiddleware, deleteSection);
sectionRouter.get("/sections",authMiddleware, getAllSectionsUser);


export default sectionRouter;