import { Router } from "express";
import { getUserProfile, updateUserProfile} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMidleware.js";

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get("/user/profile", getUserProfile);
userRouter.put("/user/profile", updateUserProfile);

export default userRouter;